import { Transform2d } from './Transform';
import * as twgl from "twgl.js";
import { mat4 } from "gl-matrix";
import { ProgramInfo, BufferInfo } from "twgl.js";

export type BlendMode = "none" | "alpha";

export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Buffer {
    bufferInfo: twgl.BufferInfo;
    update(): void;
    vertexSize: number;
}

export interface FontInfo {
    x: number,
    y: number,
    chars: string,
    widths: number[]
}

export interface MatrixTransform {
    matrix: mat4;
}

export interface RendererSettings {
    texture: WebGLTexture,
    paletteId: number,
    palette: WebGLTexture,
    shader: twgl.ProgramInfo,
    zSort: boolean,
    blendMode: BlendMode
}

export interface RenderableOptions {
    texture?: WebGLTexture,
    paletteId?: number,
    palette?: WebGLTexture,
    shader?: twgl.ProgramInfo
    zSort?: boolean,
    blendMode?: BlendMode
    mode7?: boolean
}

export interface RenderableBufferOptions<TBuffer extends Buffer> extends RenderableOptions {
    buffer: TBuffer,
    transform?: Transform2d,
}

export interface Renderable {
    update();
    bufferInfo: BufferInfo
    transformation: mat4,
    texture: WebGLTexture,
    mode7: boolean,
    zSort: boolean,
    blendMode: BlendMode,
    elements: number;
    offset: number;
}

export interface IndexedRenderable extends Renderable {
    palette: number;
}

export interface Sprite {
    transform: Transform2d;
    x: number;
    y: number;
    tag: {[key: string]: any}
}

export interface SpriteAttributes{
    x: number,
    y: number,
    w: number,
    h: number,
    z: number,
    palOffset: number,
    textureX: number,
    textureY: number,
}

export interface Renderer<T extends Renderable> {
    readonly renderList: T[];
    render();
}

export interface Tileset {
    readonly pixelWidth: number; 
    readonly pixelHeght: number;
    readonly texture: WebGLTexture;
    readonly positionData: Uint8Array; 
}