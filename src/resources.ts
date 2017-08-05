import { getContext } from "twgl.js";
import { PaletteTexture, stringToBuffer, IndexedTexture, FontInfo } from "./core";
import { PngReader } from "./PngReader/PngReader";

export const paletteTexture = new PaletteTexture(gl);

const tilesetPng = new PngReader(stringToBuffer(require("../res/textures/8bit/tiles.png")));
export const tilesetPalette = paletteTexture.add();
paletteTexture.setRawPalette(tilesetPalette, tilesetPng.createPaletteDataRgba(256));
export const tilesetTexture = new IndexedTexture(gl);
tilesetTexture.setRawData(tilesetPng.createPixelData());
tilesetTexture.create();

const fontPng = new PngReader(stringToBuffer(require("../res/textures/8bit/font.png")));
export const fontPalette = paletteTexture.add();
paletteTexture.setRawPalette(fontPalette, fontPng.createPaletteDataRgba(256));
paletteTexture.setPalColor(1, 7, [255,255,255,0]);
export const fontTexture = new IndexedTexture(gl);
fontTexture.setRawData(fontPng.createPixelData());
fontTexture.create();

const spritesPng = new PngReader(stringToBuffer(require("../res/textures/8bit/sprites.png")));
export const spritesPalette = paletteTexture.add();
paletteTexture.setRawPalette(spritesPalette, spritesPng.createPaletteDataRgba(256));
export const spritesTexure = new IndexedTexture(gl);
spritesTexure.setRawData(spritesPng.createPixelData());
spritesTexure.create();

paletteTexture.create();

export const fontInfo = <FontInfo>require("../res/fonts/font.json");