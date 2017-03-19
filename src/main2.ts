import * as binaryPlugin from "./lib/JQueryBinaryTransport";
import { PngReader } from './PngReader/PngReader';
import { initWebGl, createTexture } from './helpers';
import { Renderer } from "./core/index";
import { QuadBuffer } from './core/QuadBuffer';
import { Renderable } from './core/Renderable';
import { PaletteTexture } from './core/PaletteTexture';
import { ColorComponent } from './core/PixelTexture';
import { IndexedTexture } from './core/IndexedTexture';

binaryPlugin.register();


(async function main(){
    let gl = initWebGl();

    let vs = await $.get("/res/shaders/8bit_vs.glsl");
    let fs = await $.get("/res/shaders/8bit_fs.glsl");
    let fs24 = await $.get("/res/shaders/24bit_fs.glsl");
    let programInfo = twgl.createProgramInfo(gl, [vs, fs]);    
    let renderer = new Renderer(gl, {
        shader: programInfo,
        palette: null,
        texture: null,
        paletteId: 0,
        zSort: true,
        blendMode: "none"
    });
    function render(){
        renderer.render()
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    
    let buffer: ArrayBuffer = await $.ajax(<any>{
        url: "res/textures/8bit_test.png",
        type: "GET",
        dataType: "binary",
        responseType: "arraybuffer",
        processData: false
    });

    let png = new PngReader(buffer);

    let palTex = new PaletteTexture(gl);
    palTex.setPngPalette(0, png.palette.data);
    palTex.create();

    let idxTex = new IndexedTexture(gl);
    idxTex.setPngData(png.imageData.decompress());
    idxTex.create();

    let quadBuffer = new QuadBuffer(gl,1);
    quadBuffer.setAttributes(0, 0,0,256,256,0,0,256,256,1,0);
    quadBuffer.create();
    let renderable = new Renderable({
        buffer: quadBuffer,
        texture: idxTex,
        palette: palTex,
        paletteId: 0
    });

    renderer.renderList.push(renderable);
    
    setInterval(() => {
        palTex.shift(0, 157, 160);
        palTex.update();
    }, 300)

})();

function render(){

}
