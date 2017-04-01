import * as binaryPlugin from "./lib/JQueryBinaryTransport";
import { initWebGl, createTexture } from './helpers';
import { Renderer } from './core/Renderer';
import { GifReader } from './GifReader/GifReader';
import { PaletteTexture } from './core/PaletteTexture';
import { IndexedTexture } from './core/IndexedTexture';
import { QuadBuffer } from './core/QuadBuffer';
import { Renderable } from './core/Renderable';

binaryPlugin.register();


(async function main(){
    // let testBuffer: ArrayBuffer = await $.ajax(<any>{
    //     url: "res/textures/test.gif",
    //     type: "GET",
    //     dataType: "binary",
    //     responseType: "arraybuffer",
    //     processData: false
    // });
    // let tGif = new GifReader(testBuffer);
    // console.log(tGif.createRawFrameData(0));

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
        url: "res/textures/wiki.gif",
        type: "GET",
        dataType: "binary",
        responseType: "arraybuffer",
        processData: false
    });

    let gif = new GifReader(buffer);
    
    let palData = gif.createGlobalPaletteDataRgba(256);

    let palTex = new PaletteTexture(gl);
    palTex.setRawPalette(0, palData);
    palTex.create();

    let perf = performance.now();
    let textures: IndexedTexture[] = [];
    for (var i = 0; i < gif.frames; i++) {
        console.log("frame "+i)
        let data = gif.createRawFrameData(i);
        let idxTex = new IndexedTexture(gl);
        idxTex.setRawData(data);
        idxTex.create();
        textures.push(idxTex);        
    }
    console.log(performance.now() - perf);

    let quadBuffer = new QuadBuffer(gl,1);
    quadBuffer.setAttributes(0, 0,0,256,256,0,0,256,256,1,0);
    quadBuffer.create();
    let renderable = new Renderable({
        buffer: quadBuffer,
        texture: textures[3].texture,
        palette: palTex,
        paletteId: 0
    });
    renderable.transform.y = -50;

    renderer.renderList.push(renderable);

    let ctr = 0;
    setInterval(() => {
        renderable.texture = textures[(ctr++)%gif.frames].texture;
        //console.log(textures[(ctr++)%gif.frames].texture)
    }, 200);
})();

