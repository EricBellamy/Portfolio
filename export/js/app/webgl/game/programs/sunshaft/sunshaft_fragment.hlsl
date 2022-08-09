precision mediump float;

uniform sampler2D texture;
varying vec2 tex_coords;

uniform vec2 light_position;



void main()
{
	vec2 texCoord = tex_coords;
	float exposure = 0.5;
	float decay = 0.95;
	float density = 0.95;
	float weight = 0.4;
	const int samples = 60;
	// 0.8;
	vec2 deltaTextCoord = texCoord - light_position;
	// Divide by number of samples and scale by control factor
	deltaTextCoord *= 1.0 / float(samples) * density;

	// Store initial sample
	vec4 color = texture2D(texture, texCoord);
	// set up illumination decay factor
	float illuminationDecay = 1.0;

	// evaluate the summation for samples number of iterations up to 100
	for(int i=0; i < samples; i++){
		// step sample location along ray
		texCoord -= deltaTextCoord;
		// retrieve sample at new location
		vec4 sample = texture2D(texture, texCoord);
		// apply sample attenuation scale/decay factors
		sample *= illuminationDecay * weight;
		// accumulate combined color
		color += sample;
		// update exponential decay factor
		illuminationDecay *= decay;
	}
	// output final color with a further scale control factor
	gl_FragColor = color * exposure;





	// gl_FragColor = texture2D(texture, tex_coords);
	// gl_FragColor = radial(tex_coords);
}