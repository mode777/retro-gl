import { TileBuffer, Renderable, QuadBuffer, MIN_Z } from "./core/index";
import * as twgl from "twgl.js";

export function initWebGl() {
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");

    let gl = twgl.getContext(canvas, {
        premultipliedAlpha: false,
        alpha: false,
        antialias: false
    });

    //twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    return gl;
}

export function createTexture(gl: WebGLRenderingContext, path: string){
    return twgl.createTexture(gl, {
        src: path,
        min: gl.NEAREST,
        mag: gl.NEAREST
    });
}

export function createAlphaTexture(gl: WebGLRenderingContext, path: string){
    return twgl.createTexture(gl, {
        src: path,
        min: gl.NEAREST,
        mag: gl.NEAREST,
        format: gl.LUMINANCE,
        internalFormat: gl.LUMINANCE
    });
}




let offset = 5;
export function createTileSprite(gl: WebGLRenderingContext, texture,palette, paletteId){
    let tids = [];
    for(var i = 0; i<32*32; i++){
        tids.push(1);
    }
    
    offset++;
    
    let mesh = new TileBuffer(gl, 32, 32).create(tids, 1);
    
    return new Renderable({
        buffer: mesh,
        texture: texture.texture,
        palette: palette.texture,
        paletteId: paletteId,

        //mode7: true,
        zSort: false
    });
}

export function createSprite(gl: WebGLRenderingContext, texture, palette, paletteId, x,y,ox,oy,w,h){
    let sb = new QuadBuffer(gl,1);
    sb.setAttributes(0,x,y,x+w,y+h,ox,oy,ox+w,oy+w, MIN_Z, 0);
    sb.create();
    return new Renderable({
        buffer:sb, 
        texture: texture, 
        palette: palette, 
        paletteId: paletteId,
        zSort: false
    });
}