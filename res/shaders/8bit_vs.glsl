attribute vec4 position;
attribute vec2 texcoord;

uniform mat4 proj;
uniform float time;

varying vec2 v_uv;

const float tweak = 0.996;

void main() {
    //v_uv = vec2(texcoord.x/255.0, texcoord.y/255.0);
    v_uv = texcoord * tweak;
    vec4 posNew = position-time;
    vec4 res = proj * (vec4(posNew.xy, 0.0, 1.0));
    //res.x = res.x + time;
    gl_Position = res;
}