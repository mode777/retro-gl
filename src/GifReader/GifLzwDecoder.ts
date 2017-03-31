import { ImageDataBlock } from './blocks';
import { BitStream } from './BitStream';
import { SubBlockStream } from './SubBlockStream';

export class GifLzwDecoder {

    protected _clearCode: number;
    protected _eoiCode: number;
    protected _codeTable: number[][];
    protected _indexStream: number[];
    protected _codeStream: BitStream;
  
    constructor(private _block: ImageDataBlock){
        this._clearCode = 1 << _block.lzwMinCodeSize;
        this._eoiCode = this._clearCode + 1;
    }

    decompress(){
        this._reset();

        let curCode = this._codeStream.read(this._block.lzwMinCodeSize);
        console.log(this._block.lzwMinCodeSize);
        console.log(curCode);
        if(1 == 1)
            throw "stop";
        curCode = this._codeStream.read(this._block.lzwMinCodeSize);
        this._indexStream.concat(this._codeTable[curCode]);

        curCode = this._codeStream.read(this._block.lzwMinCodeSize);
        while (curCode != this._eoiCode) {
            let val = this._codeTable[curCode];
            if(val){
                let k = val[0];
                let next = val.slice(0);
                next.push(k);
                this._codeTable.push(next);
            }
            else {
                let last = this._codeTable[curCode-1]; 
                let k = last[0];
                let next = val = last.slice(0)
                next.push(k);    
                this._codeTable.push(next);
            }
            this._indexStream.concat(val);

            curCode = this._codeStream.read(this._block.lzwMinCodeSize);
        }
    }

    protected _reset(){
        this._initCodeTable();
        this._indexStream = [];
        this._codeStream = new BitStream(new SubBlockStream(this._block.blocks));
    }

    protected _initCodeTable(){
        this._codeTable = [];
        for (var i = 0; i < this._clearCode; i++) {
            this._codeTable[i] = [i];            
        }
        this._codeTable.push([this._clearCode]);
        this._codeTable.push([this._eoiCode]);
    }
   

}