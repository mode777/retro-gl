
import { Renderer, Renderable, TextBuffer, TileBuffer, Sprite, QuadBuffer, MIN_Z, FontInfo } from "./core";
import { initWebGl, createAlphaTexture, createTexture, createTileSprite } from './helpers';
import * as twgl from "twgl.js";
import Stats = require("stats.js");
import * as SPECTOR from "spectorjs";

const spector = new SPECTOR.Spector();
spector.displayUI();
spector.spyCanvases();


let gl: WebGLRenderingContext;
let t = 0;
let renderer: Renderer;

let tiles: Renderable<TileBuffer>;
let text: Renderable<TextBuffer>;

async function main(){
    
    var stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    gl = initWebGl();
    
    let tileset = createAlphaTexture(gl, "../res/textures/tileset2.png");    
    let font = createAlphaTexture(gl, "../res/textures/font.png");    
    let palette = createTexture(gl, "../res/textures/pal_new.png");   
    let fontInfo = <FontInfo>require("../res/fonts/font.json");

    let vs = <string>require("../res/shaders/8bit_vs.glsl");
    let fs = <string>require("../res/shaders/8bit_fs.glsl");
    let fs24 = <string>require("../res/shaders/24bit_fs.glsl");
    let programInfo = twgl.createProgramInfo(gl, [vs, fs]);    
    renderer = new Renderer(gl, {
        shader: programInfo,
        palette: palette,
        texture: font,
        paletteId: 0,
        zSort: true,
        blendMode: "none"
    });

    tiles = createTileSprite(gl, tileset, palette, 0);

    // const vertBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, tiles.buffer._data, gl.STATIC_DRAW);

    // const indexBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, tiles.buffer._indices, gl.STATIC_DRAW);

    // //each draw?
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
    // gl.vertexAttribPointer(0, 2, gl.UNSIGNED_SHORT, false, 8, 0);
    // gl.vertexAttribPointer(1, 1, gl.UNSIGNED_BYTE, false, 8, 4);
    // gl.vertexAttribPointer(2, 1, gl.UNSIGNED_BYTE, true, 8, 5);
    // gl.vertexAttribPointer(3, 2, gl.UNSIGNED_BYTE, false, 8, 6);

    // gl.useProgram(renderer._defaults.shader.program);

    //let tiles2 = createTileSprite(tileset, palette, 1);
    
    let fntBuffer = new TextBuffer(gl, 128, fontInfo).create();
    fntBuffer.write("Start Game", 320, 130,50,4,4);
    fntBuffer.write("Load Game", 320, 130,50+16,4);
    fntBuffer.write("Settings", 320, 130,50+16*2,4);
    fntBuffer.write("Quit", 320, 130,50+16*3,4);    
    text = new Renderable({
        buffer: fntBuffer,
        texture: font,
        paletteId: 1
    });

    let sprites: Sprite[] = [];
    for (var i = 0; i < "Start Game".length; i++) {
        let sprite = fntBuffer.createSprite(i);
        sprites.push(sprite);
    }

    renderer.renderList.push(tiles);
    renderer.renderList.push(text);
    let a = .5;

    function render(time: number) {
        stats.begin();
        
        t+=0.1;
        a*=0.9;
        sprites.forEach(s => s.transform.y = Math.sin(s.x/4+t)*3);

        renderer.render();
        
        stats.end();
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    let posx = 0;
    let posy = 0;

    setInterval(()=> {
        //tiles.transform.x = Math.floor((posx -= 0.1)%(4*16));
        //tiles.transform.y = Math.floor((posy -= 0.1)%(16));
    }, 16);

}

main();