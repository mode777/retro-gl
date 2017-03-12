import { QuadBuffer } from './QuadBuffer';
import { FontInfo } from './interfaces';
import { VERTICES_QUAD, TEXTURE_SIZE, MIN_Z, HUGE } from './constants';

export class TextBuffer extends QuadBuffer {
    
    private _fontLoookup: number[] = [];
    private _font: Uint8Array; 
    private _text = "";
    private _ptr = 0;
    
    constructor(_gl: WebGLRenderingContext, _size: number, private _fontInfo: FontInfo){
        super(_gl, _size);
    }

    get text(){
        return this._text;
    }

    create(text?: string, width = HUGE, x = 0, y = 0, z = MIN_Z){
        this._createFont();

        if(text)
            this.write(text, width, x, y, z);

        super.create();
        //this.range = text ? text.length : 0;

        return this;
    }

    seek(pos: number){
        this._ptr = pos;
    }

    // public setText(text: string, offset=0, width = HUGE, x = 0, y = 0, z = MIN_Z, pal = 0){
    //     this._putText(text, width, offset, x,y,z,pal)
    //     //this.range = offset + text.length;
    //     this._text = text;
    // }

    public clear(length: number){
        for (var i = this._ptr; i < this._ptr + length; i++){
            this.clearQuad(i);
        }
        this._ptr += length;
    }

    // public appendText(text: string, width = HUGE, x = 0, y = 0, z = MIN_Z, pal = 0){
    //     this._putText(text, width, this.range,x,y,z,pal);
    //     //this.range += text.length;
    //     this._text += text;
    // }

    public write(text: string, width = HUGE, x = 0, y = 0, z = MIN_Z, pal = 0){
        let ctr = 0;
        if(this._ptr + text.length > this.size)
            text = text.substr(0,this.size - this._ptr);

        let ox = x;
        let oy = y;

        for(let i = 0; i < text.length; i++){
            let offset = this._fontLoookup[text.charCodeAt(i)];   
            let x = this._font[offset]; 
            let y = this._font[offset+1]; 
            let w = this._font[offset+2]; 
            let h = this._font[offset+3];
            this.setAttributes(this._ptr+i, ox, oy, ox+w, oy+h, x,y,x+w,y+h,z,pal);
            if(ox>width){
                oy += h;
                ox = 0;
            } else {
                ox+=w; 
            }
        }       

        this._ptr += text.length; 
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
            //console.log(x,y);
            this._font[offset] = x;
            this._font[offset+1] = y;
            this._font[offset+2] = w;
            this._font[offset+3] = h;
        }
    }
}