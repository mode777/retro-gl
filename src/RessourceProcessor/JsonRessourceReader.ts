import { RessourceReader, JsonRessource } from './interfaces';
import { IndexedTextureReader } from './IndexedTextureReader';
import { PixelTexture } from '../core/PixelTexture';
import { RgbaTexture } from '../core/RgbaTexture';
//import { RgbaTextureReader } from "./RgbaTextureReader";

export class JsonRessourceReader {
    constructor(private _gl: WebGLRenderingContext, private _resource: JsonRessource){

    }

    getTexture(key: string): PixelTexture{
        let tex = this._resource.textures[key];
        if(!tex)
            throw "Ressource not found: "+ key;

        switch (tex.colorDepth) {
            case 8:
                return new IndexedTextureReader(this._gl, tex).getRessource();
            case 32:
                //return new RgbaTextureReader(this._gl, tex).getRessource();
            default:
                throw "Unsupported color depth "+ tex.colorDepth;
        }
    }
}