precision mediump float;

varying vec2 v_uv;

void main() {
    gl_FragColor = vec4(v_uv.x,v_uv.y,1,1);
}
