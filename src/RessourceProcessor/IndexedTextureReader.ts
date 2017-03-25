import { IndexedTexture } from '../core/IndexedTexture';
import { JsonTexture } from './interfaces';
import { TextureReader } from './TextureReader';

export class IndexedTextureReader extends TextureReader<IndexedTexture>{
    constructor(private _gl: WebGLRenderingContext, texture: JsonTexture){
        super(texture);
    }
    
    getRessource(){
        let tex = new IndexedTexture(this._gl);
        tex.setRawData(this._getRawData());

        return tex;
    }
}