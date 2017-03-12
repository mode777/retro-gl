attribute vec4 position;
attribute float z_index;
attribute float pal_shift;
attribute vec2 texcoord;

uniform mat4 matrix;

uniform mat4 projection;
uniform mat4 view;

varying vec2 v_uv;
varying float v_pal;

const float HALF_PX = 0.001953125; 
const float PX = 0.00390625;

void main() {
    v_uv = vec2(PX * texcoord.x + HALF_PX, PX * texcoord.y + HALF_PX);//(texcoord - tweak2);
    v_pal = pal_shift;
    //gl_Position = matrix * vec4(position.xy, z_index, 1.0);
    vec4 v1 = (matrix * vec4(position.xy, z_index, 1.0));
    //gl_Position = projection * view * v1;
    gl_Position = v1;
}