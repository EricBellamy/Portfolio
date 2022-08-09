precision mediump float;

// 9 buffer inputs
attribute vec3 vert_position;
attribute vec3 vert_normal;
attribute vec4 vert_rgba;
attribute float vert_emission;
attribute float vert_occlusion;

// The instance matrix
attribute mat4 mInstance;

uniform vec3 light_position;
uniform mat4 mView;
uniform mat4 mProj;
uniform mat4 mWorld;

uniform bool is_sun;

varying vec3 FragPos;
varying vec4 FragColor;
varying float EmissionIntensity;
varying vec3 Normal;
varying vec3 lightDir;

void main()
{
	gl_Position = mProj * mView * mWorld * mInstance * vec4(vert_position, 1.0);

	FragPos = vec3(mWorld * mInstance * vec4(vert_position, 1.0));

	if(is_sun){
		EmissionIntensity = vert_emission;
		FragColor = vert_rgba;
	} else {
		EmissionIntensity = 0.0;
		Normal = normalize(vert_normal);
		lightDir = normalize(light_position - FragPos);

		FragColor = vec4(vert_rgba.rgb * (0.8 + (0.2 * (1.0 - vert_occlusion))), vert_rgba.a);
	}
}