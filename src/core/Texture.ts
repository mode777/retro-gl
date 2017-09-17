import { HUGE } from './constants';
import * as twgl from "twgl.js";

export enum ColorComponent {
    R = 0,
    G = 1,
    B = 2,
    A = 3
}

export abstract class Texture {

    private _texture: WebGLTexture;
    protected _dirtyStart = HUGE;
    protected _dirtyEnd = 0;
    private _components: number;
    
    protected _options: twgl.TextureOptions = {
        target: this._gl.TEXTURE_2D,
        min: this._gl.LINEAR_MIPMAP_LINEAR,
        mag: this._gl.LINEAR_MIPMAP_LINEAR,
        format: this._gl.RGBA,
        type: this._gl.UNSIGNED_BYTE,            
    }

    constructor(protected _gl: WebGLRenderingContext){
        
    }

    protected addOptions(options: twgl.TextureOptions){
        Object.keys(options).forEach(key => 
            this._options[key] = options[key]);
    }

    
    public get texture(): WebGLTexture {
        if(!this._texture)
        throw "No texture available. Did you forget to call create(...)?";
        
        return this._texture;
    }
    
    public get components() {
        return this._getComponents(this._options.format);
    }

    public get colorDepth(): 8 | 24 | 32 {
        return this._getColorDepth(this._options.format);
    }

    public get width() {
        if(this._options.src instanceof HTMLImageElement)
        return (<HTMLImageElement>this._options.src).width;
        else
        return this._options.width;
    }
    
    public get height() {
        if(this._options.src instanceof HTMLImageElement)
        return (<HTMLImageElement>this._options.src).height;
        else
        return this._options.height;
    }
    
    public create(){        
        this._texture = twgl.createTexture(this._gl, this._options);
        this._dirtyEnd = 0;
        this._dirtyStart = HUGE;
        return this;
    }  

    private _getComponents(constant: number){
        switch(this._options.format){
            case this._gl.RGB: 
                return 3;
            case this._gl.RGBA: 
                return 4;
            case this._gl.LUMINANCE: 
            case this._gl.ALPHA: 
                return 1;
            default: 
                throw Error("Unsupported texture format");
        }
    }

    private _getColorDepth(constant: number){
        switch (constant) {
            case this._gl.RGBA:
                return 32;
            case this._gl.LUMINANCE:
            case this._gl.ALPHA:
                return 8;
            case this._gl.RGB:
                return 24;
            default: 
                throw Error("Unsupported texture format");
        }
    }

}