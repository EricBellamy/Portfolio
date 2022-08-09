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

uniform bool is_water;

varying vec3 FragPos;
varying vec4 FragColor;
varying vec3 Normal;
varying vec3 lightDir;

void main()
{
	gl_Position = mProj * mView * mWorld * mInstance * vec4(vert_position, 1.0);

	FragPos = vec3(mWorld * mInstance * vec4(vert_position, 1.0));

	if(is_water){
		Normal = normalize(vert_normal);
		lightDir = normalize(light_position - FragPos);
		FragColor = vert_rgba;
	} else {
		FragColor = vec4(0.0);
	}
}