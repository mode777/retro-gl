import { TEXTURE_SIZE, COMP_RGBA, HUGE, COMP_RGB } from './constants';
import { PixelTexture, ColorComponent } from './PixelTexture';


export class PaletteTexture extends PixelTexture {
        
    constructor(gl: WebGLRenderingContext){
        super(gl);
    }

    protected get _components() {
        return COMP_RGBA;
    }

    protected get _options() {
        return {
            target: this._gl.TEXTURE_2D,
            width: TEXTURE_SIZE,
            height: TEXTURE_SIZE,
            min: this._gl.NEAREST,
            mag: this._gl.NEAREST,
            src: this._texdata,
            format: this._gl.RGBA,
            type: this._gl.UNSIGNED_BYTE
        };
    }
    
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
    
    public setPalDirty(palId: number){
        this.setRowDirty(palId);
    }

    public setPngPalette(palId: number, pngPal: Uint8Array){
        this.setPalFunc(palId, (x, comp) => {
            // Make first color transparent
            if(x == 0 && comp == ColorComponent.A)
                return 0;

            switch (comp) {
                case ColorComponent.A:
                    return 255;
                default:
                    return pngPal[x * COMP_RGB + comp]; 
            }
        });
    }

    public setIndex(palId: number, index: number, color: ArrayLike<number>){
        return this.setPixel(index, palId, color);        
    }

    public getIndex(palId: number, index: number){
        return this.getPixel(index, palId);        
    }

    public shift(palId: number, start: number, end: number){
        let len = end - start;
        for (var i = 0; i < len; i++) {
            this.switch(palId, start+i, end);            
        }
    }

    public switch(palId: number, idx1: number, idx2: number){
        let temp = this.getIndex(palId, idx1);
        this.setIndex(palId, idx1, this.getIndex(palId, idx2));
        this.setIndex(palId, idx2, temp);
    }



}