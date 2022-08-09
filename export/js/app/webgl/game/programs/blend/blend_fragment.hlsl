precision mediump float;

uniform sampler2D scene_texture;
uniform sampler2D hdr_texture;
uniform sampler2D water_texture;

varying vec2 tex_coords;

vec3 aces(vec3 x) {
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

vec3 unreal(vec3 x) {
  return x / (x + 0.155) * 1.019;
}

void main()
{

	float exposure = 1.0;
	const float gamma = 0.7;
    vec4 waterColor = texture2D(water_texture, tex_coords);
    vec3 sceneColor;
    if(waterColor.a == 0.0){
      sceneColor = texture2D(scene_texture, tex_coords).rgb;
    } else {
      sceneColor = waterColor.rgb;
    }      
    vec3 bloomColor = texture2D(hdr_texture, tex_coords).rgb;
    sceneColor += bloomColor; // additive blending


    vec3 result;

    // ACES tone mapping
    result = aces(sceneColor);
    // result = sceneColor;

    // also gamma correct while we're at it       
    result = pow(result, vec3(1.0 / gamma));
    gl_FragColor = vec4(result, 1.0);
}