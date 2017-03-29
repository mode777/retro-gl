import { GifBlock, GraphicControlExtensionBlock, ImageDescriptorBlock, ColorTableBock, ImageDataBlock } from './blocks';

export class GifImage extends GifBlock {
    
    private _gce: GraphicControlExtensionBlock;
    private _id: ImageDescriptorBlock;
    private _lct: ColorTableBock;
    private _data: ImageDataBlock;

    constructor(view: DataView, offset: number, private _hasGce: boolean){
        super(view, offset);
    }

    get controlExtension(){
        return this._gce; 
    }

    get descriptor(){
        return this._id;
    }

    get localColorTable(){
        return this._lct;
    }

    get data(){
        return this._data;
    }
    
    public read(): number {
        let offset = this._offset;

        if(this._hasGce){
            //console.log("Graphic Control Extension Block");
            this._gce = new GraphicControlExtensionBlock(this._view, offset);
            offset += this._gce.read();
            // skip image seperator
            offset++;
        }

        //console.log("Image Descriptor Block");
        this._id = new ImageDescriptorBlock(this._view, offset);
        offset += this._id.read();

        if(this._id.hasLocalColorTable){
            //console.log("Local Color Table");
            this._lct = new ColorTableBock(this._view, offset, this._id.totalColors);
            offset += this._lct.read();
        }

        //console.log("Image Data Block");
        this._data = new ImageDataBlock(this._view, offset);
        offset += this._data.read();

        return offset - this._offset;
    }

    public decompressRawFrameData() {
        return this._data.decompress();
    }

}