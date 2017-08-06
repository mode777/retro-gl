import { SpriteBatch } from "./SpriteBatch";
import { PixelTexture, IndexedRenderable } from "../core";

export class IndexedSpriteBatch extends SpriteBatch implements IndexedRenderable {

    constructor(gl: WebGLRenderingContext, texture: WebGLTexture, public palette = 0) {
        super(gl,texture)
    }
    
}