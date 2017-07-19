import { RgbaTexture } from './RgbaTexture';
import { TEXTURE_SIZE, COMP_RGBA, COMP_RGB } from './constants';
import { ColorComponent } from './PixelTexture';

export class PaletteTexture extends RgbaTexture {
    public setPalFunc(palId: number, func: (idx:number, comp: ColorComponent) => number){
        let tex = this._texdata;
        let f = Math.floor;
        let totComp = this._components;
        let start = palId * TEXTURE_SIZE * totComp;
        let end = start + TEXTURE_SIZE * totComp;

        for (var i = start; i < end; i++) {
            let comp = i % COMP_RGBA;
            let pixel = Math.floor((i - comp) / totComp);
            tex[i] = func(pixel % 256 , i % totComp);            
        }

        this.setPalDirty(palId);
    }   

    public setRawPalette(palId: number, data: Uint8Array){
        let offset = this._components * TEXTURE_SIZE * palId;
        for (var i = 0; i < data.length; i++) {
            this._texdata[offset+i] = data[i];            
        } 
    }
    
    public setPalDirty(palId: number){
        this.setRowDirty(palId);
    }

    // public setPngPalette(palId: number, pngPal: Uint8Array){
    //     this.setPalFunc(palId, (x, comp) => {
    //         // Make first color transparent
    //         if(x == 0 && comp == ColorComponent.A)
    //             return 0;

    //         switch (comp) {
    //             case ColorComponent.A:
    //                 return 255;
    //             default:
    //                 return pngPal[x * COMP_RGB + comp]; 
    //         }
    //     });
    // }

    public setIndex(palId: number, index: number, color: ArrayLike<number>){
        return this.setPixel(index, palId, color);        
    }

    public getIndex(palId: number, index: number){
        return this.getPixel(index, palId);        
    }

    public setPalColor(palId: number, index: number, color: ArrayLike<number>){
        this.setPixel(index, palId, color);
        this.setPalDirty(palId);
    }

    public shift(palId: number, start: number, end: number){
        let len = end - start;
        for (var i = 0; i < len; i++) {
            this.switchColors(palId, start+i, end);            
        }
    }

    public switchColors(palId: number, idx1: number, idx2: number){
        let temp = this.getIndex(palId, idx1);
        this.setIndex(palId, idx1, this.getIndex(palId, idx2));
        this.setIndex(palId, idx2, temp);
    }
}