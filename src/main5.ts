import { ArrayByteStream } from './GifReader/ArrayByteStream';
import { BitStream } from './GifReader/BitStream';
let arr = new Uint8Array([15,15]);

let bys = new ArrayByteStream(arr);
let bis = new BitStream(bys);

let bits = bis.read(4);
while(bits != null){
    //console.log((bits>>>0).toString(2));
    bits = bis.read(4);
}