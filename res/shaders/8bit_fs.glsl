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
    float lookup = texture2D(texture, v_uv).r;
    
    // create uv from palette index and palette offset
    vec2 palUv = vec2(lookup+v_pal,pal_offset);
    
    //lookup color and discard if alpha is present.
    vec4 res = texture2D(palette, palUv);
    if(res.a < 1.0)
         discard;
    else
        gl_FragColor = res;
}
