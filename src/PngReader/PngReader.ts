import { PaletteChunk, HeaderChunk, DataChunk, EndChunk } from './chunks';
import { ChunkType, SIGN_OFFSET, ColorType } from './constants';



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

    get imageColorComponents(){
        switch (this._header.colorType) {
            case ColorType.Greyscale:
            case ColorType.Indexed:
                return 1;
            case ColorType.TruecolorAlpha:
                return 4;
            case ColorType.Truecolor:
                return 3;        
            default:
                throw "unsupported color format";
        }
    }

    createPixelData(){
        const w = this._header.width;
        const h = this._header.height;
        const c = this.imageColorComponents;
        let bytes = w * h  * c;

        let pngData = this.imageData.decompress();
        let data = new Uint8Array(bytes);

        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                let pngOffset =  y * (w*c+1) + x*c+1;
                let pxOffset =  y * (w*c) + x*c;
                
                for (var i = 0; i < c; i++) {
                    data[pxOffset+i] = pngData[pngOffset+i];     
                }
            }            
        }      
        
        return data;
    }

    createPaletteDataRgba(size: number){
        // rgba
        const c = 4;
        // rgb
        const cPng = 3;
        
        let data = new Uint8Array(size * c);
        let pngData = this._palette.data;

        for (var i = 0; i < this._palette.colors; i++) {
            let offsetPng = cPng * i;
            let offset = c * i;
            data[offset] = pngData[offsetPng];
            data[offset+1] = pngData[offsetPng+1];
            data[offset+2] = pngData[offsetPng+2];
            data[offset+3] = 255;
        }

        return data;
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