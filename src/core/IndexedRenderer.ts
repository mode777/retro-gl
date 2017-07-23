import { OldRenderable } from './Renderable';
import { Buffer, RendererSettings, RenderableOptions, RenderableBufferOptions, IndexedRenderable, BlendMode } from './interfaces';
import { PAL_OFFSET, MAT4_IDENT } from './constants';
import { mat4, vec3 } from "gl-matrix";
import * as twgl from "twgl.js";

const DEFAULT_Z_SORT = false;
const DEFAULT_BLEND_MODE: BlendMode = "none";

export class IndexedRenderer {
    private _ortho: mat4;
    private _projection: mat4;
    private _view: mat4;
    
    private _matrix: mat4;
    private _matrixTemp: mat4;

    private _shader: twgl.ProgramInfo;
    readonly renderList: IndexedRenderable[] = [];

    // state
    private _zSort: boolean = DEFAULT_Z_SORT;
    private _blendMode: BlendMode = DEFAULT_BLEND_MODE;
    private _paletteId: number = 0;
    private _texture: WebGLTexture;

    constructor(private _gl: WebGLRenderingContext, paletteTexture: WebGLTexture){
        
        this._ortho = mat4.ortho(mat4.create(), 0, _gl.canvas.width, _gl.canvas.height, 0, -256, 0);
        this._projection = mat4.perspective(mat4.create(), 1, 1, -255, 0);
        this._view = mat4.lookAt(mat4.create(), vec3.fromValues(0,-1,1.5), vec3.fromValues(0,1,.7), vec3.fromValues(0, 1, 0));

        this._matrix = mat4.create();
        this._matrixTemp = mat4.create();

        this._createShader();
    }     

    render(){
        this.renderList.forEach((r)=> r.update());
        
        //this._gl.clear(this._gl.COLOR_CLEAR_VALUE);
        this._gl.useProgram(this._shader.program);
        
        this.renderList.forEach((r)=>{
            this._updateRenderState(r);
            this._updateMatrix(r);
            let u = this._getUniforms(r);
            
            if(u){
                twgl.setUniforms(this._shader, u);
            }
            twgl.setBuffersAndAttributes(this._gl, this._defaults.shader, r.buffer.bufferInfo);
            //console.log(r.buffer.vertexSize)
            twgl.drawBufferInfo(this._gl, r.buffer.bufferInfo, this._gl.TRIANGLES, r.buffer.vertexSize);
        });
    }

    protected _updateRenderState(r: IndexedRenderable){
        let zSort = r.zSort != undefined ? r.zSort : DEFAULT_Z_SORT; 
        let blendMode = r.blendMode || DEFAULT_BLEND_MODE;
            
        if(zSort != this._zSort){
            zSort 
            ? this._gl.enable(this._gl.DEPTH_TEST) 
            : this._gl.disable(this._gl.DEPTH_TEST);
            this._zSort = zSort;
        }
        if(blendMode != this._blendMode){
            switch (blendMode) {
                case "alpha":
                    this._gl.enable(this._gl.BLEND);
                    this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
                    break;
                default:
                    this._gl.disable(this._gl.BLEND);
                    break;          
            }
            this._blendMode = blendMode;
        }
    }

    protected _updateMatrix(r: IndexedRenderable){
        let transform = r.transformation
            ? r.transformation
            : MAT4_IDENT;
        
        if(r.mode7){
            mat4.mul(this._matrixTemp, this._ortho, transform);
            mat4.mul(this._matrix, this._projection, this._view);
            mat4.mul(this._matrix, this._matrix, this._matrixTemp);
        }
        else {
            mat4.mul(this._matrix, this._ortho, transform);
        }
    }



    protected _getUniforms(r: IndexedRenderable){
        
        //this.a-=0.0001;
        //let a = this.a;

        const u = {
            matrix: this._matrix,
        };

        const palId = typeof(r.palette) == "number" 
            ? r.palette
            : 0 // TODO: Use a real palette object here.

        if(r.texture != this._texture){
            this._texture = u["texture"] = r.texture;
        }

        if(palette != this._settings.palette)
            this._settings.palette = u["palette"] = palette;

        if(paletteId != this._settings.paletteId){
            this._settings.paletteId = paletteId;
            u["pal_offset"] = paletteId * PAL_OFFSET;
        }

        return u;
    }

    private _createShader(){
        let vs = <string>require("../res/shaders/8bit_vs.glsl");
        let fs = <string>require("../res/shaders/8bit_fs.glsl");
        //let fs24 = <string>require("../res/shaders/24bit_fs.glsl");
        this._shader = twgl.createProgramInfo(this._gl, [vs, fs]); 
    }
}