import { TEXTURE_SIZE, HUGE } from './constants';

export enum ColorComponent {
    R = 0,
    G = 1,
    B = 2,
    A = 3
}

export abstract class PixelTexture {
    
    private _texture: WebGLTexture;
    protected _texdata: Uint8Array;
    protected  _dirtyStart = HUGE;
    protected _dirtyEnd = 0;
    
    constructor(protected _gl: WebGLRenderingContext){
        this._texdata = new Uint8Array(TEXTURE_SIZE * TEXTURE_SIZE * this._components);
    }
    
    public get texture(): WebGLTexture {
        if(!this._texture)
            throw "No texture available. Did you forget to call create(...)?";
        
        return this._texture;
    }

    protected abstract get _options(): twgl.TextureOptions;
    protected abstract get _components(): number;

    public get rawData() {
        return this._texdata;
    }

    public get colorDepth(): 8 | 24 | 32 {
        switch (this._options.format) {
            case this._gl.RGBA:
                return 32;
            case this._gl.LUMINANCE:
            case this._gl.ALPHA:
                return 8;
            case this._gl.RGB:
                return 24;
        }
    }

    public setDataFunc(func: (x:number, y: number, comp: ColorComponent) => number){
        let tex = this._texdata;
        let f = Math.floor;
        let totalComp = this._components;

        for (var i = 0; i < tex.length; i++) {
            let comp = i % totalComp;
            let pixel = Math.floor((i - comp) / totalComp);
            tex[i] = func(pixel % TEXTURE_SIZE, Math.floor(pixel / TEXTURE_SIZE), i % totalComp);          
        }

        this.setAllDirty();
    }    

    public create(){        
        this._texture = twgl.createTexture(this._gl, this._options);
        this._dirtyEnd = 0;
        this._dirtyStart = HUGE;
        return this;
    }
    
    public update(){
        let updateLength = this._dirtyEnd - this._dirtyStart;
        if(updateLength > 0){
            let o = this._options;
            let updateData = new Uint8Array(this._texdata.buffer, this._dirtyStart, updateLength);
            let rowSize = this._components * TEXTURE_SIZE;
            let x = 0
            let y = Math.floor(this._dirtyStart / rowSize);
            let w = 256;
            let h = Math.floor(updateLength / rowSize);
            console.log(x,y,w,h);

            this._gl.bindTexture(o.target, this.texture);
            this._gl.texSubImage2D(o.target, 0, x, y, w, h, o.format, o.type, updateData);
            
            this._dirtyEnd = 0;
            this._dirtyStart = HUGE;
        }
    }    

    public setAllDirty(){
        this._dirtyStart = 0;
        this._dirtyEnd = this._texdata.length;
    }

    public getPixel(x: number, y: number){
        let c = this._components;
        let res = new Array(c);
        let offset = (y * TEXTURE_SIZE + x) * c;
        for (var i = 0; i < c; i++) {
            res[i] = this._texdata[offset+i];            
        }
        return res;
    }

    public setPixel(x: number, y: number, color: ArrayLike<number>){
        let c = this._components;
        if(color.length != c)
            throw "Color needs to be an array with length "+c;
        let offset = (y * TEXTURE_SIZE + x) * c;
        for (var i = 0; i < c; i++) {
            this._texdata[offset+i] = color[i];            
        }
        this.setRowDirty(y);
    }

    public setRowDirty(y: number){
        let start = y * TEXTURE_SIZE * this._components;
        this._dirtyStart = Math.min(this._dirtyStart, start);
        this._dirtyEnd = Math.max(this._dirtyEnd, start + TEXTURE_SIZE * this._components);
    }


}