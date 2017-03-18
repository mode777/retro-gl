//import {PNG,PNGReader} from "./lib/pngjs/index";
import * as binaryPlugin from "./lib/JQueryBinaryTransport";

const SIGN_OFFSET = 8;
const LENGTH_LENGTH = 4;
const TYPE_LENGTH = 4;
const CRC_LENGTH = 4;

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

    decompress(width: number, height: number){
        // TODO: Support other modes / bit depths
        let decoded = pako.inflate(this._data);

        // First byte in row is filter --> remove
        let rawData = new Uint8Array(width * height);
        let rPtr = 0;
        for (var i = 0; i < decoded.length; i++) {
            if(i % (width+1) != 0){
                rawData[rPtr] = decoded[i];
                rPtr++;
            }            
        }
        return rawData;
    }
}

export class EndChunk extends PngChunk {
    constructor(length: number, type: ChunkType, data: Uint8Array, crc: number){
        super(length, type, data, crc);
        if(type != ChunkType.End)
            throw "Not a end chunk";
    }
}

export enum ChunkType {
    Header = 0x49484452,
    Palette = 0x504C5445,
    Data = 0x49444154,
    End = 0x49454E44
}

export type BitDepth = 1 | 2 | 4 | 8 | 16;

export enum ColorType {
    Greyscale = 0,
    TrueColor = 2,
    Indexed = 3,
    GreyscaleAlpha = 4,
    TruecolorAlpha = 6
}

export class PngReader {
    private _signature: Uint8Array;
    private _dataView: DataView;
    private _header: HeaderChunk;
    private _palette: PaletteChunk;
    private _data: DataChunk;

    constructor(private data: ArrayBuffer){
        this._dataView = new DataView(data);
        this._signature = new Uint8Array(data, 0, SIGN_OFFSET);
        this._read();
    }

    get header() {
        return this._header;
    }

    get palette(){
        return this._palette;
    }

    get imageData(){
        return this._data;
    }

    private _read(){
        this._checkSignature();
        this._readChunks();
    }

    protected _checkSignature(){
        let sig = this._signature;
        if(!(sig[0] == 137 
        && sig[1] == 80 
        && sig[2] == 78 
        && sig[3] == 71 
        && sig[4] == 13 
        && sig[5] == 10 
        && sig[6] == 26 
        && sig[7] == 10))
            throw "Data is not a png";
    }

    protected _readChunks(){
        let offset = SIGN_OFFSET;
        while(offset < this._dataView.byteLength){
            let chunk = this._readChunk(offset);
            if(chunk){
                switch (chunk.type) {
                    case ChunkType.Header:
                        this._header = <HeaderChunk>chunk;
                        break;
                    case ChunkType.Palette:
                        this._palette = <PaletteChunk>chunk;
                        break;
                    case ChunkType.Data:
                        this._data = <DataChunk>chunk;
                        break;
                    default:
                        break;
                }
                
                offset += chunk.totalLength;
            }
        }
    }

    protected _readChunk(offset: number){
        let view = this._dataView;

        let length = view.getUint32(offset, false);
        offset+=4;

        let type = <ChunkType>view.getUint32(offset, false);
        offset+=4;
        
        let data = new Uint8Array(this._dataView.buffer, offset, length);
        offset+=length;

        let crc = view.getUint32(offset, false);

        switch (type) {
            case ChunkType.Header:
                return new HeaderChunk(length, type, data, crc);
            case ChunkType.Palette:
                return new PaletteChunk(length, type, data, crc);                
            case ChunkType.Data:
                return new DataChunk(length, type, data, crc);                
            case ChunkType.End:
                return new EndChunk(length, type, data, crc);                
            default:
                //throw "Unsupported chunk";
        }
    }
}

export async function main(){

    binaryPlugin.register();

    let buffer: ArrayBuffer = await $.ajax(<any>{
        url: "res/textures/8bit_test.png",
        type: "GET",
        dataType: "binary",
        responseType: "arraybuffer",
        processData: false
    });

    let png = new PngReader(buffer);
    console.log(png.header);        
    console.log(png.palette);        
    console.log(png.palette.getColor(4)); 
    console.log(png.imageData.decompress(png.header.width, png.header.height));       
}
