import { Tileset, TEXTURE_SIZE, VERTICES_QUAD } from "../core";

function createTilesetData(pxWidth: number, pxHeight: number, tWidth: number, tHeight: number): Uint8Array{
    let ctr = 0;
    const tileset = new Uint8Array(tWidth * tHeight * VERTICES_QUAD);

    for(let y = 0; y < TEXTURE_SIZE; y += pxHeight){
        for(let x = 0; x < TEXTURE_SIZE; x += pxWidth){
            tileset[ctr++] = x;
            tileset[ctr++] = y;

            tileset[ctr++] = x + tWidth;
            tileset[ctr++] = y + tHeight;
        }
    }
    return tileset;
}

export class BasicTileset implements Tileset {
    
    public readonly positionData: Uint8Array;

    private tilesWidth: number;
    private tilesHeight: number;

    constructor(
        public readonly pixelWidth: number,
        public readonly pixelHeight: number,
        public readonly texture: WebGLTexture){
        
        this.tilesWidth = Math.floor(TEXTURE_SIZE / pixelWidth);
        this.tilesHeight = Math.floor(TEXTURE_SIZE / pixelHeight);

        this.positionData = createTilesetData(pixelWidth, pixelHeight, this.tilesWidth, this.tilesHeight);
    }
}