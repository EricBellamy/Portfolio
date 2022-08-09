precision mediump float;

varying vec4 FragColor;
varying float EmissionIntensity;

varying vec3 diffuse;
varying vec3 specular;

void main()
{
	if(EmissionIntensity != 0.0){
		gl_FragColor = vec4(FragColor.rgb * EmissionIntensity, FragColor.a);
	} else {
		vec3 ambient = vec3(0.4);
		vec3 result = (ambient + diffuse) * FragColor.rgb;

		float brightness = dot(result.rgb, vec3(0.2126, 0.7152, 0.0722));
		if(brightness > 1.0 || 0.0 < EmissionIntensity)
			gl_FragColor = vec4(result.rgb, FragColor.a);
	}
}