import { Texture } from "./Texture";

export class ImageTexture extends Texture {
    constructor(gl: WebGLRenderingContext, img: HTMLImageElement){
        super(gl);
        this.addOptions({
            src: img
        });
    }
}