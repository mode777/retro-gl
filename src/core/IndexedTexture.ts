import { TEXTURE_SIZE, COMP_RGBA, HUGE, COMP_INDEXED } from './constants';
import { PixelTexture, ColorComponent } from './PixelTexture';


export class IndexedTexture extends PixelTexture {
        
    constructor(gl: WebGLRenderingContext){
        super(gl);
    }

    protected get _components() {
        return COMP_INDEXED;
    }

    protected get _options() {
        return {
            target: this._gl.TEXTURE_2D,
            width: TEXTURE_SIZE,
            height: TEXTURE_SIZE,
            min: this._gl.NEAREST,
            mag: this._gl.NEAREST,
            src: this._texdata,
            format: this._gl.LUMINANCE,
            type: this._gl.UNSIGNED_BYTE
        };
    }

    // public setPngData(pngData: Uint8Array){
    //     this.setDataFunc((x,y,comp) => {
    //         let pngOffset = y * (TEXTURE_SIZE+1) + x +1;
    //         return pngData[pngOffset];
    //     });
    // }
    
}