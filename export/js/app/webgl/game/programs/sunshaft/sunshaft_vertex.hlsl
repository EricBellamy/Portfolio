precision mediump float;

attribute vec2 vertex_position;
varying vec2 tex_coords;
const vec2 scale = vec2(0.5, 0.5);

void main()
{
	tex_coords  = vertex_position * scale + scale;
	gl_Position = vec4(vertex_position, 0.0, 1.0);
}