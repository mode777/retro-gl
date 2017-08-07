import { Renderable, QuadBuffer, Transform2d, BlendMode, PixelTexture } from "../core";

export class RenderableBase implements Renderable {
    
    public mode7 = false;
    public zSort = true;
    blendMode: BlendMode = "alpha";
    
    protected _buffer: QuadBuffer;
    protected _transform = new Transform2d();

    constructor(protected _gl: WebGLRenderingContext, protected _texture: WebGLTexture, initialCapacity = 16){
        this._buffer = new QuadBuffer(this._gl, initialCapacity).create()
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

    get transform() { return this._transform; }
}