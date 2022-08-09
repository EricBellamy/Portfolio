precision mediump float;

// 9-tap bilinear upsampler (tent filter)
vec4 UpsampleTent(sampler2D tex, vec2 uv, vec2 texel_size)
{
    vec4 d = texel_size.xyxy * vec4(1.0, 1.0, -1.0, 0.0);

    vec4 s;
    s = texture2D(tex, uv - d.xy);
    s += texture2D(tex, uv - d.wy) * 2.0;
    s += texture2D(tex, uv - d.zy);

    s += texture2D(tex, uv + d.zw) * 2.0;
    s += texture2D(tex, uv       ) * 4.0;
    s += texture2D(tex, uv + d.xw) * 2.0;

    s += texture2D(tex, uv + d.zy);
    s += texture2D(tex, uv + d.wy) * 2.0;
    s += texture2D(tex, uv + d.xy);

    return s * (1.0 / 16.0);
}

vec4 UpsampleBox(sampler2D tex, vec2 uv, vec2 texel_size){
    vec4 d = texel_size.xyxy * vec4(-1.0, -1.0, 1.0, 1.0) * (vec4(1.0,1.0,1.0,1.0) * 1.0);

    vec4 s;
    s =  texture2D(tex, uv + d.xy);
    s += texture2D(tex, uv + d.zy);
    s += texture2D(tex, uv + d.xw);
    s += texture2D(tex, uv + d.zw);

    return s * (1.0 / 4.0);
}

vec4 DownsampleBox13Tap(sampler2D tex, vec2 uv, vec2 texelSize)
{
    vec4 A = texture2D(tex, uv + texelSize * vec2(-1.0, -1.0));
    vec4 B = texture2D(tex, uv + texelSize * vec2( 0.0, -1.0));
    vec4 C = texture2D(tex, uv + texelSize * vec2( 1.0, -1.0));
    vec4 D = texture2D(tex, uv + texelSize * vec2(-0.5, -0.5));
    vec4 E = texture2D(tex, uv + texelSize * vec2( 0.5, -0.5));
    vec4 F = texture2D(tex, uv + texelSize * vec2(-1.0,  0.0));
    vec4 G = texture2D(tex, uv                               );
    vec4 H = texture2D(tex, uv + texelSize * vec2( 1.0,  0.0));
    vec4 I = texture2D(tex, uv + texelSize * vec2(-0.5,  0.5));
    vec4 J = texture2D(tex, uv + texelSize * vec2( 0.5,  0.5));
    vec4 K = texture2D(tex, uv + texelSize * vec2(-1.0,  1.0));
    vec4 L = texture2D(tex, uv + texelSize * vec2( 0.0,  1.0));
    vec4 M = texture2D(tex, uv + texelSize * vec2( 1.0,  1.0));

    vec2 div = (1.0 / 4.0) * vec2(0.5, 0.125);

    vec4 o = (D + E + I + J) * div.x;
    o += (A + B + G + F) * div.y;
    o += (B + C + H + G) * div.y;
    o += (F + G + L + K) * div.y;
    o += (G + H + M + L) * div.y;

    return o;
}

// Standard box filtering
vec4 DownsampleBox4Tap(sampler2D tex, vec2 uv, vec2 texel_size)
{
    vec4 d = texel_size.xyxy * vec4(-1.0, -1.0, 1.0, 1.0);

    vec4 s;
    s =  (texture2D(tex, uv + d.xy));
    s += (texture2D(tex, uv + d.zy));
    s += (texture2D(tex, uv + d.xw));
    s += (texture2D(tex, uv + d.zw));

    return s * (1.0 / 4.0);
}

uniform sampler2D large_texture;
uniform vec2 textureSize;
uniform float weight[5];
uniform bool horizontal;

varying vec2 tex_coords;

void main()
{
    vec2 texel_size = 1.0 / textureSize; // gets size of single texel
    vec4 downsampleColor = DownsampleBox13Tap(large_texture, tex_coords, texel_size);

    if(horizontal){
        for(int i = 0; i < 1; ++i)
        {
            downsampleColor += texture2D(large_texture, tex_coords + vec2(0.0, texel_size.y * float(i))) * weight[i];
            downsampleColor += texture2D(large_texture, tex_coords - vec2(0.0, texel_size.y * float(i))) * weight[i];
        }
    } else {
        for(int i = 0; i < 1; ++i)
        {
            downsampleColor += DownsampleBox13Tap(large_texture, tex_coords + vec2(texel_size.x * float(i), 0.0), texel_size) * weight[i];
            downsampleColor += DownsampleBox13Tap(large_texture, tex_coords - vec2(texel_size.x * float(i), 0.0), texel_size) * weight[i];
        }
    }
    gl_FragColor = downsampleColor;
}