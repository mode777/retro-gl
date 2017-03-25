import { PixelTexture } from '../core/PixelTexture';
import { PaletteTexture } from '../core/PaletteTexture';
import { JsonRessource, RessourceWriter } from './interfaces';
import { TextureWriter } from "./TextureWriter";

export class JsonRessourceWriter implements RessourceWriter {
    
    private _textures: {[key: string]: PixelTexture} = {};
    private _palettes: {[key: string]: PaletteTexture} = {};
    
    public  addTexture(key: string, texture: PixelTexture) {
        this._textures[key] = texture;
    }

    public addPalette(key: string, texture: PaletteTexture){
        this._palettes[key] = texture;        
    }

    public getJson() : JsonRessource {
        let textures = {};
        for (var key in this._textures) {
            textures[key] = new TextureWriter(this._textures[key]).getJson();
        }

        return {
            textures: textures
        }
    }

    public getJsonString(){
        return JSON.stringify(this.getJson());
    }

    // http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
    public download(filename: string){
        var element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(this.getJsonString()));
        element.setAttribute("download", filename);

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

}