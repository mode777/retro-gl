import { TEXTURE_SIZE, COMP_RGBA, HUGE, COMP_RGB } from './constants';
import { PixelTexture, ColorComponent } from './PixelTexture';

export class RgbaTexture extends PixelTexture {
        
    constructor(gl: WebGLRenderingContext){
        super(gl);
    }

    protected get _components() {
        return COMP_RGBA;
    }

    protected get _options() {
        return {
            target: this._gl.TEXTURE_2D,
            width: TEXTURE_SIZE,
            height: TEXTURE_SIZE,
            min: this._gl.NEAREST,
            mag: this._gl.NEAREST,
            src: this._texdata,
            format: this._gl.RGBA,
            type: this._gl.UNSIGNED_BYTE
        };
    } 
        
}