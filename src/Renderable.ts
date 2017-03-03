import { Mesh } from './interfaces';
import { PAL_OFFSET } from './constants';

export class Renderable<T extends Mesh> {
    
    private _pOffsetX: number; 
    private _pOffsetY: number; 

    constructor(public mesh: T, public texture: WebGLTexture, public palette: WebGLTexture, private _paletteId: number){
        this.paletteId = _paletteId;
    }

    get paletteId(){
        return this._paletteId;
    }

    set paletteId(value: number){
        this._paletteId = value;
        this._pOffsetX = (value % 16) * PAL_OFFSET;
        this._pOffsetY = Math.floor(value / 16) * PAL_OFFSET;
    }

    get palOffsetX(){
        return this._pOffsetX;
    }

    get palOffsetY(){
        return this._pOffsetY;
    }
}