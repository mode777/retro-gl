attribute vec3 position;
attribute vec4 color;
attribute vec2 texcoord;

uniform mat4 matrix;

varying vec2 v_uv;
varying vec2 v_color;

const float HALF_PX = 0.001953125; 
const float PX = 0.00390625;

void main() {
    v_uv = texccord;
    vec4 res = matrix * vec4(position.xy,1.0, 1.0);
    //res.z =  -(z_index / 128.0) + 1.0;
    //res.w = res.w * res.z;
    gl_Position = res;
}