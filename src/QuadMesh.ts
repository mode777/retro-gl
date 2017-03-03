import { Rectangle, Mesh } from './interfaces';
import { VERTICES_QUAD, VERTEX_SIZE, INDICES_QUAD, OFFSET_UV, COMP_SIZE_POS, HUGE, QUAD_SIZE } from './constants';

export class QuadMesh implements Mesh {
    private _geometry: Uint16Array;
    private _texcoord: Uint8Array;
    private _arrays: twgl.Arrays;
    private _indices: Uint16Array;
    private _data: ArrayBuffer;

    private _dirty_start = HUGE;
    private _dirty_end = 0;

    private _bufferInfo: twgl.BufferInfo;

    constructor(private _gl: WebGLRenderingContext, private _size: number){
        this._data = new ArrayBuffer(_size * VERTICES_QUAD * VERTEX_SIZE);
        this._geometry = new Uint16Array(this._data);
        this._texcoord = new Uint8Array(this._data);
        let indices = this._indices = new Uint16Array(_size * INDICES_QUAD);
        
        this._createIndices();        

        this._arrays = {
            position: this._geometry,
            texcoord: this._texcoord,
            indices: this._indices
        }
    }

    get isDirty(){
        return (this._dirty_end - this._dirty_start) > 0;
    }

    get bufferInfo(){
        return this._bufferInfo;
    }

    create(){
        var packedBuffer = twgl.createBufferFromTypedArray(
            this._gl, this._data, this._gl.ARRAY_BUFFER, this._gl.DYNAMIC_DRAW);

        var indexBuffer = twgl.createBufferFromTypedArray(
            this._gl, this._indices, this._gl.ELEMENT_ARRAY_BUFFER);

        var stride = VERTEX_SIZE;

        this._bufferInfo = {
            numElements: this._indices.length,
            indices: indexBuffer,            
            elementType: this._gl.UNSIGNED_SHORT,  
            attribs: {
                position: { 
                    buffer: packedBuffer, 
                    numComponents: 3, 
                    type: this._gl.UNSIGNED_SHORT, 
                    stride: stride, 
                    offset: 0 
                },
                texcoord: { 
                    buffer: packedBuffer, 
                    numComponents: 2, 
                    type: this._gl.UNSIGNED_BYTE, 
                    stride: stride, 
                    offset: OFFSET_UV,
                    normalize: true
                },
            },
        };

        this._dirty_start = HUGE;
        this._dirty_end = 0;

        return this;
    }

    setPosition(id: number, x1: number, y1: number, x2: number, y2: number, z: number = 0){
        let vertex = id * VERTICES_QUAD;
        this._setVertexPos(vertex, x1, y1, z);
        this._setVertexPos(vertex+1, x2, y1, z);
        this._setVertexPos(vertex+2, x2, y2, z);
        this._setVertexPos(vertex+3, x1, y2, z);        
        this._setQuadDirty(id);
    } 


    setTexture(id: number, x1: number, y1: number, x2: number, y2: number){
        //console.log(x1, y1, x2, y2);
        let vertex = id * VERTICES_QUAD;
        this._setVertexUv(vertex, x1, y1);  
        this._setVertexUv(vertex+1, x2, y1);  
        this._setVertexUv(vertex+2, x2, y2);  
        this._setVertexUv(vertex+3, x1, y2);
        this._setQuadDirty(id);  
    }


    setQuad(id: number, x1: number, y1: number, x2: number, y2: number, originX1: number, originY1: number, originX2: number, originY2: number, z = 0){
        let vertex = id * VERTICES_QUAD;

        this._setVertexUv(vertex, originX1, originY1);  
        this._setVertexUv(vertex+1, originX2, originY1);  
        this._setVertexUv(vertex+2, originX2, originY2);  
        this._setVertexUv(vertex+3, originX1, originY2);

        this._setVertexPos(vertex, x1, y1, z);
        this._setVertexPos(vertex+1, x2, y1, z);
        this._setVertexPos(vertex+2, x2, y2, z);
        this._setVertexPos(vertex+3, x1, y2, z);

        this._setQuadDirty(id);
    }   

    render(shader: twgl.ProgramInfo){
        twgl.setBuffersAndAttributes(this._gl, shader, this._bufferInfo);
        twgl.drawBufferInfo(this._gl, this._bufferInfo);
    }

    update(){
        if(this.isDirty){
            let gl = this._gl;
            let buffer = this.bufferInfo.attribs["position"].buffer;
            let data = new Uint8Array(this._data, this._dirty_start, this._dirty_end - this._dirty_start);
            //let data = this._data;
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
        this._geometry = null;
        this._texcoord = null;
        this._data = null;
    }

    protected _setQuadDirty(id: number){
        this._dirty_start = Math.min(id * QUAD_SIZE, this._dirty_start);
        this._dirty_end = Math.max(id * QUAD_SIZE + QUAD_SIZE, this._dirty_end);
    }

    protected _setVertexPos(vertex: number, x: number, y: number, z: number){
        // divide by two.
        let pos = (vertex * VERTEX_SIZE) >> 1;
        let geo = this._geometry;
        geo[pos   ] = x; 
        geo[pos+ 1] = y; 
        geo[pos+ 2] = z;
    }
    
    protected _setVertexUv(vertex: number, x: number, y: number){
        let uvs = this._texcoord;
        let pos = (vertex * VERTEX_SIZE) + OFFSET_UV; 
        uvs[pos  ] = x;
        uvs[pos+1] = y;
    }

    private _createIndices(){
        let indices = this._indices;
        let max = this._size * INDICES_QUAD;
        let vertex = 0;

        for(var i = 0; i < max; i += INDICES_QUAD){
            /*  *1---*2
                |  /  |
                *4---*3  */
            indices[i  ] = vertex;     // 1
            indices[i+1] = vertex + 1; // 2
            indices[i+2] = vertex + 3; // 4

            indices[i+3] = vertex + 3; // 4
            indices[i+4] = vertex + 1; // 2
            indices[i+5] = vertex + 2; // 3

            vertex += VERTICES_QUAD;
        }
    }
}