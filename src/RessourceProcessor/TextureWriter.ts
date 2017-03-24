import { PixelTexture } from '../core/PixelTexture';
import { JsonRessource, JsonTexture } from './interfaces';
import { BitDepth } from '../PngReader/constants';
import { compressAndEncode } from './utils';

export class TextureWriter {
    constructor(private _texture: PixelTexture) {

    }

    public getJson(): JsonTexture {
        return {
            colorDepth: this._texture.colorDepth,
            imageData: compressAndEncode(this._texture.rawData)
        }
    }
}