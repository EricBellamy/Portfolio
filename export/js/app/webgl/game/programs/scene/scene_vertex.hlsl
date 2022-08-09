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

float specularStrength = 1.0;
uniform vec3 cameraPos;

varying vec3 FragPos;
varying vec4 FragColor;
varying float EmissionIntensity;

varying vec3 diffuse;
varying vec3 specular;

// Convert sun position in the sky to calculate the directional light for the scene
// For now can use diffuse
// Maybe combine directional (normalized sun) + diffuse (sun position moves with world)
// vec3 lightDirectional(){
	// vec3 directionLight = vec3(0.4, -1.0, 0.4);
	// vec3 iDirectionLight = normalize(-directionLight);
	// vec3 lightDir = normalize(-directionLight);
// }

vec3 lightDiffuse(vec3 Normal, vec3 lightDir)
{
	vec3 lightColor = vec3(1.0, 0.682, 0.0) * 4.0;
	float diff = max(dot(Normal, lightDir), 0.0);
	return diff * lightColor;
}

vec3 lightSpecular(vec3 Normal, vec3 lightDir)
{
	vec3 viewDir = normalize(cameraPos - FragPos);
	vec3 reflectDir = reflect(-lightDir, Normal);  
	float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
	return specularStrength * spec * vec3(1.0, 0.682, 0.0); 
}

const float lightConstant = 1.0;
const float lightLinear = 0.045;
const float lightQuadratic = 0.0075;
float lightAttenuation(vec3 lightDistance){
	float distance    = length(lightDistance);
	return 1.0 / (lightConstant + lightLinear * distance + lightQuadratic * (distance * distance));   
}

void main()
{
	gl_Position = mProj * mView * mWorld * mInstance * vec4(vert_position, 1.0);

	FragPos = vec3(mWorld * mInstance * vec4(vert_position, 1.0));
	EmissionIntensity = vert_emission;
	if(vert_emission != 0.0){
		FragColor = vert_rgba;
	} else {
		vec3 Normal = normalize(vert_normal);
		vec3 lightDistance = light_position - FragPos;
		float attenuation = lightAttenuation(lightDistance);

		vec3 lightDir = normalize(lightDistance);
		diffuse = lightDiffuse(Normal, lightDir) * attenuation;
		specular = lightSpecular(Normal, lightDir) * attenuation;

		FragColor = vec4(vert_rgba.rgb * (0.4 + (0.6 * (1.0 - vert_occlusion))), vert_rgba.a);
	}
}