attribute vec4 position;
attribute vec2 texcoord;

uniform mat4 proj;

varying vec2 v_uv;

void main() {
    v_uv = texcoord;
    gl_Position = proj * vec4(position.xyz, 1.0);
}