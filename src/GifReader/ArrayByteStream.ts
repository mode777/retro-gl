import { ByteStream } from './interfaces';

export class ArrayByteStream implements ByteStream{
    
    private _ptr = 0;
    
    constructor(private _arr: Uint8Array){
        
    }
    
    read(){
        if(this._ptr >= this._arr.length)
            return null;

        return this._arr[this._ptr++];
    }
}