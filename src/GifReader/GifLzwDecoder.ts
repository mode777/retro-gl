import { ImageDataBlock } from './blocks';
import { BitStream } from './BitStream';
import { SubBlockStream } from './SubBlockStream';

export class GifLzwDecoder {

    // protected _clearCode: number;
    // protected _eoiCode: number;
    // protected _codeTable: string[];
    // protected _indexStream: string;
    // protected _codeStream: BitStream;
    // protected _codeBits: number;
  
    constructor(private _block: ImageDataBlock){
        // this._clearCode = 1 << _block.lzwMinCodeSize;
        // this._eoiCode = this._clearCode + 1;
    }

    decompress(){
        let _clearCode = 1 << this._block.lzwMinCodeSize;
        let _eoiCode = _clearCode+1;
        let _codeBits = this._block.lzwMinCodeSize+1; 
        let _indexStream = "";
        let _codeStream = new BitStream(new SubBlockStream(this._block.blocks));
        let _codeTable: string[];

        let ctr = 0;
        let lastCode = 0;
        let curCode = 0;

        while (true) {            
            lastCode = curCode;            
            curCode = _codeStream.read(_codeBits);
            
            if(curCode == _clearCode){
                _codeBits = this._block.lzwMinCodeSize+1; 
                _codeTable = this._clear(_clearCode);
                continue;
            }            
            else if(curCode == _eoiCode)
                break;
                        
            if(lastCode != _clearCode){
                let next = _codeTable[lastCode];
                next += curCode < _codeTable.length ? _codeTable[curCode][0] : _codeTable[lastCode][0]; 
                _codeTable.push(next);
            }
            _indexStream += _codeTable[curCode];
            
            if(_codeTable.length == (1 << _codeBits) && _codeBits < 12)
                _codeBits++;
        }
        return this._strToBytes(_indexStream);
    }

    private _clear(clearCode: number) {
        let _codeTable = [];
        for (var i = 0; i < clearCode; i++) {
            _codeTable[i] = String.fromCharCode(i);            
        }
        _codeTable.push("");
        _codeTable.push(null);

        return _codeTable;
    }

    // protected _reset(){               
    //     this._codeBits = this._block.lzwMinCodeSize+1; 
    //     this._indexStream = "";
    //     this._codeStream = new BitStream(new SubBlockStream(this._block.blocks));
    // }

    // protected _initCodeTable(){
    //     this._codeBits = this._block.lzwMinCodeSize+1; 
    //     console.log("init table: " + this._clearCode);
    //     this._codeTable = [];
    //     for (var i = 0; i < this._clearCode; i++) {
    //         this._codeTable[i] = String.fromCharCode(i);            
    //     }
    //     this._codeTable.push(String.fromCharCode(this._clearCode));
    //     this._codeTable.push(String.fromCharCode(this._eoiCode));
    // }

    private _strToBytes(encoded: string){
        let arr = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
            arr[i] = encoded.charCodeAt(i);          
        }
        return arr;
    }
   

}