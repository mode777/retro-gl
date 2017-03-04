export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Mesh {
    bufferInfo: twgl.BufferInfo;
    update();
}

export interface FontInfo {
    x: number,
    y: number,
    chars: string,
    widths: number[]
}