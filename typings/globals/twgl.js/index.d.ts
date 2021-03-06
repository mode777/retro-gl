declare module "twgl.js" {

    export function bindFramebufferInfo(gl: WebGLRenderingContext, framewbufferInfo?: FramebufferInfo, target?: number): void;
    export function bindTransformFeedbackInfo(gl: WebGLRenderingContext, transformFeedbackInfo?: ProgramInfo | {[key: string]: AttribInfo}): void;
    export function bindUniformBlock(gl: WebGLRenderingContext, programInfo: ProgramInfo | UniformBlockSpec, uniformBlockInfo: UniformBlockInfo): boolean;
    export function createBufferInfoFromArrays(gl: WebGLRenderingContext, arrays: Arrays): BufferInfo;
    export function createFramebufferInfo(gl: WebGLRenderingContext, attachments?: AttachmentOptions[], width?: number, height?: number): FramebufferInfo;
    export function createProgramInfo(gl: WebGLRenderingContext, shaderSources: string[], attribs?: string[] | ProgramOptions, locations?: number[], errorCallback?: ErrorCallback): ProgramInfo;
    export function createTexture(gl: WebGLRenderingContext, options?: TextureOptions, callback?: TextureReadyCallback): WebGLTexture;
    export function createTextures(gl: WebGLRenderingContext, options?: {[key: string]: TextureOptions}, callback?: TexturesReadyCallback): {[key: string]: WebGLTexture};
    export function createTransformFeedback(gl: WebGLRenderingContext, programInfo: ProgramInfo, bufferInfo?: BufferInfo | {[key: string]: AttribInfo}): WebGLObject;
    export function createTransformFeedbackInfo(gl: WebGLRenderingContext, program: WebGLProgram): {[key: string]: TransformFeedbackInfo};
    export function createUniformBlockInfo(gl: WebGLRenderingContext, programInfo: ProgramInfo, blockName: string): UniformBlockInfo;
    export function drawBufferInfo(gl: WebGLRenderingContext, bufferInfo: BufferInfo | VertexArrayInfo, type?: number, count?: number, offset?: number): void;
    export function drawObjectList(objects: DrawObject[]): void;
    export function getContext(canvas: HTMLCanvasElement, attribs?: WebGLContextAttributes): WebGLRenderingContext;
    export function getWebGLContext(canvas: HTMLCanvasElement, attribs?: WebGLContextAttributes): WebGLRenderingContext;
    export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, multiplier?: number): boolean;
    export function resizeFramebufferInfo(gl :WebGLRenderingContext, framebufferInfo: FramebufferInfo, attachments?: AttachmentOptions[], width?: number, height?: number): void;
    export function resizeTexture(gl: WebGLRenderingContext, tex: WebGLTexture, options: TextureOptions, width?: number, height?: number): void;
    export function setAttribInfoBufferFromArray(gl: WebGLRenderingContext, attribInfo: AttribInfo, array: ArraySpec, offset?: number): void;
    export function setBlockUniforms(uniformBlockInfo: UniformBlockInfo, values: {[key: string]: number[] | ArrayBuffer | number}): void;
    export function setBuffersAndAttributes(gl: WebGLRenderingContext, setters: ProgramInfo | {[key: string]: (...params: any[]) => void}, buffers: BufferInfo | VertexArrayInfo): void;
    export function setDefaults(newDefaults: Defaults): void;
    export function setTextureFromArray(gl: WebGLRenderingContext, tex: WebGLTexture, src: number[] | ArrayBuffer, options?: TextureOptions): void;
    export function setUniformBlock(gl: WebGLRenderingContext, programInfo: ProgramInfo | UniformBlockSpec, uniformBlockInfo: UniformBlockInfo): void;
    export function setUniforms(setters: ProgramInfo | {[key: string]: (...params: any[]) => void}, values: {[key: string]: any}): void;

    export interface Arrays {
        [key: string]: number[] | ArrayBuffer 
    }

    export type ArraySpec = number[] | ArrayBuffer | FullArraySpec;

    export interface AttachmentOptions extends TextureOptions {
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
        normalize?: boolean;
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
        attribs: {[key: string]: AttribInfo};
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

    export type ErrorCallback = (msg: string, lineOffset?:number) => void;

    export interface FramebufferInfo {
        framebuffer: WebGLFramebuffer;
        attachments: WebGLObject[];
    }

    export interface FullArraySpec {
        data: number | number[] | ArrayBuffer;
        numComponents?: number;
        type: new (...args: any[]) => ArrayBuffer;
        size?: number;
        normalize?: boolean;
        stride?: number;
        offset?: number;
        name?: string;
        attribName?: string;
    }

    export interface ProgramInfo {
        program: WebGLProgram;
        uniformSetters: {[key: string]: (...para: any[]) => void},
        attribSetters: {[key: string]: (...para: any[]) => void},
        transformFeedbackInfo: {[key: string]: TransformFeedbackInfo}
    }

    export interface ProgramOptions {
        errorCallback?: (error: any) => void;
        attribLocations?: {[key: string]: number};
        transformFeedbackVaryings?: BufferInfo | {[key: string]: AttribInfo} | string[];
        transformFeedbackMode?: number;  
    }

    export type FullTextureSrc = number[] | ArrayBuffer | HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | string | string[] | TextureFunc;

    export type TextureFunc = (gl: WebGLRenderingContext, options: TextureOptions) => FullTextureSrc;

    export interface TextureOptions {
        target?: number;
        width?: number;
        height?: number;
        depth?: number;
        min?: number;
        mag?: number;
        minMag?: number;
        internalFormat?: number;
        format?: number;
        type?: number;
        wrap?: number;
        wrapS?: number;
        wrapT?: number;
        wrapR?: number;
        minLod?: number;
        maxLod?: number;
        baseLevel?: number;
        maxLevel?: number;
        unpackAlignment?: number;
        premultiplyAlpha?: number;
        flipY?: number;
        colorspaceConversion?: number;
        color?: number[] | ArrayBuffer;
        auto?: boolean;
        cubeFaceOrder?: number[];
        src?: FullTextureSrc;
        crossOrigin?: string;
    }

    export type TextureReadyCallback = (err: any, texture: WebGLTexture, source: TextureSrc) => void;

    export type TextureSrc = HTMLImageElement | HTMLImageElement[];

    export type TexturesReadyCallback = (err: any, textures: {[key: string]: WebGLTexture}, sources: {[key: string]: TextureSrc} ) => void;

    export type ThreeDReadyCallback = (err: any, tex: WebGLTexture, imgs: HTMLImageElement[]) => void;

    export interface TransformFeedbackInfo {
        index: number;
        type: number;
        size: number;
    }

    export interface UniformBlockInfo {
        name: string;
        array: ArrayBuffer;
        asFloat: Float32Array;
        buffer: WebGLBuffer;
        offset?: number;
        uniforms: {[key: string]: ArrayBufferView}
    }

    export interface  UniformBlockSpec {
        blockSpecs: {[key: string]: BlockSpec};
        uniformData: UniformData[];
    }

    export interface UniformData {
        type: number;
        size: number;
        blockNdx: number;
        offset: number;
    }

    export interface VertexArrayInfo {
        numElements: number;
        elementType: number;
        vertexArrayObject?: WebGLObject;
    }

    export function createBufferFromTypedArray(gl: WebGLRenderingContext, typedArray: ArrayBuffer | ArrayBufferView | WebGLBuffer, type?: number, drawType?: number): WebGLBuffer;

    // attributes module
    export module attributes {
        export function createAttribsFromArrays(gl: WebGLRenderingContext,arrays: Arrays): {[name: string]: AttribInfo};
        export function createBufferFromArray(gl: WebGLRenderingContext, array: ArraySpec, arrayName: string): WebGLBuffer;
        export function createBufferFromTypedArray(gl: WebGLRenderingContext, typedArray: ArrayBuffer | ArrayBufferView | WebGLBuffer, type?: number, drawType?: number): WebGLBuffer;
        export function createBufferInfoFromArrays(gl: WebGLRenderingContext, arrays: Arrays): BufferInfo;
        export function createBuffersFromArrays(gl: WebGLRenderingContext, arrays: Arrays): {[name: string]: WebGLBuffer};
        export function setAttribInfoBufferFromArray(gl: WebGLRenderingContext, attribInfo: AttribInfo, array: ArraySpec, offset?: number): void;
        export function setAttrbutePrefix(prefix: string): void;
    }

    export function createAttribsFromArrays(gl: WebGLRenderingContext,arrays: Arrays): {[name: string]: AttribInfo};
    export function createBufferFromArray(gl: WebGLRenderingContext, array: ArraySpec, arrayName: string): WebGLBuffer;
    export function createBufferFromTypedArray(gl: WebGLRenderingContext, typedArray: ArrayBuffer | ArrayBufferView | WebGLBuffer, type?: number, drawType?: number): WebGLBuffer;
    export function createBufferInfoFromArrays(gl: WebGLRenderingContext, arrays: Arrays): BufferInfo;
    export function createBuffersFromArrays(gl: WebGLRenderingContext, arrays: Arrays): {[name: string]: WebGLBuffer};
    export function setAttribInfoBufferFromArray(gl: WebGLRenderingContext, attribInfo: AttribInfo, array: ArraySpec, offset?: number): void;

    // draw module
    export module draw {
        export function drawBufferInfo(gl: WebGLRenderingContext, bufferInfo: BufferInfo | VertexArrayInfo, type?: number, count?: number, offset?: number): void;
        export function drawObjectList(objectsToDraw: DrawObject[]): void;
    }

    export function drawBufferInfo(gl: WebGLRenderingContext, bufferInfo: BufferInfo | VertexArrayInfo, type?: number, count?: number, offset?: number): void;
    export function drawObjectList(objectsToDraw: DrawObject[]): void;

    // framebuffers module
    export module framebuffers {
        export function bindFramebufferInfo(gl: WebGLRenderingContext, framebufferInfo: FramebufferInfo, target?: number): void;
        export function createFramebufferInfo(gl: WebGLRenderingContext, attachments?: AttachmentOptions[], widt?: number, height?: number): FramebufferInfo;
        export function resizeFramebufferInfo(gl: WebGLRenderingContext, framebufferInfo: FramebufferInfo, attachments?: AttachmentOptions[], width?: number, height?: number): void;
    }
    
    export function bindFramebufferInfo(gl: WebGLRenderingContext, framebufferInfo: FramebufferInfo, target?: number): void;
    export function createFramebufferInfo(gl: WebGLRenderingContext, attachments?: AttachmentOptions[], widt?: number, height?: number): FramebufferInfo;
    export function resizeFramebufferInfo(gl: WebGLRenderingContext, framebufferInfo: FramebufferInfo, attachments?: AttachmentOptions[], width?: number, height?: number): void;

    export type Mat4 = number[] | Float32Array;
    export type Vec3 = number[] | Float32Array;

    export module m4 {
        export function axisRotate(m: Mat4, axis: Vec3, angleInRadians: number, dst?: Mat4) : Mat4;
        export function axisRotation(axis: Vec3, angleInRadians: number, dst?: Mat4): Mat4;
        export function copy(m: Mat4, dst?: Mat4): Mat4;
        export function frustum(left: number, right: number, bottom: number, top: number, near: number, far: number, dst?: Mat4): Mat4;
        export function getAxis(m: Mat4, axis: number): Vec3
        export function getTranslation(m: Mat4, dst?: Vec3): Vec3
        export function identity(dst?: Mat4): Mat4;
        export function inverse(m: Mat4, dst?: Mat4): Mat4;
        export function lookAt(eye: Vec3, target: Vec3, up: Vec3, dst?: Mat4): Mat4;
        export function multiply(a: Mat4, b: Mat4, dst?: Mat4): Mat4;
        export function negate(m: Mat4, dst?: Mat4): Mat4;
        export function ortho(left: number, right: number, top: number, bottom: number, near: number, far: number, dst?: Mat4): Mat4;
        export function perspective(fieldOfViewYInRadians: number, aspect: number, zNear: number, zFar: number, dst?: Mat4): Mat4;
        export function rotateX(m: Mat4, angleInRadians: number, dst?: Mat4): Mat4;
        export function rotateY(m: Mat4, angleInRadians: number, dst?: Mat4): Mat4;
        export function rotateZ(m: Mat4, angleInRadians: number, dst?: Mat4): Mat4;
        export function rotationX(angleInRadians: number, dst?: Mat4): Mat4;
        export function rotationY(angleInRadians: number, dst?: Mat4): Mat4;
        export function rotationZ(angleInRadians: number, dst?: Mat4): Mat4;
        export function scale(m: Mat4, v: number, dst?: Mat4): Mat4;
        export function scaling(v: number, dst?: Mat4): Mat4;
        export function setAxis(v: number, axis: number, dst?: Mat4): Mat4;
        export function setTranslation(a: Mat4, v: Vec3, dst?: Mat4): Mat4;
        export function transformDirection(m: Mat4, v: Vec3, dst?: Vec3): Vec3;
        export function transformNormal(m: Mat4, v: Vec3, dst?: Vec3): Vec3;
        export function transformPoint(m: Mat4, v: Vec3, dst?: Vec3): Vec3;
        export function translate(m: Mat4, v: Vec3, dst?: Mat4): Mat4;
        export function translation(v: Vec3, dst?: Mat4): Mat4;
        export function transpose(m: Mat4, dst?: Mat4): Mat4;
    }

    export type TypedArray = Uint16Array | Uint8Array | Uint32Array | Int32Array | Int16Array | Int8Array | Float32Array | Float64Array;

    export module primitives {
        export interface RandomVerticesOptions {
            rand: RandomColorFunc;
            vertsPerColor: number;
        }

        export interface AugmentedTypedArray extends ArrayLike<number> {
            push(value: number[] | number, ...values: number[]): void;
            buffer: ArrayBuffer;
        }

        export type RandomColorFunc = (ndx: number, channel: number) => number;

        export type TypedArrayConstructor = Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor | Int8ArrayConstructor | Int16ArrayConstructor | Int32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor;

        export function concatVertices(arrays: Arrays): Arrays;
        export function create3DFBufferInfo(gl: WebGLRenderingContext): BufferInfo;
        export function create3DFBuffers(gl: WebGLRenderingContext): {[key: string]: WebGLBuffer};
        export function create3DFVertices(): {[key: string]: TypedArray};
        export function createAugmentedTypedArray(numComponents: number, numElements: number, opt_type?: TypedArrayConstructor): AugmentedTypedArray;
        export function createCresentBufferInfo(gl: WebGLRenderingContext, verticalRadius: number, outerRadius: number, innerRadius: number, thickness: number, subdivisionsDown: number, subdivisionsThick: number, startOffset?: number, endOffset?: number): BufferInfo;
        export function createCresentBufferInfo(gl: WebGLRenderingContext, verticalRadius: number, outerRadius: number, innerRadius: number, thickness: number, subdivisionsDown: number, subdivisionsThick: number, startOffset?: number, endOffset?: number): {[key: string]: WebGLBuffer};
        export function createCresentVertices(verticalRadius: number, outerRadius: number, innerRadius: number, thickness: number, subdivisionsDown: number, subdivisionsThick: number, startOffset?: number, endOffset?: number): {[key: string]: TypedArray};
        export function createCubeBuffers(gl: WebGLRenderingContext, size?: number): {[key: string]: WebGLBuffer};
        export function createCubeVertices(size?: number): {[key: string]: TypedArray};
        export function createCylinderBufferInfo(gl: WebGLRenderingContext, radius: number, height: number, radialSubdivisions: number, verticalSubdivisions: number, topCap?: boolean, bottomCap?: boolean): {[key: string]: BufferInfo};
        export function createCylinderBuffers(gl: WebGLRenderingContext, radius: number, height: number, radialSubdivisions: number, verticalSubdivisions: number, topCap?: boolean, bottomCap?: boolean): {[key: string]: WebGLBuffer};
        export function createCylinderVertices(radius: number, height: number, radialSubdivisions: number, verticalSubdivisions: number, topCap: boolean, bottomCap: boolean): {[key: string]: TypedArray};
        export function createDiscBufferInfo(gl: WebGLRenderingContext, radius: number, divisions: number, stacks?: number, innerRadius?: number, stackPower?: number): BufferInfo;
        export function createDiscBuffers(gl: WebGLRenderingContext, radius: number, divisions: number, stacks?: number, innerRadius?: number, stackPower?: number): {[key: string]: WebGLBuffer};
        export function createDiscVertices(radius: number, divisions: number, stacks?: number, innerRadius?: number, stackPower?: number): {[key: string]: TypedArray};
        export function createPlaneBufferInfo(gl: WebGLRenderingContext, width?: number, depth?: number, subdivisionsWidth?: number, subdivisionsDepth?: number, matrix?: number): BufferInfo;
        export function createPlaneBuffers(gl: WebGLRenderingContext, width?: number, depth?: number, subdivisionsWidth?: number, subdivisionsDepth?: number, matrix?: Mat4): {[key: string]: WebGLBuffer};
        export function createPlaneVertices(width?: number, depth?: number, subdivisionsWidth?: number, subdivisionsDepth?: number, matrix?: number): {[key: string]: TypedArray};
        export function createSphereBufferInfo(gl: WebGLRenderingContext, radius: number, subdivisionsAxis: number, subdivisionsHeight: number, opt_startLatitudeInRadians?: number, opt_endLatitudeInRadians?: number, opt_startLongitudeInRadians?: number, opt_endLongitudeInRadians?: number): BufferInfo;
        export function createSphereBuffers(gl: WebGLRenderingContext, radius: number, subdivisionsAxis: number, subdivisionsHeight: number, opt_startLatitudeInRadians?: number, opt_endLatitudeInRadians?: number, opt_startLongitudeInRadians?: number, opt_endLongitudeInRadians?: number): {[key: string]: WebGLBuffer};
        export function createSphereVertices(radius: number, subdivisionsAxis: number, subdivisionsHeight: number, opt_startLatitudeInRadians?: number, opt_endLatitudeInRadians?: number, opt_startLongitudeInRadians?: number, opt_endLongitudeInRadians?: number): {[key: string]: TypedArray};
        export function createTorusBufferInfo(gl: WebGLRenderingContext, radius: number, thickness: number, radialSubdivisions: number, bodySubdivisions: number, startAngle?: number, endAngle?: number): BufferInfo;
        export function createTorusBuffers(gl: WebGLRenderingContext, radius: number, thickness: number, radialSubdivisions: number, bodySubdivisions: number, startAngle?: number, endAngle?: number): {[key: string]: WebGLBuffer};
        export function createTorusVertices(radius: number, thickness: number, radialSubdivisions: number, bodySubdivisions: number, startAngle?: number, endAngle?: number): {[key: string]: TypedArray};
        export function createTruncatedConeBufferInfo(gl: WebGLRenderingContext, bottomRadius: number, topRadius: number, height: number, radialSubdivisions: number, verticalSubdivisions: number, opt_topCapopt?: boolean, opt_bottomCap?: boolean): BufferInfo;
        export function createTruncatedConeBuffers(gl: WebGLRenderingContext, bottomRadius: number, topRadius: number, height: number, radialSubdivisions: number, verticalSubdivisions: number, opt_topCap?: boolean, opt_bottomCap?: boolean): {[key: string]: WebGLBuffer};
        export function createTruncatedConeVertices(bottomRadius: number, topRadius: number, height: number, radialSubdivisions: number, verticalSubdivisions: number, opt_topCap?: boolean, opt_bottomCap?: boolean): {[key: string]: TypedArray};
        export function createXYQuadBufferInfo(gl: WebGLRenderingContext, size?: number, xOffset?: number, yOffset?: number): {[key: string]: WebGLBuffer};
        export function createXYQuadBuffers(gl: WebGLRenderingContext, size?: number, xOffset?: number, yOffset?: number): BufferInfo;
        export function createXYQuadVertices(size?: number, xOffset?: number, yOffset?: number): any;
        export function deindexVertices(vertices: {[key: string]: TypedArray}): {[key: string]: TypedArray};
        export function duplicateVertices(arrays: Arrays): Arrays;
        export function flattenNormals(vertices: {[key: string]: TypedArray}): {[key: string]: TypedArray};
        export function makeRandomVertexColors(vertices: {[key: string]: AugmentedTypedArray}, options?: AugmentedTypedArray): {[key: string]: AugmentedTypedArray};
        export function reorientDirections(array: number[] | TypedArray, matrix: Mat4): number[] | TypedArray;
        export function reorientNormals(array: number[] | TypedArray, matrix: Mat4): number[] | TypedArray;
        export function reorientPositions(array: number[] | TypedArray, matrix: Mat4): number[] | TypedArray;
        export function reorientVertices(arrays: {[key: string]: number[] | TypedArray}, matrix: Mat4): {[key: string]: number[] | TypedArray};
    }

    // export module programs {
    //     export function bindUniformBlock(gl: WebGLRenderingContext, programInfo: ProgramInfo | UniformBlockSpec, uniformBlockInfo: UniformBlockSpec): boolean;
    //     export function createAttributeSetters(program: WebGLProgram): {[key:string]: (attr: any) => void};
    //     export function createProgram(shaders: WebGLShader[] | string[], opt_attribs?: ProgramOptions | string[], opt_locations?: number[], opt_errorCallback?: ErrorCallback): WebGLProgram;
    //     export function createProgramFromScripts(gl: WebGLRenderingContext, shaderScriptIds: string[], opt_attribs?: string[], opt_locations?: number[], opt_errorCallback?: ErrorCallback): WebGLProgram;
    //     export function createProgramFromSources(gl: WebGLRenderingContext, shaderSources, opt_attribsopt, opt_locationsopt, opt_errorCallback): WebGLProgram;
    //     export function createProgramInfo(gl: WebGLRenderingContext, shaderSources, opt_attribsopt, opt_locationsopt, opt_errorCallback): ProgramInfo;
    //     export function createProgramInfoFromProgram(gl: WebGLRenderingContext, program): ProgramInfo;
    //     export function createUniformBlockInfo(gl: WebGLRenderingContext, programInfo, blockName): UniformBlockInfo;
    //     export function createUniformBlockInfoFromProgram(gl: WebGLRenderingContext, program, blockName): UniformBlockInfo;
    //     export function createUniformBlockSpecFromProgram(gl: WebGLRenderingContext, program): UniformBlockSpec;
    //     export function createUniformSetters(program): {[key:string]: (attr: any) => void};
    //     /** @deprecated */
    //     export function setAttributes(setters, buffers);
    //     export function setBlockUniforms(uniformBlockInfo, values)
    //     export function setBuffersAndAttributes(gl: WebGLRenderingContext, setters, buffers)
    //     export function setUniformBlock(gl: WebGLRenderingContext, programInfo, uniformBlockInfo)
    //     export function setUniforms(setters, values)
    //  }

}