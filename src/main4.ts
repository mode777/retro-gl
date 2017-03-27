import * as binaryPlugin from "./lib/JQueryBinaryTransport";
import { initWebGl, createTexture } from './helpers';
import { Renderer } from './core/Renderer';
import { GifReader } from './GifReader/GifReader';

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
        url: "res/textures/megamanx2_2.gif",
        type: "GET",
        dataType: "binary",
        responseType: "arraybuffer",
        processData: false
    });

    let gif = new GifReader(buffer);
    console.log(gif);

})();

