// https://www.w3.org/Graphics/GIF/spec-gif89a.txt
import { LogicalScreenDescriptorBlock, ColorTableBock, ApplicationExtensionBlock, GraphicControlExtensionBlock, ImageDescriptorBlock, ImageDataBlock } from './blocks';
import { GifImage } from './GifImage';

const HEADER_OFFSET = 6;

enum BlockIntroducer {
    Extension = 0x21,
    ImageDescriptor = 0x2C,
    Trailer = 0x3B
}

enum ExtensionType {
    GraphicControl = 0xF9,
    PlainText = 0x01,
    Application = 0xFF,
    Comment = 0xFE,
}


export class GifReader{

    private _view: DataView;
    private _header: Uint8Array;
    private _lsd: LogicalScreenDescriptorBlock;
    private _gtt: ColorTableBock;
    private _ae: ApplicationExtensionBlock;
    
    private _img: GifImage[];

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
            console.log(this._gtt.data);
        }

        let introducer = this._view.getUint8(offset);
        offset++;

        this._img = [];
        
        while (this._view.getUint8(offset) != BlockIntroducer.Trailer) {
            switch (introducer) {
                case BlockIntroducer.Extension:
                    let ext = this._view.getUint8(offset);
                    offset++;
                    switch (ext) {
                        case ExtensionType.GraphicControl:
                            let img = new GifImage(this._view, offset, true);
                            offset += img.read();
                            this._img.push(img);
                            break;
                        case ExtensionType.Application:
                            this._ae = new ApplicationExtensionBlock(this._view, offset);
                            offset += this._ae.read();
                            break;
                        // case ExtensionType.PlainText:
                        //     console.log("PTE");
                        //     break;
                        case ExtensionType.Comment:
                            console.log("CE");
                            break;
                        default:
                            throw "Unknown extension 0x" + ext.toString(16);
                    }
                    break;
                case BlockIntroducer.ImageDescriptor:
                    let img = new GifImage(this._view, offset, false);
                    offset += img.read();
                    this._img.push(img);
                    break;        
                default:
                    throw "Unknown block introducer 0x" + introducer.toString(16);
            }

            introducer = this._view.getUint8(offset);    
            offset++;
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