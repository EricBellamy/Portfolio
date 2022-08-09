precision mediump float;

varying vec4 FragColor;
varying float EmissionIntensity;
varying vec3 Normal;
varying vec3 lightDir;
varying vec3 FragPos;

uniform sampler2D reflection_texture;
uniform vec2 textureSize;

uniform float drawFrame;

void main()
{
	vec3 lightColor = vec3(1.0, 0.682, 0.0);
	vec3 ambient = vec3(0.4);

	float diff = max(dot(Normal, lightDir), 0.0);
	vec3 diffuse = diff * lightColor;

	if(FragColor.a != 0.0){
		vec3 result = (ambient + diffuse) * FragColor.rgb;

		vec2 uv = gl_FragCoord.xy / textureSize;
		vec4 reflectColor = texture2D(reflection_texture, vec2(1.0 - uv.x, uv.y));

		gl_FragColor = reflectColor + vec4(result, 1.0);
	} else {
		gl_FragColor = vec4(0.0);
	}
}