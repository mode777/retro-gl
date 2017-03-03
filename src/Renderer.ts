import { Renderable } from './Renderable';
import { Mesh } from './interfaces';

export class Renderer {
    renderList: Renderable<Mesh>[] = [];
    
    private _palette: WebGLTexture;
    private _texture: WebGLTexture;
    private _palette_x: number;
    private _palette_y: number;
    private _paletteId: number;

    private _projection: mat4;

    constructor(private _gl: WebGLRenderingContext, private _shader: twgl.ProgramInfo){
        this._projection = mat4.create();
        mat4.ortho(this._projection, 0, _gl.canvas.width, _gl.canvas.height, 0, 1, -1);
    }

    render(){
        this.renderList.forEach((r)=> r.mesh.update());

        //this._gl.clear(this._gl.COLOR_CLEAR_VALUE);
        this._gl.useProgram(this._shader.program);
        twgl.setUniforms(this._shader, {
            proj: this._projection,
        });
        this.renderList.forEach((r)=>{
            let u = this._getUniforms(r);
            
            if(u){
                twgl.setUniforms(this._shader, u);
            }
            twgl.setBuffersAndAttributes(this._gl, this._shader, r.mesh.bufferInfo);
            twgl.drawBufferInfo(this._gl, r.mesh.bufferInfo);
        });
    }

    protected _getUniforms(r: Renderable<Mesh>){
        let changed = false;
        let u = {};

        if(r.texture != this._texture){
            changed = true;
            this._texture = u["texture"] = r.texture;
        }

        if(r.palette != this._palette){
            changed = true;
            this._palette = u["palette"] = r.palette;
        }

        if(r.paletteId != this._paletteId){
            changed = true;
            this._paletteId = r.paletteId;
            this._palette_x = u["palette_x"] = r.palOffsetX;
            this._palette_y = u["palette_y"] = r.palOffsetY;
        }

        if(changed)
            return u;
        else
            return null;
    }
}