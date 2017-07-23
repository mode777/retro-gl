export function stringToBuffer(binaryString: string): ArrayBuffer{
    const array = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        array[i] = binaryString.charCodeAt(i);        
    }
    return array.buffer;
}

// source: https://stackoverflow.com/a/466278/4361832
export function upperPowerOfTwo(v: number)
{
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++;
    return v;
}