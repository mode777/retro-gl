import { RenderableBase } from "../renderables";
import { PixelTexture, Tileset, Tilemap } from "../core";

export class TileBatch extends RenderableBase {
    
    constructor(
        gl: WebGLRenderingContext, 
        public readonly tileset: Tileset, 
        public readonly  width: number, 
        public readonly height: number){
        
        super(gl, tileset.texture, width * height);

        for(let i = 0; i < width * height; i++){
            this._buffer.add();
        }
    }

    setTilemap(tilemap: Tilemap, offsetX = 0, offsetY = 0){
        let quadOffset = 0;
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const mx = (x + offsetX) % tilemap.width;
                const my = (y + offsetY) % tilemap.height;
                const tid = tilemap.get(mx, my);

                if(tid === 0){
                    this._buffer.setAttributes(quadOffset,0,0,0,0,0,0,0,0,0,0);
                }
                else {
                    
                    this._buffer.setAttributes(quadOffset, )
                }
                quadOffset++;
            }            
        }
    }

}