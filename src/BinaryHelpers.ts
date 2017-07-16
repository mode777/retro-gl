export function stringToBuffer(binaryString: string): ArrayBuffer{
    const array = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        array[i] = binaryString.charCodeAt(i);        
    }
    return array.buffer;
}