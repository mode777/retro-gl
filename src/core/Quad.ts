import { MIN_Z, VERTEX_SIZE, VERTICES_QUAD, OFFSET_Z_INDEX, OFFSET_UV } from './constants';
import { Transform2d } from './Transform';
import { MatrixTransform } from './interfaces';

export class Quad{

    private _pos1 = new Uint16Array(this._data, this._offset, 2);
    private _pos2 = new Uint16Array(this._data, this._offset + VERTEX_SIZE, 2);
    private _pos3 = new Uint16Array(this._data, this._offset + VERTEX_SIZE*2, 2);
    private _pos4 = new Uint16Array(this._data, this._offset + VERTEX_SIZE*3, 2);

    private _z_shift1 = new Uint8Array(this._data, this._offset + OFFSET_Z_INDEX, 2);
    private _z_shift2 = new Uint8Array(this._data, this._offset + VERTEX_SIZE + OFFSET_Z_INDEX, 2);
    private _z_shift3 = new Uint8Array(this._data, this._offset + VERTEX_SIZE*2 + OFFSET_Z_INDEX, 2);
    private _z_shift4 = new Uint8Array(this._data, this._offset + VERTEX_SIZE*3 + OFFSET_Z_INDEX, 2);

    private _uv1 = new Uint8Array(this._data, this._offset + OFFSET_UV, 2);
    private _uv2 = new Uint8Array(this._data, this._offset + VERTEX_SIZE + OFFSET_UV, 2);
    private _uv3 = new Uint8Array(this._data, this._offset + VERTEX_SIZE*2 + OFFSET_UV, 2);
    private _uv4 = new Uint8Array(this._data, this._offset + VERTEX_SIZE*3 + OFFSET_UV, 2);
    
    constructor(private _data = new ArrayBuffer(VERTEX_SIZE * VERTICES_QUAD), private _offset = 0){
    }
    
    applyTransform(matrix: mat4, out_quad = this){
        vec2.transformMat4(<vec2>out_quad._pos1, <vec2>this._pos1, matrix);
        //this._transVec2(matrix, <vec2>this._pos1, <vec2>out_quad._pos1);
        //this._transVec2(matrix, <vec2>this._pos2, <vec2>out_quad._pos2);
        //this._transVec2(matrix, <vec2>this._pos3, <vec2>out_quad._pos3);
        //this._transVec2(matrix, <vec2>this._pos4, <vec2>out_quad._pos4);
        return out_quad;
    }

    setPos(x: number, y: number, w:number, h: number){
        this._pos1[0] = x;
        this._pos1[1] = y;
        this._pos2[0] = x + w;
        this._pos2[1] = y;
        this._pos3[0] = x+w;
        this._pos3[1] = y+h;
        this._pos4[0] = x;
        this._pos4[1] = y+h;
    }

    setUv(x: number, y: number, w:number, h: number){
        this._uv1[0] = x;
        this._uv1[1] = y;
        this._uv2[0] = x+w;
        this._uv2[1] = y;
        this._uv3[0] = x+w;
        this._uv3[1] = y+h;
        this._uv4[0] = x;
        this._uv4[1] = y+h;
    }

    setZ(z: number){
        this._z_shift1[0] = z;
        this._z_shift2[0] = z;
        this._z_shift3[0] = z;
        this._z_shift4[0] = z;
    }

    setPalShift(s: number){
        this._z_shift1[1] = s;
        this._z_shift2[1] = s;
        this._z_shift3[1] = s;
        this._z_shift4[1] = s;
    }

    setAttributes(x: number, y: number, w: number, h: number, z: number, pal: number, ux: number, uy: number, uw: number, uh: number){
        this.setPos(x,y,w,h);
        this.setZ(z);
        this.setPalShift(pal);
        this.setUv(ux,uy,uw,uh);
    }


    // private _transVec2(matrix: mat4, in_vec: vec2, out_vec: vec2){
    // }
}