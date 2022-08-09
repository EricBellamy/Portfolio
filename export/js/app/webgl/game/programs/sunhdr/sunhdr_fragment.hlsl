precision mediump float;

varying vec4 FragColor;
varying float EmissionIntensity;
varying vec3 Normal;
varying vec3 lightDir;

void main()
{
	vec3 lightColor = vec3(1.0, 0.682, 0.0);
	vec3 ambient = vec3(0.2);

	float diff = max(dot(Normal, lightDir), 0.0);
	vec3 diffuse = diff * lightColor;

	if(EmissionIntensity != 0.0){
		gl_FragColor = vec4(FragColor.rgb * EmissionIntensity, FragColor.a);
	} else {
		vec3 result = (ambient + diffuse) * FragColor.rgb;

		float brightness = dot(result.rgb, vec3(0.2126, 0.7152, 0.0722));
		if(brightness > 1.0 || 0.0 < EmissionIntensity)
			gl_FragColor = vec4(result.rgb, FragColor.a);
	}
}