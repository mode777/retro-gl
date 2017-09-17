import { Rectangle, Buffer, MatrixTransform, SpriteAttributes, Sprite } from './interfaces';
import { VERTICES_QUAD, VERTEX_SIZE_BYTE, INDICES_QUAD, UV_OFFSET_BYTE, POS_BYTES, HUGE, QUAD_SIZE_BYTE, MIN_Z, POS_COMPONENTS, COMP_PAL_PAL_SHIFT, COMP_Z_INDEX, OFFSET_Z_INDEX, OFFSET_PAL_SHIFT, UV_COMPONENTS, QUAD_SIZE_SHORT, VERTEX_SIZE_SHORT, MAX_QUADS, QUADBUFFER_INITIAL_CAPACITY, VERTEX_SIZE_FLOAT, POS_OFFSET_BYTE, POS_OFFSET_FLOAT, UV_OFFSET_SHORT, COLOR_COMPONENTS, UV_OFFSET_FLOAT, COLOR_OFFSET_BYTE, QUAD_SIZE_FLOAT } from './constants';
import { Quad } from './Quad';
import { Transform2d } from './Transform';
import * as twgl from "twgl.js";
import { mat4 } from "gl-matrix";
import { IndexBuffer } from "./IndexBuffer";
import { BufferedSprite } from "./BufferedSprite";
import { upperPowerOfTwo } from "./BinaryHelpers";

const POS_OFFSETS = [];
for (var i = POS_OFFSET_FLOAT; i < VERTICES_QUAD; i = VERTEX_SIZE_FLOAT) {
    for (var j = 0; j < POS_COMPONENTS; j++) {
        POS_OFFSETS.push(PO)        
    }    
}



const UV_OFFSET_1X = UV_OFFSET_FLOAT;
const UV_OFFSET_1Y = UV_OFFSET_1X + 1;
const UV_OFFSET_2X = VERTEX_SIZE_FLOAT * 1 + UV_OFFSET_FLOAT;
const UV_OFFSET_2Y = UV_OFFSET_2X + 1;
const UV_OFFSET_3X = VERTEX_SIZE_FLOAT * 2 + UV_OFFSET_FLOAT;
const UV_OFFSET_3Y = UV_OFFSET_3X + 1;
const UV_OFFSET_4X = VERTEX_SIZE_FLOAT * 3 + UV_OFFSET_FLOAT;
const UV_OFFSET_4Y = UV_OFFSET_4X + 1;

const COLOR_OFFSET_1R = COLOR_OFFSET_BYTE;
const COLOR_OFFSET_1G = COLOR_OFFSET_1R + 1;
const COLOR_OFFSET_1B = COLOR_OFFSET_1R + 2;
const COLOR_OFFSET_1A = COLOR_OFFSET_1R + 3;
const COLOR_OFFSET_2R = VERTEX_SIZE_BYTE * 1 + COLOR_OFFSET_BYTE;
const COLOR_OFFSET_2G = COLOR_OFFSET_2R + 1;
const COLOR_OFFSET_2B = COLOR_OFFSET_2R + 2;
const COLOR_OFFSET_2A = COLOR_OFFSET_2R + 3;
const COLOR_OFFSET_3R = VERTEX_SIZE_BYTE * 2 + COLOR_OFFSET_BYTE;
const COLOR_OFFSET_3G = COLOR_OFFSET_3R + 1;
const COLOR_OFFSET_3B = COLOR_OFFSET_3R + 2;
const COLOR_OFFSET_3A = COLOR_OFFSET_3R + 3;
const COLOR_OFFSET_4R = VERTEX_SIZE_BYTE * 3 + COLOR_OFFSET_BYTE;
const COLOR_OFFSET_4G = COLOR_OFFSET_4R + 1;
const COLOR_OFFSET_4B = COLOR_OFFSET_4R + 2;
const COLOR_OFFSET_4A = COLOR_OFFSET_4R + 3;

const EMPTY_QUAD = new Uint8Array(QUAD_SIZE_BYTE);


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
        pos[start+POS_OFFSET_1Y] = y1;
        pos[start+POS_OFFSETS[0]] = x2;
        pos[start+POS_OFFSET_2Y] = y1;
        pos[start+POS_OFFSETS[0]] = x2;
        pos[start+POS_OFFSET_3Y] = y2;
        pos[start+POS_OFFSETS[0]] = x1;
        pos[start+POS_OFFSET_4Y] = y2;

        this._setQuadDirty(start);
    }

    setPositionTransformed(id: number, x1: number, y1: number, x2: number, y2: number, m: mat4){
        let start = id * QUAD_SIZE_FLOAT;
        let pos = this._floatView;

        pos[start+POS_OFFSETS[0]] = m[0] * x1 + m[4] * y1 + m[12];
        pos[start+POS_OFFSET_1Y] = m[1] * x1 + m[5] * y1 + m[13];
        pos[start+POS_OFFSETS[0]] = m[0] * x2 + m[4] * y1 + m[12];
        pos[start+POS_OFFSET_2Y] = m[1] * x2 + m[5] * y1 + m[13];
        pos[start+POS_OFFSETS[0]] = m[0] * x2 + m[4] * y2 + m[12];
        pos[start+POS_OFFSET_3Y] = m[1] * x2 + m[5] * y2 + m[13];
        pos[start+POS_OFFSETS[0]] = m[0] * x1 + m[4] * y2 + m[12];
        pos[start+POS_OFFSET_4Y] = m[1] * x1 + m[5] * y2 + m[13];
    }

    setUv(id: number, x1: number, y1: number, x2: number, y2: number){
        let start = id * QUAD_SIZE_FLOAT;
        let uv = this._floatView;

        uv[start+UV_OFFSET_1X] = x1;
        uv[start+UV_OFFSET_1Y] = y1;
        uv[start+UV_OFFSET_2X] = x2 - 1;
        uv[start+UV_OFFSET_2Y] = y1;
        uv[start+UV_OFFSET_3X] = x2 - 1;
        uv[start+UV_OFFSET_3Y] = y2 - 1;
        uv[start+UV_OFFSET_4X] = x1;
        uv[start+UV_OFFSET_4Y] = y2 - 1;

        this._setQuadDirty(start);
    }

    setColor(id: number, r: number, g: number, b: number, a: number){
        let start = id * QUAD_SIZE_BYTE;
        let bytes = this._byteView;

        bytes[start+COLOR_OFFSET_1R] = r;
        bytes[start+COLOR_OFFSET_1G] = g;
        bytes[start+COLOR_OFFSET_1B] = b;
        bytes[start+COLOR_OFFSET_1A] = a;

        bytes[start+COLOR_OFFSET_2R] = r;
        bytes[start+COLOR_OFFSET_2G] = g;
        bytes[start+COLOR_OFFSET_2B] = b;
        bytes[start+COLOR_OFFSET_2A] = a;
        
        bytes[start+COLOR_OFFSET_3R] = r;
        bytes[start+COLOR_OFFSET_3G] = g;
        bytes[start+COLOR_OFFSET_3B] = b;
        bytes[start+COLOR_OFFSET_3A] = a;
        
        bytes[start+COLOR_OFFSET_4R] = r;
        bytes[start+COLOR_OFFSET_4G] = g;
        bytes[start+COLOR_OFFSET_4B] = b;
        bytes[start+COLOR_OFFSET_4A] = a;
        
        this._setQuadDirty(start);
    }

    getPalShift(id: number){
        return this._byteView[id * QUAD_SIZE_BYTE + PAL_OFFSET_1];
    }

    setZ(id: number, z: number){
        let start = id * QUAD_SIZE_BYTE;
        let bytes = this._byteView;

        bytes[start+Z_OFFSET_1] = z;
        bytes[start+Z_OFFSET_2] = z;
        bytes[start+Z_OFFSET_3] = z;
        bytes[start+Z_OFFSET_4] = z;
        
        this._setQuadDirty(start);
    }

    getZ(id: number){
        return this._byteView[id * QUAD_SIZE_BYTE + Z_OFFSET_1];
    }      

    setAttributes(id: number, x1: number, y1: number, x2: number, y2: number, uvx1: number, uvy1: number, uvx2: number, uvy2: number, z: number, pal: number){
        let startShort = id * QUAD_SIZE_SHORT;
        let startByte = id * QUAD_SIZE_BYTE;
        
        let shorts = this._shortView;
        let bytes = this._byteView;
        
        shorts[startShort+POS_OFFSETS[0]] = x1;
        shorts[startShort+POS_OFFSET_1Y] = y1;
        bytes[startByte+Z_OFFSET_1] = z;
        bytes[startByte+PAL_OFFSET_1] = pal;
        bytes[startByte+UV_OFFSET_1X] = uvx1;
        bytes[startByte+UV_OFFSET_1Y] = uvy1;
        
        shorts[startShort+POS_OFFSETS[0]] = x2;
        shorts[startShort+POS_OFFSET_2Y] = y1;
        bytes[startByte+Z_OFFSET_2] = z;
        bytes[startByte+PAL_OFFSET_2] = pal;
        bytes[startByte+UV_OFFSET_2X] = uvx2 - 1;
        bytes[startByte+UV_OFFSET_2Y] = uvy1;
        
        shorts[startShort+POS_OFFSETS[0]] = x2;
        shorts[startShort+POS_OFFSET_3Y] = y2;
        bytes[startByte+Z_OFFSET_3] = z;
        bytes[startByte+PAL_OFFSET_3] = pal;
        bytes[startByte+UV_OFFSET_3X] = uvx2 - 1;
        bytes[startByte+UV_OFFSET_3Y] = uvy2 - 1;
        
        shorts[startShort+POS_OFFSETS[0]] = x1;
        shorts[startShort+POS_OFFSET_4Y] = y2;
        bytes[startByte+Z_OFFSET_4] = z;
        bytes[startByte+PAL_OFFSET_4] = pal;
        bytes[startByte+UV_OFFSET_4X] = uvx1 ;
        bytes[startByte+UV_OFFSET_4Y] = uvy2 - 1;

        this._setQuadDirty(startByte);
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
        let startShort = id * QUAD_SIZE_SHORT;
        let startByte = id * QUAD_SIZE_BYTE;
        
        let shorts = this._shortView;
        let bytes = this._byteView;

        return {
            x: shorts[startShort+POS_OFFSETS[0]],
            y: shorts[startShort+POS_OFFSET_1Y],
            w: shorts[startShort+POS_OFFSETS[0]] - shorts[startShort+POS_OFFSETS[0]],
            h: shorts[startShort+POS_OFFSET_3Y] - shorts[startShort+POS_OFFSET_1Y],
            z: bytes[startByte+Z_OFFSET_1],
            palOffset: bytes[startByte+PAL_OFFSET_1],
            textureX: bytes[startByte+UV_OFFSET_1X],
            textureY: bytes[startByte+UV_OFFSET_1Y]
        };
    }

    setAttributeBytes(id: number, values: ArrayLike<number>){
        let startByte = id * QUAD_SIZE_BYTE;
        let bytes = this._byteView;
        bytes.set(values, startByte);
        
        this._setQuadDirty(startByte);
    }

    getAttributeBytes(id: number, values: ArrayLike<number>){
        let startByte = id * QUAD_SIZE_BYTE;
        return new Uint8Array(this._data, startByte, QUAD_SIZE_BYTE);
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
        const newBytes = new Uint8Array(newBuffer);
        newBytes.set(this._byteView);
        
        this._shortView = new Uint16Array(newBuffer);
        this._byteView = newBytes;
        this._data = newBuffer;

        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, this._data, this._gl.DYNAMIC_DRAW);
    }

    private _vec2Transform(x: number, y: number, m: mat4, offset = 0){
        this._shortView[offset] = m[0] * x + m[4] * y + m[12];
        this._shortView[offset+1] = m[1] * x + m[5] * y + m[13];
    }

}