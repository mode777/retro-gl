import * as twgl from "twgl.js";
import Stats = require("stats.js");
import * as SPECTOR from "spectorjs";

import { PngReader } from "./PngReader/PngReader";

import { IndexedRenderer, Sprite, IndexedRenderable } from "./core";
import { paletteTexture, spritesTexure, spritesPalette, gl } from "./resources";
import { Scene, createGlContext } from "./engine";
import { IndexedSpriteBatch } from "./renderables";


// const spector = new SPECTOR.Spector();
// spector.displayUI();
// spector.spyCanvases();
window.onerror = (e: string) => alert(e);

const renderer = new IndexedRenderer(gl, paletteTexture);
const scene = new Scene<IndexedRenderable>(renderer);
const batch = new IndexedSpriteBatch(gl, spritesTexure, spritesPalette)
const sprites: Sprite[] = [];

scene.add(batch);
scene.start();

scene.registerUpdateCallback(() => { 
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