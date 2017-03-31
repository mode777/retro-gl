import { ImageDataBlock } from './blocks';

export class GifLzwDecoder {

    protected _clearCode: number;
    protected _eoiCode: number;
    protected _codeTable: number[][];
    protected _indexStream: number[];

    private _codeCtr: number;
    private _curCodePtr: number; 

    private _bytePtr: number;
    private _blockPtr: number;
    private _bitShift: number;
    private _bitBuffer: number;
    private _remainBits: number;
    
    constructor(private _block: ImageDataBlock){
        this._clearCode = 1 << _block.lzwMinCodeSize;
        this._eoiCode = this._clearCode + 1;
    }

    decompress(){
        this._reset();

        this._indexStream = [];

        let curCode = this._getNextCode(this._block.lzwMinCodeSize);
        this._initCodeTable();
        curCode = this._getNextCode(this._block.lzwMinCodeSize);
        this._indexStream.concat(this._codeTable[curCode]);

        curCode = this._getNextCode(this._block.lzwMinCodeSize);
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

            curCode = this._getNextCode(this._block.lzwMinCodeSize);
        }
    }

    protected _reset(){
        this._bytePtr = 0;
        this._blockPtr = 0;
        this._bitShift = 0;
        this._bitBuffer = 0;
        this._remainBits = 32;
    }

    protected _initCodeTable(){
        this._codeTable = [];
        for (var i = 0; i < this._clearCode; i++) {
            this._codeTable[i] = [i];            
        }
        this._codeTable.push([this._clearCode]);
        this._codeTable.push([this._eoiCode]);
    }

    protected get remainBits(){
        return 
    }

    protected _getNextCode(bits: number): number{
        while(this._remainBits >= 8){
            this._remainBits-=8;
            this._bitBuffer |= (this._getNextByte() << this._remainBits);
        }
        return this._bitBuffer >> (32 - bits);
    }

    protected _getNextByte(): number {
        if(this._blockPtr >= this._block.blocks.length-1)
            return null;

        let data = this._block.blocks[this._blockPtr].data;
        if(this._bytePtr >= data.length-1){
            this._bytePtr = 0;
            this._blockPtr++;
            return this._getNextByte();      
        }

        return data[this._bytePtr];
    }

}