attribute vec4 position;
attribute vec2 texcoord;

varying vec2 v_uv;

void main() {
    v_uv = texcoord;
    gl_Position = position;
}