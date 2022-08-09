precision mediump float;

varying vec2 tex_coords;
uniform sampler2D texture;

void main()
{
	gl_FragColor = texture2D(texture, tex_coords);
}