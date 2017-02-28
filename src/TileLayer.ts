const TILES_X = 32;
const TILES_Y = 32;
const TILESIZE_X = 16;
const TILESIZE_Y = 16;
const VERTICES_TILE = 4;
const INDICES_TILE = 6;
const COMP_POS = 3;
const COMP_UV = 2;
const UV_TILE = 16;
const UV_NORM = 256;
const TILESET_X = 16;
const TILESET_Y = 16;

export class TileLayer{
    
    private _tileset: Uint8Array;
    private _geometry: Uint16Array;
    private _texcoord: Uint8Array;
    private _arrays: twgl.Arrays;
    private _indices: Uint16Array;

    constructor(private _gl: WebGLRenderingContext){

    }

    create(tids?: number[]){
        this._createTileset();
        this._createGeometry();
        this._texcoord = new Uint8Array(TILES_X * TILES_Y * VERTICES_TILE * COMP_UV);

        this._arrays = {
            position: this._geometry,
            texcoord: this._texcoord,
            indices: this._indices
        }
        
        if(tids)
            this.setTiles(tids);

        return this;
    }

    setTiles(tids: number[]){
        for(let i = 0; i < tids.length; i ++){
            this._setTileUvs(tids[i], i * VERTICES_TILE * COMP_UV);            
        }

        return this;
    }

    setTile(tid: number, x: number, y: number){
        let no = y * TILES_X + x;
        this._setTileUvs(tid, no * VERTICES_TILE * COMP_UV);

        return this;
    }

    setTileSeq(tid: number, seq: number){
        this._setTileUvs(tid, seq * VERTICES_TILE * COMP_UV);
        return this;
    }

    get arrays(){
        return this._arrays;
    }    

    private _setTileUvs(tid: number, offset: number){
        let stride = VERTICES_TILE * COMP_UV;
        let tileComp = tid * stride;

        for(let i = tileComp; i < tileComp + stride; i++){
            this._texcoord[offset++] = this._tileset[i];
        }        
    }

    private _createTileset(){
        let ctr = 0;
        let tileset = new Uint8Array(TILESET_X * TILESET_Y * VERTICES_TILE * COMP_UV);

        for(let y = 0; y < UV_NORM; y += UV_TILE){
            for(let x = 0; x < UV_NORM; x += UV_TILE){
                tileset[ctr++] = x;
                tileset[ctr++] = y;

                tileset[ctr++] = x + UV_TILE;
                tileset[ctr++] = y;

                tileset[ctr++] = x + UV_TILE;
                tileset[ctr++] = y + UV_TILE;

                tileset[ctr++] = x;
                tileset[ctr++] = y + UV_TILE;                
            }
        }

        this._tileset = tileset;
    }

    private _createGeometry(){
        let ctr = 0;
        let idxCtr = 0;
        let vertex = 0;
        let geo = new Uint16Array(TILES_X * TILES_Y * VERTICES_TILE * COMP_POS);
        let idx = new Uint16Array(TILES_X * TILES_Y * INDICES_TILE);

        for(let y = 0; y < TILES_Y * TILESIZE_Y; y += TILESIZE_Y){
            for(let x = 0; x < TILES_X * TILESIZE_X; x += TILESIZE_X){
                geo[ctr++] = x; 
                geo[ctr++] = y; 
                geo[ctr++] = 0;

                geo[ctr++] = x + TILESIZE_X; 
                geo[ctr++] = y; 
                geo[ctr++] = 0;

                geo[ctr++] = x + TILESIZE_X; 
                geo[ctr++] = y + TILESIZE_Y; 
                geo[ctr++] = 0;

                geo[ctr++] = x; 
                geo[ctr++] = y + TILESIZE_Y; 
                geo[ctr++] = 0;

                /*
                *1---*2
                |  /  |
                *4---*3
                 */

                idx[idxCtr++] = vertex;     // 1
                idx[idxCtr++] = vertex + 1; // 2
                idx[idxCtr++] = vertex + 3; // 4

                idx[idxCtr++] = vertex + 3; // 4
                idx[idxCtr++] = vertex + 1; // 2
                idx[idxCtr++] = vertex + 2; // 3

                vertex += 4;
            }
        }


        this._indices = idx;
        this._geometry = geo;
    }

    protected _setGeometry(id: number, x1: number, y1: number, x2: number, y2: number){
        
    }        
}