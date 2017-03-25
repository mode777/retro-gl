export interface JsonRessource {
    textures?: {[key: string]: JsonTexture };
    palettes?: {[key: string]: JsonPalette };
}

export interface JsonTexture {
    colorDepth: 8 | 24 | 32;
    imageData: string;
}

export interface JsonPalette {
    texture: JsonTexture;
}

export interface RessourceReader<T>{
    getRessource(): T;
}

export interface RessourceWriter {
    getJson() : any;
}

