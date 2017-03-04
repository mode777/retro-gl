import { TEXTURE_SIZE, UV_TILE, VERTICES_QUAD, COMP_UV } from './constants';
import { QuadMesh } from './QuadMesh';
import { Mesh } from './interfaces';

export class TileMesh extends QuadMesh {

    private _tileset: Uint8Array;

    constructor(    
        gl: WebGLRenderingContext,
        private _width: number, 
        private _height: number, 
        private _twidth: number = 16, 
        private _theight: number = 16){
        
        super(gl, _width * _height);
    }

    create(tids?: number[]){
        this._createTileset();
        
        //this._createGeometry();
        
        if(tids)
            this.setTiles(tids);
        
        super.create();

        return this;
    }

    setTile(tid: number, x: number, y: number, z = 0){
        let seq = y * this._width + x;
        this.setTileSeq(seq, tid);

        return this;
    }

    setTiles(tids: number[]){
        for(let i = 0; i < tids.length; i ++){
            this.setTileSeq(i, tids[i]);            
        }

        return this;
    }

    setTileSeq(seq: number, tid: number, z = 0){
        if(tid == 0){
            this.setQuad(seq, 0,0,0,0,0,0,0,0);
            return;
        }

        let ts = this._tileset;
        let offset = tid * (VERTICES_QUAD);

        let x1 = (seq % this._width) * this._twidth;
        let y1 = Math.floor(seq / this._width) * this._theight;
        let x2 = x1 + this._twidth;
        let y2 = y1 + this._theight;
        
        this.setQuad(seq, x1, y1, x2, y2, ts[offset], ts[offset+1], ts[offset+2], ts[offset+3]);
    }

    private _createTileset(){
        let ctr = 0;
        let tileset = new Uint8Array((TEXTURE_SIZE / this._twidth) * (TEXTURE_SIZE / this._theight) * VERTICES_QUAD);

        for(let y = 0; y < TEXTURE_SIZE; y += this._twidth){
            for(let x = 0; x < TEXTURE_SIZE; x += this._theight){
                tileset[ctr++] = x;
                tileset[ctr++] = y;

                tileset[ctr++] = x + this._twidth;
                tileset[ctr++] = y + this._theight;
            }
        }

        this._tileset = tileset;
    }

    private _createGeometry(){
        let ctr = 0;
        let idxCtr = 0;
        let vertex = 0;

        for(let y = 0; y < this._theight * this._height; y += this._theight){
            for(let x = 0; x < this._twidth * this._width; x += this._twidth){
                this.setPosition(ctr, x, y, x + this._twidth, y + this._theight);
                ctr++;
            }
        }
    }
}