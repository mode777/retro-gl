import { RenderableBase } from "../renderables";
import { PixelTexture, Tileset, Tilemap, VERTICES_QUAD, QuadBuffer } from "../core";

function createTiles(buffer: QuadBuffer, tileset: Tileset, width: number, height: number) {
    console.log(width, height);

    const tWidth = tileset.pixelWidth;
    const tHeight = tileset.pixelHeight;
    const totalWidth = width * tWidth;
    const totalHeight = height * tHeight;

    let ctr = 0;

    for(let y = 0; y < totalHeight; y += tHeight){
        for(let x = 0; x < totalWidth; x += tWidth){
            const id = buffer.add();            
            buffer.setPosition(id, x, y, x+tWidth, y+tHeight);
        }
    }

}

export class TileBatch extends RenderableBase {
    
    constructor(
        gl: WebGLRenderingContext, 
        public readonly tileset: Tileset, 
        public readonly  width: number, 
        public readonly height: number){
        
        super(gl, tileset.texture, width * height);

        createTiles(this._buffer, tileset, width, height);
    }

    setTilemap(tilemap: Tilemap, offsetX = 0, offsetY = 0){
        const data = this.tileset.positionData;
        
        let quadOffset = 0;
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const mx = (x + offsetX) % tilemap.width;
                const my = (y + offsetY) % tilemap.height;
                const tid = tilemap.get(mx, my);

                if(tid === 0){
                    this._buffer.setUv(quadOffset,0,0,0,0);
                }
                else {            
                    const tOffset = (tid-1) * VERTICES_QUAD;
                    this._buffer.setUv(
                        quadOffset,
                        data[tOffset], 
                        data[tOffset+1], 
                        data[tOffset+2], 
                        data[tOffset+3]);
                }
                quadOffset++;
            }            
        }
    }

}