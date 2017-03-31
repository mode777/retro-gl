import { ByteStream } from './interfaces';

const CACHE_SIZE = 32;
const BYTE_SIZE = 8;

export class BitStream {
    private _cache: number;
    private _bitsEmpty = CACHE_SIZE;
    private _end = false;

    constructor(private _stream: ByteStream){

    }

    read(bits: number){
        this._fillCache();

        if(bits > (CACHE_SIZE - this._bitsEmpty))
            return null;

        let ret = this._cache>>>(CACHE_SIZE - bits)
        //console.log((ret).toString(2));
        this._cache = this._cache << bits;
        this._bitsEmpty += bits;
        return ret;
    }

    private _fillCache(){
        while(this._bitsEmpty >= BYTE_SIZE){
            let byte = this._stream.read();
            //console.log(byte);
            if(byte == null)
                return;
            this._bitsEmpty -= BYTE_SIZE;
            this._cache |= (byte << this._bitsEmpty);
        }
    }
}