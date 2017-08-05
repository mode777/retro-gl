import { Renderable, QuadBuffer, Transform2d, BlendMode, PixelTexture } from "../core";
import { RenderableBase } from "./RenderableBase";

export class SpriteBatch extends RenderableBase {
    
    createSprite(x: number, y: number, w: number, h: number){
        return this._buffer.createSprite(
            this._buffer.add(), 
            new Transform2d(),
            {
                w: w,
                h: h,
                textureX: x,
                textureY: y,
                palOffset: 0,
                x: 0,
                y: 0,
                z: 1
            })
    }

}