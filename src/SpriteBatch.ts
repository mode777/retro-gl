import { Rectangle } from './interfaces';
const VERTICES_QUAD = 4;
const INDICES_QUAD = 6;
const COMP_POS = 3;
const COMP_SIZE_POS = 2;
const COMP_UV = 2;
const COMP_SIZE_UV = 1;
// const UV_TILE = 16;
// const UV_NORM = 256;

const OFFSET_UV = COMP_POS * COMP_SIZE_POS;
const VERTEX_SIZE = COMP_POS * COMP_SIZE_POS + COMP_UV * COMP_SIZE_UV; 

export class SpriteBatch {
    private _geometry: Uint16Array;
    private _texcoord: Uint8Array;
    private _arrays: twgl.Arrays;
    private _indices: Uint16Array;
    private _data: ArrayBuffer;

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

    get arrays(){
        return this._arrays;
    }   

    get bufferInfo(){
        return this._bufferInfo;
    }

    createBuffers(){
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

        console.log(this._bufferInfo);

        return this;
    }

    setPosition(id: number, x1: number, y1: number, x2: number, y2: number, z: number = 0){
        let vertex = id * VERTICES_QUAD;
        this.setVertexPos(vertex, x1, y1, z);
        this.setVertexPos(vertex+1, x2, y1, z);
        this.setVertexPos(vertex+2, x2, y2, z);
        this.setVertexPos(vertex+3, x1, y2, z);        
    } 

    setVertexPos(vertex: number, x: number, y: number, z: number){
        let pos = (vertex * VERTEX_SIZE) / COMP_SIZE_POS;
        let geo = this._geometry;
        geo[pos   ] = x; 
        geo[pos+ 1] = y; 
        geo[pos+ 2] = z;
    }

    setTexture(id: number, x1: number, y1: number, x2: number, y2: number){
        let vertex = id * VERTICES_QUAD;
        this.setVertexUv(vertex, x1, y1);  
        this.setVertexUv(vertex+1, x2, y1);  
        this.setVertexUv(vertex+2, x2, y2);  
        this.setVertexUv(vertex+3, x1, y2);  
    }

    setVertexUv(vertex: number, x: number, y: number){
        let uvs = this._texcoord;
        let pos = (vertex * VERTEX_SIZE) + OFFSET_UV; 
        uvs[pos  ] = x;
        uvs[pos+1] = y;
    }

    setQuad(id: number, x: number, y: number, quad: Rectangle, z = 0){
        this.setPosition(id, x, y, x+quad.width,y+quad.height, z);
        this.setTexture(id, quad.x, quad.y, quad.x+quad.width, quad.y+quad.height);
    }

    render(shader: twgl.ProgramInfo){
        twgl.setBuffersAndAttributes(this._gl, shader, this._bufferInfo);
        twgl.drawBufferInfo(this._gl, this._bufferInfo);
    }

    destroy(){
        this._gl.deleteBuffer(this._bufferInfo.attribs["position"].buffer);
        this._gl.deleteBuffer(this._bufferInfo.attribs["texcoord"].buffer);
        this._gl.deleteBuffer(this._bufferInfo.attribs["indices"].buffer);

        this._indices = null;
        this._geometry = null;
        this._texcoord = null;
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