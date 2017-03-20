precision mediump float;

uniform float offset;

varying vec2 v_uv;

void main() {
    gl_FragColor = vec4(mod(v_uv.x*20.0,1.0),mod((v_uv.y*20.0),1.0),1,1);
}
