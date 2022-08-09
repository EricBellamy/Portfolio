precision mediump float;

uniform sampler2D small_texture;
uniform sampler2D large_texture;

uniform vec2 textureSize;
varying vec2 tex_coords;

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

uniform bool upsample;

void main()
{
    vec2 texel_size = 1.0 / textureSize; // gets size of single texel
    vec4 textureColor = texture2D(large_texture, tex_coords);
    vec4 upsampleColor = UpsampleTent(small_texture, tex_coords, texel_size);

    // Additive Blending
    gl_FragColor = textureColor + upsampleColor;
}