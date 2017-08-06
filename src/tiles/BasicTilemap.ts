import { Tilemap } from "../core";

export class BasicTilemap implements Tilemap {
    
    readonly tileIds: number[] | Uint16Array;

    constructor(
        public readonly width: number, 
        public readonly height: number,
        tileiIds?: number[] | Uint16Array){

        if(tileiIds && tileiIds.length !== width * height)
            throw "Invalid tileId array length";
        
        this.tileIds = tileiIds || new Uint16Array(width * height);
    }

    get(x: number, y: number): number {
        return this.tileIds[ y*this.width + x ];
    }
    
    set(x: number, y: number, tid: number) {
        this.tileIds[ y*this.width + x ] = tid;
    }

}