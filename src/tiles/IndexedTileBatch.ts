import { TileBatch } from "./TileBatch";
import { IndexedRenderable, Tileset } from "../core";

export class IndexedTileBatch extends TileBatch implements IndexedRenderable {
   constructor(
        gl: WebGLRenderingContext, 
        tileset: Tileset, 
        width: number, 
        height: number,
        public readonly palette: number){
    
        super(gl, tileset, width, height);       
    }
}