import * as twgl from "twgl.js";
import { Texture, ColorComponent } from "./Texture";
import { HUGE } from "./constants";

export class PixelTexture extends Texture {

    private _texdata: Uint8Array;

    constructor(gl: WebGLRenderingContext, width: number, height: number, format = 0x1908){
        super(gl)

        this.addOptions({
            width: width,
            height: height,
            format: format,
            type: gl.UNSIGNED_BYTE,            
        });
        
        this._texdata = new Uint8Array(width * height * this.components);        
        
        this.addOptions({ src: this._texdata });
    }

    public getRawData() {
        return this._texdata;
    }

    public setRawData(value: Uint8Array){
        this._texdata = value;
        this.setAllDirty();
    }

    public setDataFunc(func: (x:number, y: number, comp: ColorComponent) => number){
        let tex = this._texdata;
        let f = Math.floor;
        let totalComp = this.components;

        for (var i = 0; i < tex.length; i++) {
            let comp = i % totalComp;
            let pixel = Math.floor((i - comp) / totalComp);
            tex[i] = func(pixel % this.width, Math.floor(pixel / this.height), i % totalComp);          
        }

        this.setAllDirty();
    } 

    public update(){
        let updateLength = this._dirtyEnd - this._dirtyStart;
        if(updateLength > 0){
            let updateData = new Uint8Array(this._texdata.buffer, this._dirtyStart, updateLength);
            let rowSize = this.components * this.width;

            let x = 0
            let y = Math.floor(this._dirtyStart / rowSize);
            let w = this.width;
            let h = Math.floor(updateLength / rowSize);

            this._gl.bindTexture(this._options.target, this.texture);
            this._gl.texSubImage2D(this._options.target, 0, x, y, w, h, this._options.format, this._options.type, updateData);
            
            this._dirtyEnd = 0;
            this._dirtyStart = HUGE;
        }
    }    

    public setAllDirty(){
        this._dirtyStart = 0;
        this._dirtyEnd = this._texdata.length;
    }

    public getPixel(x: number, y: number){
        let c = this.components;
        let res = new Array(c);
        let offset = (y * this.width + x) * c;
        for (var i = 0; i < c; i++) {
            res[i] = this._texdata[offset+i];            
        }
        return res;
    }

    public setPixel(x: number, y: number, color: ArrayLike<number>){
        let c = this.components;
        if(color.length != c)
            throw "Color needs to be an array with length "+c;
        let offset = (y * this.width + x) * c;
        for (var i = 0; i < c; i++) {
            this._texdata[offset+i] = color[i];            
        }
        this.setRowDirty(y);
    }

    public setRowDirty(y: number){
        let start = y * this.width * this.components;
        this._dirtyStart = Math.min(this._dirtyStart, start);
        this._dirtyEnd = Math.max(this._dirtyEnd, start + this.width * this.components);
    }

}