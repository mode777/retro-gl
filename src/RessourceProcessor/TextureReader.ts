import { PixelTexture } from '../core/PixelTexture';
import { JsonRessource, JsonTexture, RessourceReader } from './interfaces';
import { BitDepth } from '../PngReader/constants';
import { compressAndEncode, decodeAndDecompress } from './utils';

export abstract class TextureReader<T extends PixelTexture> implements RessourceReader<T> {
    constructor(private _texture: JsonTexture) {

    }

    abstract getRessource() : T;

    protected _getRawData() {
        return decodeAndDecompress(this._texture.imageData);
    }
}