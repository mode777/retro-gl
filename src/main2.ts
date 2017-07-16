import { PngReader } from './PngReader/PngReader';
import { initWebGl, createTexture } from './helpers';
import { Renderer } from "./core/index";
import { QuadBuffer } from './core/QuadBuffer';
import { Renderable } from './core/Renderable';
import { PaletteTexture } from './core/PaletteTexture';
import { ColorComponent } from './core/PixelTexture';
import { IndexedTexture } from './core/IndexedTexture';
import * as twgl from "twgl.js";
import { stringToBuffer } from "./BinaryHelpers";
import * as SPECTOR from "spectorjs";

const spector = new SPECTOR.Spector();
spector.displayUI();
spector.spyCanvases();

(async function main(){
    let gl = initWebGl();

    let vs = <string>require("../res/shaders/8bit_vs.glsl");
    let fs = <string>require("../res/shaders/8bit_fs.glsl");
    let fs24 = <string>require("../res/shaders/24bit_fs.glsl");
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
    
    let buffer = stringToBuffer(require("../res/textures/8bit_test.png"));
    let png = new PngReader(buffer);
    
    let palTex = new PaletteTexture(gl);
    palTex.setRawPalette(0, png.createPaletteDataRgba(256));
    palTex.create();
    let idxTex = new IndexedTexture(gl);
    idxTex.setRawData(png.createPixelData());
    idxTex.create();

    let quadBuffer = new QuadBuffer(gl,1);
    quadBuffer.setAttributes(0, 0,0,256,256,0,0,256,256,1,0);
    quadBuffer.create();
    let renderable = new Renderable({
        buffer: quadBuffer,
        texture: idxTex,
        palette: palTex,
        paletteId: 0,
    });

    renderer.renderList.push(renderable);
    
    setInterval(() => {
        palTex.shift(0, 157, 160);
        palTex.update();
    }, 300)

})();

