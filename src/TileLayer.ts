const TILES_X = 32;
const TILES_Y = 32;
const TILESIZE_X = 16;
const TILESIZE_Y = 16;
const VERTICES_TILE = 6;
const COMP_POS = 3;
const COMP_UV = 2;
const UV_TILE = 0.0625;
const UV_NORM = 1;
const TILESET_X = 16;
const TILESET_Y = 16;

export class TileLayer{
    
    private _tileset: Float32Array;
    private _geometry: Float32Array;
    private _texcoord: Float32Array;
    private _arrays: twgl.Arrays;

    constructor(private _gl: WebGLRenderingContext){

    }

    create(tids?: number[]){
        this._createTileset();
        this._createGeometry();
        this._texcoord = new Float32Array(TILES_X * TILES_Y * VERTICES_TILE * COMP_UV);

        this._arrays = {
            position: this._geometry,
            texcoord: this._texcoord
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
        let tileset = new Float32Array(TILESET_X * TILESET_Y * VERTICES_TILE * COMP_UV);

        for(let y = 0; y < UV_NORM; y += UV_TILE){
            for(let x = 0; x < UV_NORM; x += UV_TILE){
                tileset[ctr++] = x;
                tileset[ctr++] = y;

                tileset[ctr++] = x + UV_TILE;
                tileset[ctr++] = y;

                tileset[ctr++] = x;
                tileset[ctr++] = y + UV_TILE;
                
                tileset[ctr++] = x;
                tileset[ctr++] = y + UV_TILE;
                
                tileset[ctr++] = x + UV_TILE;
                tileset[ctr++] = y;
                
                tileset[ctr++] = x + UV_TILE;
                tileset[ctr++] = y + UV_TILE;
            }
        }

        this._tileset = tileset;
    }

    private _createGeometry(){
        let ctr = 0;
        let geo = new Uint16Array(TILES_X * TILES_Y * VERTICES_TILE * COMP_POS);

        for(let y = 0; y < TILES_Y * TILESIZE_Y; y += TILESIZE_Y){
            for(let x = 0; x < TILES_X * TILESIZE_X; x += TILESIZE_X){
                geo[ctr++] = x; 
                geo[ctr++] = y; 
                geo[ctr++] = 0;

                geo[ctr++] = x + TILESIZE_X; 
                geo[ctr++] = y; 
                geo[ctr++] = 0;

                geo[ctr++] = x; 
                geo[ctr++] = y + TILESIZE_Y; 
                geo[ctr++] = 0;

                geo[ctr++] = x; 
                geo[ctr++] = y + TILESIZE_Y; 
                geo[ctr++] = 0;

                geo[ctr++] = x + TILESIZE_X; 
                geo[ctr++] = y; 
                geo[ctr++] = 0;

                geo[ctr++] = x + TILESIZE_X; 
                geo[ctr++] = y + TILESIZE_Y; 
                geo[ctr++] = 0
            }
        }        

        this._geometry = geo;
    }
}