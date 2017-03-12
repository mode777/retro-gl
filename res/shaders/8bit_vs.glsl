attribute vec4 position;
attribute float z_index;
attribute float pal_shift;
attribute vec2 texcoord;

uniform mat4 matrix;

varying vec2 v_uv;
varying float v_pal;

const float HALF_PX = 0.001953125; 
const float PX = 0.00390625;

void main() {
    v_uv = texcoord * PX + HALF_PX;// vec2(PX * texcoord.x + HALF_PX, PX * texcoord.y + HALF_PX);//(texcoord - tweak2);
    v_pal = pal_shift;
    //vec4 v1 = (matrix * vec4(position.xy, z_index, 1.0));
    //gl_Position = (projection * view * matrix) * vec4(position.xy, z_index, 1.0);
    vec4 res = matrix * vec4(position.xy, z_index, 1.0);
    //res.z = -1.0 + z_index / 128.0;
    gl_Position = res;
}