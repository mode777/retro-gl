import { ImageDataBlock } from './blocks';
import { BitStream } from './BitStream';
import { SubBlockStream } from './SubBlockStream';

export class GifLzwDecoder {

    protected _clearCode: number;
    protected _eoiCode: number;
    protected _codeTable: string[];
    protected _indexStream: string;
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
        this._indexStream += this._codeTable[curCode];

        while (true) {
            lastCode = curCode;
            curCode = this._codeStream.read(this._codeBits);
            
            if(curCode == this._clearCode){
                this._initCodeTable();
                continue;
            }
            
            else if(curCode == this._eoiCode)
                break;

            //console.log("cur code: "+curCode);
            let next = this._codeTable[lastCode];
            let val = this._codeTable[curCode];
            let k = val ? val[0] : next[0];
            next+=k;
            val = val || next;
            //console.log("new code: "+ this._codeTable.length + ": "+this._strToBytes(next));
            this._codeTable.push(next);
            this._indexStream+=val;
            //console.log("index stream: "+this._strToBytes(this._indexStream));


            if(this._codeTable.length == (1<<this._codeBits))
                this._codeBits++;
            
        }
        return this._strToBytes(this._indexStream);
    }

    protected _reset(){               
        this._codeBits = this._block.lzwMinCodeSize+1; 
        this._indexStream = "";
        this._codeStream = new BitStream(new SubBlockStream(this._block.blocks));
    }

    protected _initCodeTable(){
        console.log("init table");
        this._codeTable = [];
        for (var i = 0; i < this._clearCode; i++) {
            this._codeTable[i] = String.fromCharCode(i);            
        }
        this._codeTable.push(String.fromCharCode(this._clearCode));
        this._codeTable.push(String.fromCharCode(this._eoiCode));
        this._codeBits = this._block.lzwMinCodeSize + 1;
    }

    private _strToBytes(encoded: string){
        let arr = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
            arr[i] = encoded.charCodeAt(i);          
        }
        return arr;
    }
   

}