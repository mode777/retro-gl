import { ByteStream } from './interfaces';

const CACHE_SIZE = 32;
const BYTE_SIZE = 8;
const MASK = 0xFFFFFFFFF;

export class BitStream {
    private _cache: number;
    private _bitsFull = 0;
    private _end = false;

    constructor(private _stream: ByteStream){
        this._cache = 0>>>0;
    }

    read(bits: number){
        this._fillCache();

        if(bits > this._bitsFull)
            return null;

        let ret = this._cache & (MASK>>>(CACHE_SIZE - bits));
        this._cache = this._cache >>> bits;
        this._bitsFull -= bits;
        return ret;
    }

    private _fillCache(){
        while(this._bitsFull <= (CACHE_SIZE - BYTE_SIZE)){
            let byte = this._stream.read();
            if(byte == null)
                return;
            this._cache |= (byte << this._bitsFull);
            this._bitsFull += BYTE_SIZE;
        }
    }
}