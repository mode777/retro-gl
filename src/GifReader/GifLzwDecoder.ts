import { ImageDataBlock } from './blocks';
import { BitStream } from './BitStream';
import { SubBlockStream } from './SubBlockStream';

export class GifLzwDecoder {

    protected _clearCode: number;
    protected _eoiCode: number;
    protected _codeTable: number[][];
    protected _indexStream: number[];
    protected _codeStream: BitStream;
    protected _codeBits: number;
  
    constructor(private _block: ImageDataBlock){
        this._clearCode = 1 << _block.lzwMinCodeSize;
        this._eoiCode = this._clearCode + 1;
    }

    decompress(){
        let lastCode = 0;
        this._reset();
        
        this._codeStream.read(this._codeBits);
        this._initCodeTable();
        
        let curCode = this._codeStream.read(this._codeBits);
        this._indexStream = this._indexStream.concat(this._codeTable[curCode]);

        while (true) {
            lastCode = curCode;
            curCode = this._codeStream.read(this._codeBits);
            
            if(curCode == this._clearCode){
                this._initCodeTable();
                continue;
            }
            
            else if(curCode == this._eoiCode)
                break;

            let next = this._codeTable[lastCode].slice(0);
            let val = this._codeTable[curCode];
            let k = val ? val[0] : next[0];
            val = val || next;
            next.push(k);
            this._codeTable.push(next);
            this._indexStream = this._indexStream.concat(val);

            if(this._codeTable.length == (1<<this._codeBits))
                this._codeBits++;
            
        }
        return new Uint8Array(this._indexStream);
    }

    protected _reset(){               
        this._codeBits = this._block.lzwMinCodeSize+1; 
        this._indexStream = [];
        this._codeStream = new BitStream(new SubBlockStream(this._block.blocks));
    }

    protected _initCodeTable(){
        console.log("init table");
        this._codeTable = [];
        for (var i = 0; i < this._clearCode; i++) {
            this._codeTable[i] = [i];            
        }
        this._codeTable.push([this._clearCode]);
        this._codeTable.push([this._eoiCode]);
        this._codeBits = this._block.lzwMinCodeSize + 1;
    }
   

}