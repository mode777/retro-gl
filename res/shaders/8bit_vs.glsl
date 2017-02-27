attribute vec4 position;
attribute vec2 texcoord;

uniform mat4 proj;
uniform float time;

varying vec2 v_uv;

void main() {
    v_uv = texcoord + time;
    vec4 res = proj * vec4(position.xyz, 1.0);
    //res.x = res.x + time;
    gl_Position = res;
}