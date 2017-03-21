precision mediump float;

uniform sampler2D texture;

varying vec2 v_uv;

uniform float offset;

const float PI = 3.1415926;

void ripple(inout vec2 texcoord){
    //texcoord.x += sin(texcoord.y * 4.0 * 2.0 * 3.14159 + offset) / 100.0;
    texcoord.y += sin(texcoord.x * 4.0 * 2.0 * 3.14159 + offset) / 100.0;
}

void shift(inout vec2 texcoord){
    if(mod(floor(texcoord.y), 2.0) == 0.0)
        discard; 
}

void axelay(inout vec2 texcoord){
    texcoord.y *= (cos(texcoord.y)+1.0)*4.0;
}

void barrel(inout vec2 texcoord){
    //float y = 1.0 - abs(texcoord.y-0.5) * 2.0;
    float y = sin(texcoord.y*PI);
    texcoord.x = ((texcoord.x - 0.5) * y) + 0.5;
}

void wave(inout vec2 texcoord){
    float y = sin((texcoord.y-0.5) * 2.0);
    texcoord.x = ((texcoord.x - 0.5) * (1.0-y)) + 0.5;
}


void main() {
    vec2 texcoord = v_uv;
    //ripple(texcoord);
    //ripple(texcoord);
    barrel(texcoord);
    gl_FragColor = texture2D(texture, texcoord);
}

