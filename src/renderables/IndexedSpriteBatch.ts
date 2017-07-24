import { SpriteBatch } from "./SpriteBatch";
import { PixelTexture } from "../core";

export class IndexedSpriteBatch extends SpriteBatch {

    constructor(gl: WebGLRenderingContext, texture: PixelTexture, public palette = 0) {
        super(gl,texture)
    }
}