precision mediump float;

uniform sampler2D texture;
uniform sampler2D palette;
uniform float palette_id;

const float pixel = 0.0625;

varying vec2 v_uv;

float modI(float a,float b) {
    float m=a-floor((a+0.5)/b)*b;
    return floor(m+0.5);
}

void main() {
    
    float lookup = texture2D(texture, v_uv).r;
    float a = lookup / pixel;
    vec2 palUv = vec2(fract(a), pixel * floor(a));

    // only needed if you store more palettes in one texture.
    vec2 offset = vec2(modI(palette_id, 16.0), floor(palette_id / 16.0)) * pixel;
    palUv = (palUv * pixel) + offset;

    gl_FragColor = texture2D(palette, palUv);
    //gl_FragColor = vec4(lookup*4.0, lookup*4.0, lookup*4.0, 1.0);
}
