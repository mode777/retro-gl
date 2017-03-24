export function compressAndEncode(data: Uint8Array){
    let compressed = pako.deflate(data, {
        to: "string"
    });
    return btoa(compressed);
}

export function decodeAndDecompress(b64: string){
    let decoded = atob(b64);
    return pako.inflate(b64);
}