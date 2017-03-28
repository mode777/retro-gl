export abstract class GifBlock {
    constructor(protected _view: DataView, protected _offset: number){
    }

    public abstract read(): number;
}

const COLOR_TABLE_FLAG  = 0b10000000;
const OCT_MASK          = 0b00000111;
const SORT_FLAG         = 0b00001000;

export class LogicalScreenDescriptorBlock extends GifBlock {

    private _cw: number;
    private _ch: number;
    private _flags: number;
    private _bg: number;
    private _ratio: number;

    get length(){
        return 7;
    }

    public read(){
        this._cw = this._view.getUint16(this._offset,true);
        this._ch = this._view.getUint16(this._offset+2,true);
        this._flags = this._view.getUint8(this._offset+4);
        this._bg = this._view.getUint8(this._offset+5);
        this._ratio = this._view.getUint8(this._offset+6);
        return length;
    }

    get canvasWidth(){
        return this._cw;
    }

    get canvasHeight(){
        return this._ch;
    }

    get hasGlobalColorTable(){
        return (this._flags & COLOR_TABLE_FLAG) > 0; 
    }

    get paletteSorted(){
        return (this._flags & SORT_FLAG) > 0; 
    }

    get colorDepth(){
        return ((this._flags >> 4) & OCT_MASK)+1; 
    }

    get totalColors(){
        return 1 << ((this._flags & OCT_MASK)+1);
    }

    get backgroundColor(){
        return this._bg;
    }

    get pixelAspect(){
        return this._ratio == 0 ? 0 : (this._ratio + 15) / 64;
    }
}

const PAL_COLOR_COMP = 3;

export class ColorTableBock extends GifBlock {
    
    private _data: Uint8Array;
    
    constructor(view: DataView, offset: number, protected _colors: number){
        super(view, offset);
    }

    get length(){
        return this._colors * PAL_COLOR_COMP;
    }

    read(){
        console.log(this._colors);
        this._data = new Uint8Array(this._view.buffer, this._offset, this.length);
        return this.length
    }

    data(){
        return this._data;
    }
}

// export class ExtensionBlock extends GifBlock {

// }