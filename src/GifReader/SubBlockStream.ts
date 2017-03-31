import { ByteStream } from './interfaces';
import { DataSubBlock } from './blocks';

export class SubBlockStream implements ByteStream {

    private _blockPtr: number;
    private _bytePtr: number;

    constructor(private _blocks: DataSubBlock[]){
        this._blockPtr = 0;
        this._bytePtr = 0;
    }

    read(){
        if(this._blockPtr >= this._blocks.length-1)
            return null;

        let data = this._blocks[this._blockPtr].data;
        if(this._bytePtr >= data.length-1){
            this._bytePtr = 0;
            this._blockPtr++;
            return this.read();      
        }

        return data[this._bytePtr];
    }

}