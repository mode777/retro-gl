precision mediump float;

uniform sampler2D texture;

varying vec2 v_uv;

uniform float offset;

void ripple(inout vec2 texcoord){
    texcoord.x += sin(texcoord.y * 8.0 * 4.0 * 3.14159 + offset) / 100.0;
    texcoord.y += sin(texcoord.x * 8.0 * 2.0 * 3.14159 + offset) / 100.0;
}

void shift(inout vec2 texcoord){
    if(mod(floor(texcoord.y), 2.0) == 0.0)
        discard; 
}

void main() {
    vec2 texcoord = v_uv * 512.0;
    ripple(texcoord);
    gl_FragColor = texture2D(texture, texcoord / 512.0);
}

