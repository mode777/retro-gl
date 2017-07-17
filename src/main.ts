
import { Renderer, Renderable, TextBuffer, TileBuffer, Sprite, QuadBuffer, MIN_Z, FontInfo, Transform2d, IndexedTexture, PaletteTexture } from "./core";
import { initWebGl, createAlphaTexture, createTexture, createTileSprite } from './helpers';
import * as twgl from "twgl.js";
import Stats = require("stats.js");
import * as SPECTOR from "spectorjs";
import { stringToBuffer } from "./BinaryHelpers";
import { PngReader } from "./PngReader/PngReader";


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

    
    let vs = <string>require("../res/shaders/8bit_vs.glsl");
    let fs = <string>require("../res/shaders/8bit_fs.glsl");
    //let fs24 = <string>require("../res/shaders/24bit_fs.glsl");
    let programInfo = twgl.createProgramInfo(gl, [vs, fs]);  
    
    const palette = new PaletteTexture(gl);

    const tilesetPng = new PngReader(stringToBuffer(require("../res/textures/8bit/tiles.png")));
    const tileset = new IndexedTexture(gl);
    tileset.setRawData(tilesetPng.createPixelData());
    tileset.create();

    palette.setRawPalette(0, tilesetPng.createPaletteDataRgba(256));

    const fontPng = new PngReader(stringToBuffer(require("../res/textures/8bit/font.png")));
    const font = new IndexedTexture(gl);
    font.setRawData(fontPng.createPixelData());
    font.create();

    palette.setRawPalette(1, fontPng.createPaletteDataRgba(256));
    palette.create();

    const fontInfo = <FontInfo>require("../res/fonts/font.json");

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
    
    let fntBuffer = new TextBuffer(gl, fontInfo).create();
    fntBuffer.write("Start Game", 320, 130,50,4,4);
    fntBuffer.write("Load Game", 320, 130,50+16,4);
    fntBuffer.write("Settings", 320, 130,50+16*2,4);
    fntBuffer.write("Quit", 320, 130,50+16*3,4);    
    text = new Renderable({
        buffer: fntBuffer,
        texture: font,
        paletteId: 1,
        palette: palette
    });

    let sprites: Sprite[] = [];
    for (var i = 0; i < "Start Game".length; i++) {
        let sprite = fntBuffer.createSprite(i);
        sprites.push(sprite);
    }

    const test = new QuadBuffer(gl).create();
    const sprites2: Sprite[] = [];

    const testR = new Renderable({
        buffer: test,
        texture: tileset,
        paletteId: 0,
        palette: palette
    });

    renderer.renderList.push(tiles);
    renderer.renderList.push(text);
    renderer.renderList.push(testR);

    let a = .5;

    function render(time: number) {
        stats.begin();
        
        t+=0.1;
        a*=0.9;
        sprites.forEach(s => s.transform.y = Math.sin(s.x/4+t)*3);

        const spr = test.createSprite(test.add(), new Transform2d(), {
            w: 1,
            h: 1,
            palOffset: 0,
            textureX: 32,
            textureY: 0,
            x: 1,
            y: 1,
            z: 250
        });
        spr.tag["dx"] = Math.random();
        spr.tag["dy"] = Math.random();
        sprites2.push(spr);

        sprites2.forEach(s => {
            if(s.transform.x > 320 || s.transform.x < 0){
                s.tag["dx"] = -s.tag["dx"]; 
            }
            if(s.transform.y > 180 || s.transform.y < 0){
                s.tag["dy"] = -s.tag["dy"]; 
            }
            s.transform.x += s.tag["dx"];
            s.transform.y += s.tag["dy"];
        })
        //sprites2.forEach(s => s.transform.update());
        

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