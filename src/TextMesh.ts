import { QuadMesh } from './QuadMesh';
import { FontInfo } from './interfaces';
import { VERTICES_QUAD, TEXTURE_SIZE } from './constants';

export class TextMesh extends QuadMesh {
    
    private _fontLoookup: number[] = [];
    private _font: Uint8Array; 
    private _text: string;
    
    constructor(_gl: WebGLRenderingContext, _size: number, private _fontInfo: FontInfo){
        super(_gl, _size);
    }

    get text(){
        return this._text;
    }

    public create(text?: string){
        this._createFont();

        if(text)
            this.putText(text);

        super.create();

        return this;
    }

    public putText(text: string){
        if(text.length > this.size)
            text = text.substr(0,this.size);

        let ox = 0;
        let oy = 0;

        for(let i = 0; i < text.length; i++){
            let offset = this._fontLoookup[text.charCodeAt(i)];   
            let x = this._font[offset]; 
            let y = this._font[offset+1]; 
            let w = this._font[offset+2]; 
            let h = this._font[offset+3];
            this.setQuad(i, ox, oy, ox+w, oy+h, x,y,x+w,y+h);
            console.log(ox);
            if(ox>256){
                oy += h;
                ox = 0;
            } else {
                ox+=w; 
            }
        }

        this.range = text.length;
        this._text = text;
    }

    private _createFont(){
        let info = this._fontInfo;
        let chars = info.chars;  
        this._font = new Uint8Array(chars.length * VERTICES_QUAD);
        let wRow = TEXTURE_SIZE / this._fontInfo.x;

        for(let i = 0; i < chars.length; i++){
            let x = (i % wRow) * info.x;
            let y = Math.floor(i / wRow) * info.y;
            let w = info.widths ? info.widths[i] : info.x;
            let h = info.y;
            let offset = i * VERTICES_QUAD;
            
            this._fontLoookup[chars.charCodeAt(i)] = offset;
            this._font[offset] = x;
            this._font[offset+1] = y;
            this._font[offset+2] = w;
            this._font[offset+3] = h;
        }
    }
}