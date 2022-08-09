precision mediump float;

uniform sampler2D hdr_texture;

varying vec2 tex_coords;

uniform bool horizontal;
uniform float weight[5];
uniform vec2 textureSize;

void main()
{
	vec2 texel_size = 1.0 / textureSize; // gets size of single texel
    vec3 result = texture2D(hdr_texture, tex_coords).rgb * weight[0]; // current fragment's contribution
    if(horizontal)
    {
        for(int i = 1; i < 5; ++i)
        {
            result += texture2D(hdr_texture, tex_coords + vec2(texel_size.x * float(i), 0.0)).rgb * weight[i];
            result += texture2D(hdr_texture, tex_coords - vec2(texel_size.x * float(i), 0.0)).rgb * weight[i];
        }
    }
    else
    {
        for(int i = 1; i < 5; ++i)
        {
            result += texture2D(hdr_texture, tex_coords + vec2(0.0, texel_size.y * float(i))).rgb * weight[i];
            result += texture2D(hdr_texture, tex_coords - vec2(0.0, texel_size.y * float(i))).rgb * weight[i];
        }
    }
    gl_FragColor = vec4(result, 1.0);
}