import { Buffer, MatrixTransform, RenderableOptions, RenderableBufferOptions } from './interfaces';
import { PAL_OFFSET } from './constants';
import { Transform2d } from './Transform';
import { PixelTexture } from './PixelTexture';

export class OldRenderable<T extends Buffer> implements RenderableBufferOptions<T> {
    
    constructor(private _options: RenderableBufferOptions<T>){
        _options.transform = _options.transform || new Transform2d();
        this.paletteId = _options.paletteId;
    }

    get paletteId(){
        return this._options.paletteId;
    }

    set paletteId(value: number){
        this._options.paletteId = value;
    }

    get texture(){
        return this._options.texture;
    }

    set texture(value: WebGLTexture){
        this._options.texture = value;
    }

    get buffer(){
        return this._options.buffer;
    }

    get palette(){
        return this._options.palette;
    }

    get shader(){
        return this._options.shader;
    }

    get transform(){
        return this._options.transform;
    }

    get zSort(){
        return this._options.zSort;
    }

    get blendMode(){
        return this._options.blendMode;
    }

    get mode7() {
        return this._options.mode7;
    }
}