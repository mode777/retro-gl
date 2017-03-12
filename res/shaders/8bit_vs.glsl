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
    vec4 res = matrix * vec4(position.xy, z_index, 1.0);
    //res.z =  -(z_index / 128.0) + 1.0;
    //res.w = res.w * res.z;
    gl_Position = res;
}