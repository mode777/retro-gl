import { Renderable, QuadBuffer, Transform2d, BlendMode, PixelTexture } from "../core";

export class SpriteBatch implements Renderable {
    
    public mode7 = false;
    public zSort = true;
    blendMode: BlendMode = "alpha";
    
    private _buffer = new QuadBuffer(this._gl).create();
    private _transform = new Transform2d();
    private _texture: WebGLTexture;

    constructor(private _gl: WebGLRenderingContext, texture: PixelTexture){
        this._texture = texture.texture;
    }  
    
    update() {
        this._transform.update();
        this._buffer.update();
    }

    createSprite(x: number, y: number, w: number, h: number){
        return this._buffer.createSprite(
            this._buffer.add(), 
            new Transform2d(),
            {
                w: w,
                h: h,
                textureX: x,
                textureY: y,
                palOffset: 0,
                x: 0,
                y: 0,
                z: 1
            }
         )
    }
    
    get bufferInfo() { return this._buffer.bufferInfo; }
    get transformation() { return this._transform.matrix; }
    get texture() { return this._texture; }
    get elements() { return this._buffer.vertexSize; }
    get offset() { return 0; };

}