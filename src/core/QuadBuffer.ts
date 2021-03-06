import { Rectangle, Buffer, MatrixTransform, SpriteAttributes, Sprite } from './interfaces';
import { VERTICES_QUAD, VERTEX_SIZE, INDICES_QUAD, OFFSET_UV, COMP_SIZE_POS, HUGE, QUAD_SIZE, MIN_Z, COMP_POS, COMP_PAL_PAL_SHIFT, COMP_Z_INDEX, OFFSET_Z_INDEX, OFFSET_PAL_SHIFT, COMP_UV, QUAD_SIZE_SHORT, VERTEX_SIZE_SHORT, MAX_QUADS } from './constants';
import { Quad } from './Quad';
import { Transform2d } from './Transform';
import * as twgl from "twgl.js";
import { mat4 } from "gl-matrix";
import { IndexBuffer } from "./IndexBuffer";
import { BufferedSprite } from "./BufferedSprite";
import { upperPowerOfTwo } from "./BinaryHelpers";

const POS_OFFSET_1X = 0;
const POS_OFFSET_1Y = POS_OFFSET_1X + 1;
const POS_OFFSET_2X = VERTEX_SIZE_SHORT;
const POS_OFFSET_2Y = POS_OFFSET_2X + 1;
const POS_OFFSET_3X = VERTEX_SIZE_SHORT * 2;
const POS_OFFSET_3Y = POS_OFFSET_3X + 1;
const POS_OFFSET_4X = VERTEX_SIZE_SHORT * 3;
const POS_OFFSET_4Y = POS_OFFSET_4X + 1;

const Z_OFFSET_1 = OFFSET_Z_INDEX;
const Z_OFFSET_2 = VERTEX_SIZE + OFFSET_Z_INDEX;
const Z_OFFSET_3 = VERTEX_SIZE * 2 + OFFSET_Z_INDEX;
const Z_OFFSET_4 = VERTEX_SIZE * 3 + OFFSET_Z_INDEX;

const PAL_OFFSET_1 = OFFSET_PAL_SHIFT;
const PAL_OFFSET_2 = VERTEX_SIZE + OFFSET_PAL_SHIFT;
const PAL_OFFSET_3 = VERTEX_SIZE * 2 + OFFSET_PAL_SHIFT;
const PAL_OFFSET_4 = VERTEX_SIZE * 3 + OFFSET_PAL_SHIFT;

const UV_OFFSET_1X = OFFSET_UV;
const UV_OFFSET_1Y = UV_OFFSET_1X + 1;
const UV_OFFSET_2X = VERTEX_SIZE + OFFSET_UV;
const UV_OFFSET_2Y = UV_OFFSET_2X + 1;
const UV_OFFSET_3X = VERTEX_SIZE * 2 + OFFSET_UV;
const UV_OFFSET_3Y = UV_OFFSET_3X + 1;
const UV_OFFSET_4X = VERTEX_SIZE * 3 + OFFSET_UV;
const UV_OFFSET_4Y = UV_OFFSET_4X + 1;

const EMPTY_QUAD = new Uint8Array(QUAD_SIZE);

export class QuadBuffer implements Buffer {
    private _shortView: Uint16Array;
    private _byteView: Uint8Array;
    /*private*/ _indices: Uint16Array;
    /*private*/_data: ArrayBuffer;

    private _dirty_start = HUGE;
    private _dirty_end = 0;
    private _range: number;
    private _sprites: BufferedSprite[];
    private _freeList: number[] = [];

    private _bufferInfo: twgl.BufferInfo;

    constructor(private _gl: WebGLRenderingContext, private _capacity = 16){
        this._data = new ArrayBuffer(_capacity * VERTICES_QUAD * VERTEX_SIZE);
        this._shortView = new Int16Array(this._data);
        this._byteView = new Uint8Array(this._data);
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
        this._gl.deleteBuffer(this._bufferInfo.attribs["texcoord"].buffer);
        this._gl.deleteBuffer(this._bufferInfo.attribs["indices"].buffer);

        this._indices = null;
        this._shortView = null;
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
                    numComponents: COMP_POS, 
                    type: this._gl.SHORT, 
                    stride: VERTEX_SIZE, 
                    offset: 0 
                },
                z_index: { 
                    buffer: packedBuffer, 
                    numComponents: COMP_Z_INDEX, 
                    type: this._gl.UNSIGNED_BYTE, 
                    stride: VERTEX_SIZE, 
                    offset: OFFSET_Z_INDEX,
                    normalize: false
                },
                pal_shift: { 
                    buffer: packedBuffer, 
                    numComponents: COMP_PAL_PAL_SHIFT, 
                    type: this._gl.UNSIGNED_BYTE, 
                    stride: VERTEX_SIZE, 
                    offset: OFFSET_PAL_SHIFT,
                    normalize: true
                },
                texcoord: { 
                    buffer: packedBuffer, 
                    numComponents: COMP_UV, 
                    type: this._gl.UNSIGNED_BYTE, 
                    stride: VERTEX_SIZE, 
                    offset: OFFSET_UV,
                    normalize: false
                },
            },
        };

        this._range = 0;

        this._dirty_start = HUGE;
        this._dirty_end = 0;

        return this;
    }
    
    setPosition(id: number, x1: number, y1: number, x2: number, y2: number){
        let start = id * QUAD_SIZE_SHORT;
        let pos = this._shortView;

        pos[start+POS_OFFSET_1X] = x1;
        pos[start+POS_OFFSET_1Y] = y1;
        pos[start+POS_OFFSET_2X] = x2;
        pos[start+POS_OFFSET_2Y] = y1;
        pos[start+POS_OFFSET_3X] = x2;
        pos[start+POS_OFFSET_3Y] = y2;
        pos[start+POS_OFFSET_4X] = x1;
        pos[start+POS_OFFSET_4Y] = y2;

        this._setQuadDirty(start);
    }

    setPositionTransformed(id: number, x1: number, y1: number, x2: number, y2: number, m: mat4){
        let start = id * QUAD_SIZE_SHORT;
        let pos = this._shortView;

        pos[start+POS_OFFSET_1X] = m[0] * x1 + m[4] * y1 + m[12];
        pos[start+POS_OFFSET_1Y] = m[1] * x1 + m[5] * y1 + m[13];
        pos[start+POS_OFFSET_2X] = m[0] * x2 + m[4] * y1 + m[12];
        pos[start+POS_OFFSET_2Y] = m[1] * x2 + m[5] * y1 + m[13];
        pos[start+POS_OFFSET_3X] = m[0] * x2 + m[4] * y2 + m[12];
        pos[start+POS_OFFSET_3Y] = m[1] * x2 + m[5] * y2 + m[13];
        pos[start+POS_OFFSET_4X] = m[0] * x1 + m[4] * y2 + m[12];
        pos[start+POS_OFFSET_4Y] = m[1] * x1 + m[5] * y2 + m[13];
    }

    setUv(id: number, x1: number, y1: number, x2: number, y2: number){
        let start = id * QUAD_SIZE;
        let bytes = this._byteView;

        bytes[start+UV_OFFSET_1X] = x1;
        bytes[start+UV_OFFSET_1Y] = y1;
        bytes[start+UV_OFFSET_2X] = x2 - 1;
        bytes[start+UV_OFFSET_2Y] = y1;
        bytes[start+UV_OFFSET_3X] = x2 - 1;
        bytes[start+UV_OFFSET_3Y] = y2 - 1;
        bytes[start+UV_OFFSET_4X] = x1;
        bytes[start+UV_OFFSET_4Y] = y2 - 1;

        this._setQuadDirty(start);
    }

    setPalShift(id: number, pal: number){
        let start = id * QUAD_SIZE;
        let bytes = this._byteView;

        bytes[start+PAL_OFFSET_1] = pal;
        bytes[start+PAL_OFFSET_2] = pal;
        bytes[start+PAL_OFFSET_3] = pal;
        bytes[start+PAL_OFFSET_4] = pal;
        
        this._setQuadDirty(start);
    }

    getPalShift(id: number){
        return this._byteView[id * QUAD_SIZE + PAL_OFFSET_1];
    }

    setZ(id: number, z: number){
        let start = id * QUAD_SIZE;
        let bytes = this._byteView;

        bytes[start+Z_OFFSET_1] = z;
        bytes[start+Z_OFFSET_2] = z;
        bytes[start+Z_OFFSET_3] = z;
        bytes[start+Z_OFFSET_4] = z;
        
        this._setQuadDirty(start);
    }

    getZ(id: number){
        return this._byteView[id * QUAD_SIZE + Z_OFFSET_1];
    }      

    setAttributes(id: number, x1: number, y1: number, x2: number, y2: number, uvx1: number, uvy1: number, uvx2: number, uvy2: number, z: number, pal: number){
        let startShort = id * QUAD_SIZE_SHORT;
        let startByte = id * QUAD_SIZE;
        
        let shorts = this._shortView;
        let bytes = this._byteView;
        
        shorts[startShort+POS_OFFSET_1X] = x1;
        shorts[startShort+POS_OFFSET_1Y] = y1;
        bytes[startByte+Z_OFFSET_1] = z;
        bytes[startByte+PAL_OFFSET_1] = pal;
        bytes[startByte+UV_OFFSET_1X] = uvx1;
        bytes[startByte+UV_OFFSET_1Y] = uvy1;
        
        shorts[startShort+POS_OFFSET_2X] = x2;
        shorts[startShort+POS_OFFSET_2Y] = y1;
        bytes[startByte+Z_OFFSET_2] = z;
        bytes[startByte+PAL_OFFSET_2] = pal;
        bytes[startByte+UV_OFFSET_2X] = uvx2 - 1;
        bytes[startByte+UV_OFFSET_2Y] = uvy1;
        
        shorts[startShort+POS_OFFSET_3X] = x2;
        shorts[startShort+POS_OFFSET_3Y] = y2;
        bytes[startByte+Z_OFFSET_3] = z;
        bytes[startByte+PAL_OFFSET_3] = pal;
        bytes[startByte+UV_OFFSET_3X] = uvx2 - 1;
        bytes[startByte+UV_OFFSET_3Y] = uvy2 - 1;
        
        shorts[startShort+POS_OFFSET_4X] = x1;
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
        let startByte = id * QUAD_SIZE;
        
        let shorts = this._shortView;
        let bytes = this._byteView;

        return {
            x: shorts[startShort+POS_OFFSET_1X],
            y: shorts[startShort+POS_OFFSET_1Y],
            w: shorts[startShort+POS_OFFSET_3X] - shorts[startShort+POS_OFFSET_1X],
            h: shorts[startShort+POS_OFFSET_3Y] - shorts[startShort+POS_OFFSET_1Y],
            z: bytes[startByte+Z_OFFSET_1],
            palOffset: bytes[startByte+PAL_OFFSET_1],
            textureX: bytes[startByte+UV_OFFSET_1X],
            textureY: bytes[startByte+UV_OFFSET_1Y]
        };
    }

    setAttributeBytes(id: number, values: ArrayLike<number>){
        let startByte = id * QUAD_SIZE;
        let bytes = this._byteView;
        bytes.set(values, startByte);
        
        this._setQuadDirty(startByte);
    }

    getAttributeBytes(id: number, values: ArrayLike<number>){
        let startByte = id * QUAD_SIZE;
        return new Uint8Array(this._data, startByte, QUAD_SIZE);
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
        const offset = id * QUAD_SIZE;
        this._byteView.set(EMPTY_QUAD, offset);
        this._setQuadDirty(offset);
    }

    private _setQuadDirty(byteOffset: number){
        this._dirty_start = Math.min(byteOffset, this._dirty_start);
        this._dirty_end = Math.max(byteOffset+QUAD_SIZE, this._dirty_end);
    }

    private _setAllDirty(){
        this._dirty_start = 0;
        this._dirty_end = this._range * QUAD_SIZE;
    }

    private _resize(size: number){
        if(size > MAX_QUADS)
            throw `Maximum quads per buffer (${MAX_QUADS}) exceeded: ${size}`;

        this._capacity = size;
        const buffer = this.bufferInfo.attribs["position"].buffer;

        console.log(`resize buffer to ${size}`);
        const newBuffer = new ArrayBuffer(size * QUAD_SIZE);     
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