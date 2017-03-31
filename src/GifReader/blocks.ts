const OCT_MASK          = 0b00000111;

export abstract class GifBlock {
    constructor(protected _view: DataView, protected _offset: number){
    }

    public abstract read(): number;
}

const COLOR_TABLE_FLAG  = 0b10000000;
const SORT_FLAG         = 0b00001000;
const LSD_LENGTH        = 7;

export class LogicalScreenDescriptorBlock extends GifBlock {

    private _cw: number;
    private _ch: number;
    private _flags: number;
    private _bg: number;
    private _ratio: number;

    get length(){
        return LSD_LENGTH;
    }

    public read(){
        this._cw = this._view.getUint16(this._offset,true);
        this._ch = this._view.getUint16(this._offset+2,true);
        this._flags = this._view.getUint8(this._offset+4);
        this._bg = this._view.getUint8(this._offset+5);
        this._ratio = this._view.getUint8(this._offset+6);
        return this.length;
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
        if(this.hasGlobalColorTable){
            return 1 << ((this._flags & OCT_MASK)+1);
        }
        else {
            return 0;
        }
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
        this._data = new Uint8Array(this._view.buffer, this._offset, this.length);
        return this.length
    }

    get data(){
        return this._data;
    }
}

const APP_EXT_SIZE = 12;

export class ApplicationExtensionBlock extends GifBlock {
    
    private _app: string;
    private _code: string;
    private _applicationData: DataSubBlock[];

    get application(){
        return this._app;
    }

    public read(): number {
        let offset = this._offset;
        
        let size = this._view.getUint8(offset);
        offset++;
        
        this._app = "";
        new Uint8Array(this._view.buffer, offset, 8)
            .forEach(x => this._app+=String.fromCharCode(x));
        offset+=8;

        this._code = "";
        new Uint8Array(this._view.buffer, offset, 3)
            .forEach(x => this._code+=String.fromCharCode(x));
        offset+=3;
        
        this._applicationData = [];
        while(this._view.getUint8(offset) != 0){
            let dsb = new DataSubBlock(this._view, offset);
            this._applicationData.push(dsb);
            offset += dsb.read();
        }        

        // block terminator
        offset++;
        return offset - this._offset;
    }

}

const USER_INPUT_FLAG  = 0b00000010;
const TRANS_COLOR_FLAG = 0b00000001;

export class GraphicControlExtensionBlock extends GifBlock {
    
    private _flags: number;
    private _delay: number;
    private _ti: number;

    get delay() {
        return this._delay;
    }

    get transparentIndex() {
        return this._ti;
    }

    public read(): number {
        let offset = this._offset;

        let size = this._view.getUint8(offset);
        offset++;

        this._flags = this._view.getUint8(offset);
        offset++;

        this._delay = this._view.getUint16(offset, true)
        offset+=2;

        this._ti = this._view.getUint8(offset);
        offset++;

        // block terminator
        offset++;
        return offset - this._offset;
    }

    get disposeMethod(){
        return (this._flags >> 2) & OCT_MASK;
    }

    get needsUserInput(){
        return (this._flags & USER_INPUT_FLAG) == USER_INPUT_FLAG; 
    }

    get hasTransparentColor(){
        return (this._flags & TRANS_COLOR_FLAG) == TRANS_COLOR_FLAG;
    }

}

export class DataSubBlock extends GifBlock {
    
    private _data: Uint8Array;

    get data(){
        return this._data;
    }

    public read(): number {
        let offset = this._offset;

        let size = this._view.getUint8(offset);
        offset++;

        this._data = new Uint8Array(this._view.buffer, offset, size);
        
        return size+1;
    }

}

const LOC_COL_TABLE_FLAG = 0b10000000;
const INTERLACE_FLAG     = 0b01000000;
const ID_SORT_FLAG       = 0b00100000;

export class ImageDescriptorBlock extends GifBlock {
    
    private _left: number;
    private _top: number;
    private _width: number;
    private _height: number;
    private _flags: number;

    get hasLocalColorTable(){
        return (this._flags & LOC_COL_TABLE_FLAG) == LOC_COL_TABLE_FLAG;
    }

    get isInterlaced(){
        return (this._flags & INTERLACE_FLAG) == INTERLACE_FLAG;
    }

    get isSorted(){
        return (this._flags & ID_SORT_FLAG) == ID_SORT_FLAG;
    }

    get totalColors(){
        if(this.hasLocalColorTable){
            return 1 << ((this._flags & OCT_MASK)+1);
        }
        else {
            return 0;
        }
    }

    public read(): number {
        let offset = this._offset;

        this._left = this._view.getUint16(offset, true);
        offset+=2;

        this._top = this._view.getUint16(offset, true);
        offset+=2;

        this._width = this._view.getUint16(offset, true);
        offset+=2;

        this._height = this._view.getUint16(offset, true);
        offset+=2;

        this._flags = this._view.getUint8(offset);
        offset++;

        return offset - this._offset;
    }
}

export class ImageDataBlock extends GifBlock {
    
    private _lmcs: number;
    private _imageData: DataSubBlock[];

    public get lzwMinCodeSize() {
        return this._lmcs;
    }

    public get blocks() {
        return this._imageData;
    }

    public read(): number {
        let offset = this._offset;

        this._lmcs = this._view.getUint8(offset);
        offset++;

        this._imageData = [];
        while(this._view.getUint8(offset) != 0){
            let dsb = new DataSubBlock(this._view, offset);
            this._imageData.push(dsb);
            offset += dsb.read();
        }

        // skip block terminator
        offset++;

        return offset - this._offset;
    }

}