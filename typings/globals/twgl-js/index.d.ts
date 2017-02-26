declare namespace twgl {

    export interface Arrays {
        [key: string]: number[] | ArrayBuffer 
    }

    export type ArrySpec = number[] |ArrayBuffer | FullArraySpec;

    export interface AttachmentOptions {
        attach?: number;
        format?: number;
        type?: number;
        target?: number;
        level?: number;
        attachment?: WebGLObject;
    }

    export interface AttribInfo {
        numComponents?: number;
        size?: number;
        type?: number;
        normalized?: number;
        offset?: number;
        stride?: number;
        buffer?: WebGLBuffer;
        drawType?: number;
    }

    export interface BlockSpec {
        index: number;
        size: number;
        uniformIndices: number[];
        usedByVertexShader: boolean;
        usedByFragmentShader: boolean;
        used: boolean;
    }

    export interface BufferInfo {
        numElements: number;
        elementType?: number;
        indices: WebGLBuffer;
        attribs: {[key: string]: string | AttribInfo};
    }

    export type CubemapReadyCallback = (err: any,tex: WebGLTexture, imgs: HTMLImageElement[]) => void;

    export interface Defaults {
        attribPrefix?: string;
        textureColor?: number[];
        crossOrigin?: string;
        enableVertexArrayObjects?: boolean; 
    }

    export interface DrawObject {
        active?: boolean;
        type?: number;
        programInfo: ProgramInfo;
        bufferInfo?: BufferInfo;
        vertexArrayInfo?: VertexArrayInfo;
        uniforms: {[key: string]: any}; 
        offset?: number;
        count?: number;
    }

    export interface FullArraySpec {

    }

    export interface FramebufferInfo {
        framebuffer: WebGLFramebuffer;
        attachments: WebGLObject[];
    }

    export function bindFramebufferInfo(gl: WebGLRenderingContext, framewbufferInfo?: FramebufferInfo, target?: number);

}