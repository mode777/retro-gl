
import { Renderer, OldRenderable, TextBuffer, TileBuffer, Sprite, QuadBuffer, MIN_Z, FontInfo, Transform2d, IndexedTexture, PaletteTexture, stringToBuffer } from "./core";
import { initWebGl, createAlphaTexture, createTexture, createTileSprite } from './helpers';
import * as twgl from "twgl.js";
import Stats = require("stats.js");
import * as SPECTOR from "spectorjs";
import { PngReader } from "./PngReader/PngReader";
import { IndexedRenderer } from "./core/IndexedRenderer";
import { gl, paletteTexture, spritesTexure, spritesPalette } from "./resources";
import { SpriteBatch } from "./renderables/SpriteBatch";
import { IndexedSpriteBatch } from "./renderables/IndexedSpriteBatch";


// const spector = new SPECTOR.Spector();
// spector.displayUI();
// spector.spyCanvases();
window.onerror = (e: string) => alert(e);

let t = 0;
//let renderer: Renderer;

let tiles: OldRenderable<TileBuffer>;
let text: OldRenderable<TextBuffer>;

async function main(){
    
    var stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    const renderer = new IndexedRenderer(gl, paletteTexture);
    const batch = new IndexedSpriteBatch(gl, spritesTexure, spritesPalette)
    
    const sprites: Sprite[] = [];
    
    renderer.renderList.push(batch);

    function render(time: number) {
        stats.begin();

        const spr = batch.createSprite(0,0, 16,16);
        spr.transform.ox = 8;
        spr.transform.oy = 8;
        spr.transform.x = 10;
        spr.transform.y = 10;
        spr.tag = {
            x: Math.random(), 
            y: Math.random(),
            rot: -0.005 + Math.random() / 50
        };
        sprites.push(spr);
        
        sprites.forEach(spr => {
            spr.transform.x += spr.tag.x;
            spr.transform.y += spr.tag.y;
            spr.transform.rot += spr.tag.rot;
            if(spr.transform.x > 320 || spr.transform.y < 0)
                spr.tag.x *= -1;
            if(spr.transform.y > 180 || spr.transform.y < 0)
                spr.tag.y *= -1;


        });

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