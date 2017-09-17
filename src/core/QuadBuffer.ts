import { Rectangle, Buffer, MatrixTransform, SpriteAttributes, Sprite } from './interfaces';
import { VERTICES_QUAD, VERTEX_SIZE_BYTE, INDICES_QUAD, UV_OFFSET_BYTE, HUGE, QUAD_SIZE_BYTE, POS_COMPONENTS, UV_COMPONENTS, QUAD_SIZE_SHORT, VERTEX_SIZE_SHORT, MAX_QUADS, QUADBUFFER_INITIAL_CAPACITY, VERTEX_SIZE_FLOAT, POS_OFFSET_BYTE, POS_OFFSET_FLOAT, UV_OFFSET_SHORT, COLOR_COMPONENTS, UV_OFFSET_FLOAT, COLOR_OFFSET_BYTE, QUAD_SIZE_FLOAT } from './constants';
import { Quad } from './Quad';
import { Transform2d } from './Transform';
import * as twgl from "twgl.js";
import { mat4 } from "gl-matrix";
import { IndexBuffer } from "./IndexBuffer";
import { BufferedSprite } from "./BufferedSprite";
import { upperPowerOfTwo } from "./BinaryHelpers";

const POS_OFFSETS = [];
for (var i = 0; i < VERTICES_QUAD; i++) {
    for (var j = 0; j < POS_COMPONENTS; j++) {
        POS_OFFSETS.push(QUAD_SIZE_FLOAT * i + POS_OFFSET_FLOAT + j);
    }    
}

const UV_OFFSETS = [];
for (var i = 0; i < VERTICES_QUAD; i++) {
    for (var j = 0; j < UV_COMPONENTS; j++) {
        UV_OFFSETS.push(QUAD_SIZE_FLOAT * i + UV_OFFSET_FLOAT + j);
    }    
}

const COLOR_OFFSETS = [];
for (var i = 0; i < VERTICES_QUAD; i++) {
    for (var j = 0; j < COLOR_COMPONENTS; j++) {
        UV_OFFSETS.push(QUAD_SIZE_BYTE * i + COLOR_OFFSET_BYTE + j);
    }    
}

const EMPTY_QUAD = new Uint8Array(QUAD_SIZE_BYTE);
for (var i = 0; i < COLOR_OFFSETS.length; i++) {
    EMPTY_QUAD[COLOR_OFFSETS[i]] = 255;
}

export class QuadBuffer implements Buffer {
    private _byteView: Uint8Array;
    private _floatView: Float32Array;
    /*private*/ _indices: Uint16Array;
    /*private*/_data: ArrayBuffer;

    private _dirty_start = HUGE;
    private _dirty_end = 0;
    private _range: number;
    private _sprites: BufferedSprite[];
    private _freeList: number[] = [];

    private _bufferInfo: twgl.BufferInfo;

    constructor(private _gl: WebGLRenderingContext, private _capacity = QUADBUFFER_INITIAL_CAPACITY){
        this._data = new ArrayBuffer(_capacity * VERTICES_QUAD * VERTEX_SIZE_BYTE);
        this._byteView = new Uint8Array(this._data);
        this._floatView = new Float32Array(this._data);
        this._indices = new Uint16Array(_capacity * INDICES_QUAD);
        
        //this._createIndices();        
    }

    get isDirty(){
        return (this._dirty_end - this._dirty_start) > 0;
    }

    get bufferInfo(){
        if(!this._bufferInfo)
            throw "Buffer not created. Did you forget to call create(...)?";
        return this._bufferInfo;
    }

    get capacity(){
        return this._capacity;
    }

    get size(){
        return this._range;
    }


    get vertexSize(){
        return this._range * INDICES_QUAD;
    }

    // protected get range(){
    //     return this._range;
    // }

    update(){
        
        if(this._sprites){
            this._sprites.forEach(s => s.update());
        }
        if(this.isDirty){
            let gl = this._gl;
            let buffer = this.bufferInfo.attribs["position"].buffer;
            let data = new Uint8Array(this._data, this._dirty_start, this._dirty_end - this._dirty_start);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, this._dirty_start, data);
            
            this._dirty_start = HUGE;
            this._dirty_end = 0;
        }
    }

    destroy(){
        this._gl.deleteBuffer(this._bufferInfo.attribs["position"].buffer);
        this._gl.deleteBuffer(this._bufferInfo.attribs["indices"].buffer);

        this._indices = null;
        this._byteView = null;
        this._data = null;
    }

    protected set range(value: number){
        this._range = value;
        if(this._bufferInfo){
            this._bufferInfo.numElements = value * INDICES_QUAD;
        }
    }

    create(){
        var packedBuffer = twgl.createBufferFromTypedArray(
            this._gl, this._data, this._gl.ARRAY_BUFFER, this._gl.DYNAMIC_DRAW);

        const indexBuffer = new IndexBuffer(this._gl);

        this._bufferInfo = {
            numElements: this._range ? this._range * INDICES_QUAD : this._indices.length,
            indices: indexBuffer.buffer,            
            elementType: indexBuffer.elementType,  
            attribs: {
                position: { 
                    buffer: packedBuffer, 
                    numComponents: POS_COMPONENTS, 
                    type: this._gl.FLOAT, 
                    stride: VERTEX_SIZE_BYTE, 
                    offset: 0 
                },                
                texcoord: { 
                    buffer: packedBuffer, 
                    numComponents: UV_COMPONENTS, 
                    type: this._gl.FLOAT, 
                    stride: VERTEX_SIZE_BYTE, 
                    offset: UV_OFFSET_BYTE
                },
                color: { 
                    buffer: packedBuffer, 
                    numComponents: COLOR_COMPONENTS, 
                    type: this._gl.UNSIGNED_BYTE, 
                    stride: VERTEX_SIZE_BYTE, 
                    offset: COLOR_OFFSET_BYTE,
                    normalize: true
                },
            },
        };

        this._range = 0;

        this._dirty_start = HUGE;
        this._dirty_end = 0;

        return this;
    }
    
    setPosition(id: number, x1: number, y1: number, x2: number, y2: number){
        let start = id * QUAD_SIZE_FLOAT;
        let pos = this._floatView;

        pos[start+POS_OFFSETS[0]] = x1;
        pos[start+POS_OFFSETS[1]] = y1;
        pos[start+POS_OFFSETS[2]] = x2;
        pos[start+POS_OFFSETS[3]] = y1;
        pos[start+POS_OFFSETS[4]] = x2;
        pos[start+POS_OFFSETS[5]] = y2;
        pos[start+POS_OFFSETS[6]] = x1;
        pos[start+POS_OFFSETS[7]] = y2;

        this._setQuadDirty(start);
    }
    
    setPositionTransformed(id: number, x1: number, y1: number, x2: number, y2: number, m: mat4){
        let start = id * QUAD_SIZE_FLOAT;
        let pos = this._floatView;
        
        pos[start+POS_OFFSETS[0]] = m[0] * x1 + m[4] * y1 + m[12];
        pos[start+POS_OFFSETS[1]] = m[1] * x1 + m[5] * y1 + m[13];
        pos[start+POS_OFFSETS[2]] = m[0] * x2 + m[4] * y1 + m[12];
        pos[start+POS_OFFSETS[3]] = m[1] * x2 + m[5] * y1 + m[13];
        pos[start+POS_OFFSETS[4]] = m[0] * x2 + m[4] * y2 + m[12];
        pos[start+POS_OFFSETS[5]] = m[1] * x2 + m[5] * y2 + m[13];
        pos[start+POS_OFFSETS[6]] = m[0] * x1 + m[4] * y2 + m[12];
        pos[start+POS_OFFSETS[7]] = m[1] * x1 + m[5] * y2 + m[13];

        this._setQuadDirty(start);
    }

    setUv(id: number, x1: number, y1: number, x2: number, y2: number){
        let start = id * QUAD_SIZE_FLOAT;
        let uv = this._floatView;

        uv[start+UV_OFFSETS[0]] = x1;
        uv[start+UV_OFFSETS[1]] = y1;
        uv[start+UV_OFFSETS[2]] = x2;
        uv[start+UV_OFFSETS[3]] = y1;
        uv[start+UV_OFFSETS[4]] = x2;
        uv[start+UV_OFFSETS[5]] = y2;
        uv[start+UV_OFFSETS[6]] = x1;
        uv[start+UV_OFFSETS[7]] = y2;

        this._setQuadDirty(start);
    }

    setColor(id: number, r: number, g: number, b: number, a: number){
        const start = id * QUAD_SIZE_BYTE;
        const bytes = this._byteView;
        const limit = VERTICES_QUAD * COLOR_COMPONENTS;

        for (var i = 0; i < limit; i += COLOR_COMPONENTS) {
            bytes[start+COLOR_OFFSETS[i]] = r;
            bytes[start+COLOR_OFFSETS[i+1]] = g;
            bytes[start+COLOR_OFFSETS[i+2]] = b;
            bytes[start+COLOR_OFFSETS[i+3]] = a;
        }

        this._setQuadDirty(start);
    }

    setAlpha(id: number, a: number){
        const start = id * QUAD_SIZE_BYTE;
        const bytes = this._byteView;
        const limit = VERTICES_QUAD * COLOR_COMPONENTS;

        for (var i = 0; i < limit; i += COLOR_COMPONENTS) {
            bytes[start+COLOR_OFFSETS[i+3]] = a;
        }

        this._setQuadDirty(start);
    }

    setAttributes(id: number, x1: number, y1: number, x2: number, y2: number, uvx1: number, uvy1: number, uvx2: number, uvy2: number, r: number, g: number, b: number, a: number){
        const startFloats = id * QUAD_SIZE_FLOAT;
        const startBytes = id * QUAD_SIZE_BYTE;
        
        const floats = this._floatView;
        const bytes = this._byteView;
        const colorLimit = VERTICES_QUAD * COLOR_COMPONENTS;
        
        floats[startFloats+POS_OFFSETS[0]] = x1;
        floats[startFloats+POS_OFFSETS[1]] = y1;
        floats[startFloats+UV_OFFSETS[0]] = uvx1;
        floats[startFloats+UV_OFFSETS[1]] = uvy1;
        floats[startFloats+POS_OFFSETS[2]] = x2;
        floats[startFloats+POS_OFFSETS[3]] = y1;
        floats[startFloats+UV_OFFSETS[2]] = uvx2;
        floats[startFloats+UV_OFFSETS[3]] = uvy1;
        floats[startFloats+POS_OFFSETS[4]] = x2;
        floats[startFloats+POS_OFFSETS[5]] = y2;
        floats[startFloats+UV_OFFSETS[4]] = uvx2;
        floats[startFloats+UV_OFFSETS[5]] = uvy2;
        floats[startFloats+POS_OFFSETS[6]] = x1;
        floats[startFloats+POS_OFFSETS[7]] = y2;
        floats[startFloats+UV_OFFSETS[6]] = uvx1;
        floats[startFloats+UV_OFFSETS[7]] = uvy2;
        
        for (var i = 0; i < colorLimit; i += COLOR_COMPONENTS) {
            bytes[startBytes+COLOR_OFFSETS[i]] = r;
            bytes[startBytes+COLOR_OFFSETS[i+1]] = g;
            bytes[startBytes+COLOR_OFFSETS[i+2]] = b;
            bytes[startBytes+COLOR_OFFSETS[i+3]] = a;
        }   

        this._setQuadDirty(startFloats);
    }

    add(){
        if(this._freeList.length > 0)
            return this._freeList.pop();
        
        if(this._range >= this._capacity){
            const next = this._capacity * 2;
            //console.log("next:", next);
            this._resize(next);
        }
        return this._range++;
    }

    addMany(amount: number){
        const res: number[] = [];
        for (var i = 0; i < amount; i++) {
            res.push(this.add());
        }
    }

    getAttributeInfo(id: number): SpriteAttributes{
        let startFloat = id * QUAD_SIZE_FLOAT;
        let startByte = id * QUAD_SIZE_BYTE;
        
        let floats = this._floatView;
        let bytes = this._byteView;

        return {
            x: floats[startFloat+POS_OFFSETS[0]],
            y: floats[startFloat+POS_OFFSETS[1]],
            w: floats[startFloat+POS_OFFSETS[2]] - floats[startFloat+POS_OFFSETS[0]],
            h: floats[startFloat+POS_OFFSETS[5]] - floats[startFloat+POS_OFFSETS[1]],
            textureX: floats[startFloat+UV_OFFSETS[0]],
            textureY: floats[startFloat+UV_OFFSETS[1]],
            r: bytes[startByte+COLOR_COMPONENTS[0]],
            g: bytes[startByte+COLOR_COMPONENTS[1]],
            b: bytes[startByte+COLOR_COMPONENTS[2]],
            a: bytes[startByte+COLOR_COMPONENTS[3]],
        };
    }

    setAttributefloats(id: number, values: ArrayLike<number>){
        let startFloat = id * QUAD_SIZE_BYTE;
        let bytes = this._byteView;
        bytes.set(values, startFloat);
        
        this._setQuadDirty(startFloat);
    }

    getAttributefloats(id: number, values: ArrayLike<number>){
        let startFloat = id * QUAD_SIZE_BYTE;
        return new Uint8Array(this._data, startFloat, QUAD_SIZE_BYTE);
    }

    deleteQuad(id: number){
        this._clearQuad(id);
        this._freeList.push(id);
    }

    createSprite(id: number, transform?: Transform2d, options?: SpriteAttributes): Sprite{
        let sprite = new BufferedSprite(id, this, transform, options);
        this._sprites = this._sprites || [];
        this._sprites.push(sprite);
        return sprite;
    }

    private _clearQuad(id: number){
        const offset = id * QUAD_SIZE_BYTE;
        this._byteView.set(EMPTY_QUAD, offset);
        this._setQuadDirty(offset);
    }

    private _setQuadDirty(byteOffset: number){
        this._dirty_start = Math.min(byteOffset, this._dirty_start);
        this._dirty_end = Math.max(byteOffset+QUAD_SIZE_BYTE, this._dirty_end);
    }

    private _setAllDirty(){
        this._dirty_start = 0;
        this._dirty_end = this._range * QUAD_SIZE_BYTE;
    }

    private _resize(size: number){
        if(size > MAX_QUADS)
            throw `Maximum quads per buffer (${MAX_QUADS}) exceeded: ${size}`;

        this._capacity = size;
        const buffer = this.bufferInfo.attribs["position"].buffer;

        console.log(`resize buffer to ${size}`);
        const newBuffer = new ArrayBuffer(size * QUAD_SIZE_BYTE);     
        const newfloats = new Uint8Array(newBuffer);
        newfloats.set(this._byteView);
        
        this._floatView = new Float32Array(newBuffer);
        this._byteView = newfloats;
        this._data = newBuffer;

        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, this._data, this._gl.DYNAMIC_DRAW);
    }

    private _vec2Transform(x: number, y: number, m: mat4, offset = 0){
        this._floatView[offset] = m[0] * x + m[4] * y + m[12];
        this._floatView[offset+1] = m[1] * x + m[5] * y + m[13];
    }

}