import { ChunkType, BitDepth, ColorType, LENGTH_LENGTH, TYPE_LENGTH, CRC_LENGTH } from './constants';

export abstract class PngChunk {    
    constructor(private _length: number, private _type: ChunkType, protected _data: Uint8Array, private _crc: number){
        if(_length != _data.length)
            throw "Invalid length";        
    }

    get dataLength() {
        return this._length;
    }

    get totalLength(){
        return this._length + LENGTH_LENGTH + TYPE_LENGTH + CRC_LENGTH;
    }

    get type(){
        return this._type;
    }

    get crc(){
        return this._crc;
    }

    get data(){
        return this._data;
    }
}

export class HeaderChunk extends PngChunk {
    
    private _width: number;
    private _height: number;
    private _bitDepth: BitDepth;
    private _colorType: ColorType;
    private _compressionMethod: number;
    private _filterMethod: number;
    private _interlace: boolean;
    
    constructor(length: number, type: ChunkType, data: Uint8Array, crc: number){
        super(length, type, data, crc);
        if(type != ChunkType.Header)
            throw "Not a header chunk";

        this._read();
    }

    private _read(){
        let view = new DataView(this._data.buffer, this._data.byteOffset, this._data.byteLength);
        this._width = view.getUint32(0, false);
        this._height = view.getUint32(4, false);
        this._bitDepth = <BitDepth>view.getUint8(8);
        this._colorType = <ColorType>view.getUint8(9);
        this._compressionMethod = view.getUint8(10);
        this._filterMethod = view.getUint8(11);
        this._interlace = view.getUint8(12) == 1 ? true : false;
    }

    get width(){
        return this._width;
    }

    get height(){
        return this._height;
    }

    get bitDepth(){
        return this._bitDepth;
    }

    get colorType(){
        return this._colorType;
    }

    get interlaced(){
        return this._interlace;
    }
}

export class PaletteChunk extends PngChunk {
    constructor(length: number, type: ChunkType, data: Uint8Array, crc: number){
        super(length, type, data, crc);
        if(type != ChunkType.Palette)
            throw "Not a palette chunk";

        if(data.length%3 != 0)
            throw "Invalid palette length";
    }

    get colors(){
        return this._data.length / 3;
    }

    getColor(id: number){
        return new Uint8Array(this._data.buffer, this._data.byteOffset + id * 3, 3);
    }
}

export class DataChunk extends PngChunk {
    constructor(length: number, type: ChunkType, data: Uint8Array, crc: number){
        super(length, type, data, crc);
        if(type != ChunkType.Data)
            throw "Not a data chunk";
    }

    decompress(){
        return pako.inflate(this._data);
    }
}

export class EndChunk extends PngChunk {
    constructor(length: number, type: ChunkType, data: Uint8Array, crc: number){
        super(length, type, data, crc);
        if(type != ChunkType.End)
            throw "Not a end chunk";
    }
}