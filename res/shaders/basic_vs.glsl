precision mediump float;


attribute vec4 position;
attribute vec2 texcoord;
varying vec2 v_uv;

uniform float offset;

void main() {
    v_uv = texcoord;
    v_uv.x += offset;
    //v_uv.y += offset;
    gl_Position = position;
}