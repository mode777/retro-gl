precision mediump float;

uniform sampler2D texture;
uniform sampler2D palette;
uniform float pal_offset;

const float HALF_PX = 0.001953125; 
const float PX = 0.00390625;

varying vec2 v_uv;
varying float v_pal;

void main() {
    // get palette index.
    vec4 frag = texture2D(texture, v_uv);

    if(frag.a < 1.0)
         discard;
    else
        gl_FragColor = frag;
}
