import * as twgl from "twgl.js";
import Stats = require("stats.js");
import * as SPECTOR from "spectorjs";

import { PngReader } from "./PngReader/PngReader";

import { IndexedRenderer, Sprite, IndexedRenderable } from "./core";
import { paletteTexture, spritesTexure, spritesPalette, gl, minecraftTexure, minecraftPalette } from "./resources";
import { Scene, createGlContext } from "./engine";
import { IndexedSpriteBatch } from "./renderables";
import { BasicTileset, BasicTilemap, IndexedTileBatch } from "./tiles";

// const spector = new SPECTOR.Spector();
// spector.displayUI();
// spector.spyCanvases();
window.onerror = (e: string) => alert(e);

const renderer = new IndexedRenderer(gl, paletteTexture);
const scene = new Scene<IndexedRenderable>(renderer);
const batch = new IndexedSpriteBatch(gl, spritesTexure.texture, spritesPalette)
const sprites: Sprite[] = [];

const tileset = new BasicTileset(16,16, minecraftTexure.texture);
const tilemap = new BasicTilemap(3,3, [1,2,3,4,5,6,7,8,9])
const tilebatch = new IndexedTileBatch(gl, tileset, 16,32, minecraftPalette);

tilebatch.setTilemap(tilemap);

scene.add(tilebatch);
scene.add(batch);
scene.start();

let x = 0;
let y = 0;

scene.registerUpdateCallback(() => { 
    x++;
    y++;
    
    tilebatch.setTilemap(tilemap, Math.floor(x/16),0);
    tilebatch.transform.x = -(x%16);
    //tilebatch.transform.y = -(y%16);

    createSprite(sprites);
    updateSprites(sprites);
});

function createSprite(sprites: Sprite[]){
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
};

function updateSprites(sprites: Sprite[]){
    sprites.forEach(spr => {
        spr.transform.x += spr.tag.x;
        spr.transform.y += spr.tag.y;
        spr.transform.rot += spr.tag.rot;
        if(spr.transform.x > 320 || spr.transform.y < 0)
            spr.tag.x *= -1;
        if(spr.transform.y > 180 || spr.transform.y < 0)
            spr.tag.y *= -1;
    });
}