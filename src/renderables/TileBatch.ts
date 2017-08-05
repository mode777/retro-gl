import { RenderableBase } from "./RenderableBase";
import { PixelTexture } from "../core";

export class TileBatch extends RenderableBase {
    
    constructor(_gl: WebGLRenderingContext, texture: PixelTexture, public readonly  width: number, public readonly height: number){
        super(_gl, texture, width * height);
    }

    

}