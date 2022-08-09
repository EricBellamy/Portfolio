precision mediump float;

uniform sampler2D scene_texture;
uniform sampler2D sun_texture;
varying vec2 tex_coords;



void main()
{
	vec3 sceneColor = texture2D(scene_texture, tex_coords).rgb;      
    vec3 sunColor = texture2D(sun_texture, tex_coords).rgb;
    sceneColor += sunColor; // additive blending

	gl_FragColor = vec4(sceneColor, 1.0);
}