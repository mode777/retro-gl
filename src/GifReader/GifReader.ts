// https://www.w3.org/Graphics/GIF/spec-gif89a.txt

enum BlockIntroducer {
    Extension = 0x21,
    ImageDescriptor = 0x2C
}

enum ExtensionType {
    GraphicControl = 0xF9,
    PlainText = 0x01,
    Application = 0xFF,
    Comment = 0xFE,
}

import { LogicalScreenDescriptorBlock, ColorTableBock } from './blocks';
const HEADER_OFFSET = 6;

export class GifReader{

    private _view: DataView;
    private _header: Uint8Array;
    private _lsd: LogicalScreenDescriptorBlock;
    private _gtt: ColorTableBock;

    constructor(data: ArrayBuffer){
        this._header = new Uint8Array(data, 0, HEADER_OFFSET);
        this._view = new DataView(data);
        this._read();
    }

    protected _read(){
        let offset = 0;
        this._checkHeader();
        offset += HEADER_OFFSET;
        this._lsd = new LogicalScreenDescriptorBlock(this._view, offset);
        offset += this._lsd.read();
        if(this._lsd.hasGlobalColorTable){
            this._gtt = new ColorTableBock(this._view, offset, this._lsd.totalColors);
            offset += this._gtt.read();
        }
        let separator = this._view.getUint8(offset);
        offset++;
        switch (separator) {
            case BlockIntroducer.Extension:
                let ext = this._view.getUint8(offset);
                offset++;
                switch (ext) {
                    case ExtensionType.GraphicControl:
                        console.log("GCE");
                        break;
                    case ExtensionType.Application:
                        console.log("AE");
                        break;
                    case ExtensionType.PlainText:
                        console.log("PTE");
                        break;
                    case ExtensionType.Comment:
                        console.log("CE");
                        break;
                    default:
                        throw "Unknown extension 0x" + ext.toString(16);
                }
                break;
            case BlockIntroducer.ImageDescriptor:
                console.log("ID");
                break;        
            default:
                throw "Unknown block introducer 0x" + separator.toString(16);
        }
    }

    protected _checkHeader(){
        let h = this._header;
        if(!(h[0]==0x47 
        && h[1]==0x49 
        && h[2]==0x46
        && h[3]==0x38
        && h[4]==0x39
        && h[5]==0x61))
            throw "Image is not a (suported) gif.";
    }
}