import { RgbaTexture } from './RgbaTexture';
import { TEXTURE_SIZE, COMP_RGBA, COMP_RGB } from './constants';
import { ColorComponent } from './PixelTexture';

const PAL_EMPTY = new Uint8Array(TEXTURE_SIZE * COMP_RGBA);

export class PaletteTexture extends RgbaTexture {

    private _range = 0;
    private _freeList: number[] = [];

    public setPalFunc(palId: number, func: (idx:number, comp: ColorComponent) => number){
        const tex = this._texdata;
        const f = Math.floor;
        const totComp = this._components;
        const start = palId * TEXTURE_SIZE * totComp;
        const end = start + TEXTURE_SIZE * totComp;

        for (var i = start; i < end; i++) {
            const comp = i % COMP_RGBA;
            const pixel = Math.floor((i - comp) / totComp);
            tex[i] = func(pixel % TEXTURE_SIZE , i % totComp);            
        }

        this._setPalDirty(palId);
    }   

    public setRawPalette(palId: number, data: Uint8Array){
        const offset = this._components * TEXTURE_SIZE * palId;
        for (var i = 0; i < data.length; i++) {
            this._texdata[offset+i] = data[i];            
        } 
        this._setPalDirty(palId);
    }
    
    private _setPalDirty(palId: number){
        this.setRowDirty(palId);
    }

    public setIndex(palId: number, index: number, color: ArrayLike<number>){
        return this.setPixel(index, palId, color);        
    }

    public getIndex(palId: number, index: number){
        return this.getPixel(index, palId);        
    }

    public setPalColor(palId: number, index: number, color: ArrayLike<number>){
        this.setPixel(index, palId, color);
        this._setPalDirty(palId);
    }

    public shift(palId: number, start: number, end: number){
        const len = end - start;
        for (let i = 0; i < len; i++) {
            this.switchColors(palId, start+i, end);            
        }
    }

    public switchColors(palId: number, idx1: number, idx2: number){
        const temp = this.getIndex(palId, idx1);
        this.setIndex(palId, idx1, this.getIndex(palId, idx2));
        this.setIndex(palId, idx2, temp);
    }

    public add(){
        if(this._freeList.length > 0)
            return this._freeList.pop(); 

        return this._range++;
    }

    public deletePalette(palId: number){
        const offset = this._components * TEXTURE_SIZE * palId;
        this._texdata.set(PAL_EMPTY, offset);
        this._setPalDirty(palId);
        this._freeList.push(palId);
    }

}