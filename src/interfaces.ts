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