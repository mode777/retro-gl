precision mediump float;

uniform sampler2D texture;
uniform float offset;

varying vec2 v_uv;

void main() {
    vec2 texcoord = v_uv;
    texcoord.x += sin(texcoord.y * 4.0 * 2.0 * 3.14159 + offset) / 100.0;
    gl_FragColor = texture2D(texture, texcoord);
}
