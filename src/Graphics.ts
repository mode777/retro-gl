export class Graphics{
    constructor(private _gl: WebGLRenderingContext){

    }

    CreateSuperTile(tids: number[], data?: twgl.Arrays){
        data = data || {
            position: new Float32Array(1152),
            texcoord: new Float32Array(768)
        }

        let ctr = 0;
        let posCtr = 0;
        let texCtr = 0;

        let tidPos = {
            x: 0,
            y: 0
        }

        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++){
                this._getTidPos(tids[ctr], tidPos);
                this._createPositions(x*16, y*16, 16, 16, <Float32Array>data["position"], posCtr);
                this._createUvs(x*16, y*16, 16, 16, <Float32Array>data["texcoord"], texCtr);
                ctr++;
                posCtr+=18;
                texCtr+=12;
            }
        }

    }

    private _createPositions(x:number,y:number,w: number,h: number, position: Float32Array, offset: number){
            position[offset++] = x; 
            position[offset++] = y; 
            position[offset++] = 0;

            position[offset++] = x+w; 
            position[offset++] = y; 
            position[offset++] = 0;

            position[offset++] = x; 
            position[offset++] = y+h; 
            position[offset++] = 0;

            position[offset++] = x; 
            position[offset++] = y+h; 
            position[offset++] = 0;

            position[offset++] = x+w; 
            position[offset++] = y; 
            position[offset++] = 0;

            position[offset++] = x+w; 
            position[offset++] = y+h; 
            position[offset++] = 0
    }

    private _createUvs(x:number,y:number,w: number,h: number, texcoord: Float32Array, offset: number){
        
        texcoord[offset++] = x;
        texcoord[offset++] = y;

        texcoord[offset++] = x+w;
        texcoord[offset++] = y;
        
        texcoord[offset++] = x;
        texcoord[offset++] = y+h;
        
        texcoord[offset++] = x;
        texcoord[offset++] = y+h;
        
        texcoord[offset++] = x+w;
        texcoord[offset++] = y;
        
        texcoord[offset++] = x+w;
        texcoord[offset++] = y+h
    }

    private _getTidPos(tid: number, out: any){
        out.x = tid % 16;
        out.y = Math.floor(tid / 16);
    }
}