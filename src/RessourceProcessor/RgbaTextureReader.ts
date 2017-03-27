import { JsonTexture } from './interfaces';
import { TextureReader } from './TextureReader';
import { RgbaTexture } from '../core/RgbaTexture';

export class RgbaTextureReader extends TextureReader<RgbaTexture>{
    constructor(private _gl: WebGLRenderingContext, texture: JsonTexture){
        super(texture);
    }
    
    getRessource(){
        let tex = new RgbaTexture(this._gl);
        tex.setRawData(this._getRawData());

        return tex;
    }
}