precision mediump float;

uniform vec3 cameraPos;

varying vec4 FragColor;
varying float EmissionIntensity;

varying vec3 diffuse;
varying vec3 specular;

void main()
{
	if(EmissionIntensity != 0.0){
		gl_FragColor = vec4(FragColor.rgb * EmissionIntensity, FragColor.a);
	} else {
		vec3 ambient = vec3(0.5);

		vec3 result = (ambient + diffuse + specular) * FragColor.rgb;
		gl_FragColor = vec4(result, FragColor.a);
	}
}