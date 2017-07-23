import { Renderable, QuadBuffer, Transform2d, BlendMode } from "../core";

export class SpriteBatch implements Renderable {
    
    public mode7 = false;
    public zSort = true;
    blendMode: BlendMode = "alpha";
    
    private _buffer = new QuadBuffer(this._gl);
    private _transform = new Transform2d();

    constructor(private _gl: WebGLRenderingContext, private _texture: WebGLTexture){

    }  
    
    update() {
        this._transform.update();
        this._buffer.update();
    }
    
    get bufferInfo() { return this._buffer.bufferInfo; }
    get transformation() { return this._transform.matrix; }
    get texture() { return this._texture; }
    get elements() { return this._buffer.vertexSize; }
    get offset() { return 0; };

}