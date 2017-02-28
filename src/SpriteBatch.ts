const VERTICES_QUAD = 4;
const INDICES_QUAD = 6;
const COMP_POS = 3;
const COMP_UV = 2;
const UV_TILE = 16;
const UV_NORM = 256;

export class SpriteBatch {
    private _geometry: Uint16Array;
    private _texcoord: Uint8Array;
    private _arrays: twgl.Arrays;
    private _indices: Uint16Array;

    constructor(private _size: number){
        this._geometry = new Uint16Array(_size * VERTICES_QUAD * COMP_POS);
        this._texcoord = new Uint8Array(_size * VERTICES_QUAD * COMP_UV);
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

    setPosition(id: number, x1: number, y1: number, x2: number, y2: number, z: number = 0){
        let geo = this._geometry;
        let offset = id * VERTICES_QUAD * COMP_POS;

        geo[offset   ] = x1; 
        geo[offset+ 1] = y1; 
        geo[offset+ 2] = z;

        geo[offset+ 3] = x2; 
        geo[offset+ 4] = y1; 
        geo[offset+ 5] = z;

        geo[offset+ 6] = x2; 
        geo[offset+ 7] = y2; 
        geo[offset+ 8] = z;

        geo[offset+ 9] = x1; 
        geo[offset+10] = y2; 
        geo[offset+11] = z;
    } 

    setTexture(id: number, x1: number, y1: number, x2: number, y2: number){
        let tileset = this._texcoord;
        let offset = id * VERTICES_QUAD * COMP_UV;

        tileset[offset  ] = x1;
        tileset[offset+1] = y1;

        tileset[offset+2] = x2;
        tileset[offset+3] = y1;

        tileset[offset+4] = x2;
        tileset[offset+5] = y2;

        tileset[offset+6] = x1;
        tileset[offset+7] = y2;  
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