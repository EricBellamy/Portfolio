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

varying vec3 FragPos;
varying vec4 FragColor;
varying float EmissionIntensity;
varying vec3 Normal;
varying vec3 lightDir;

varying vec3 diffuse;

vec3 lightDiffuse(vec3 Normal, vec3 lightDir)
{
	vec3 lightColor = vec3(1.0, 0.682, 0.0);
	float diff = max(dot(Normal, lightDir), 0.0);
	return diff * lightColor;
}

void main()
{
	gl_Position = mProj * mView * mWorld * mInstance * vec4(vert_position, 1.0);

	FragPos = vec3(mWorld * mInstance * vec4(vert_position, 1.0));
	EmissionIntensity = vert_emission;

	if(vert_emission != 0.0){
		FragColor = vert_rgba;
	} else {
		vec3 lightColor = vec3(1.0, 0.682, 0.0);
		vec3 Normal = normalize(vert_normal);
		vec3 lightDir = normalize(light_position - FragPos);

		diffuse = lightDiffuse(Normal, lightDir);

		FragColor = vec4(vert_rgba.rgb * (0.8 + (0.2 * (1.0 - vert_occlusion))), vert_rgba.a);
	}
}