import { Renderable } from './Renderable';
import { Buffer, RendererSettings, RenderableOptions, RenderableBufferOptions } from './interfaces';
import { PAL_OFFSET, MAT4_IDENT } from './constants';
import { mat4, vec3 } from "gl-matrix";
import * as twgl from "twgl.js";

export class Renderer {
    renderList: Renderable<Buffer>[] = [];
    
    /*private*/ _defaults: RendererSettings;
    private _settings: RendererSettings = <any>{};

    private _ortho: mat4;
    private _projection: mat4;
    private _view: mat4;
    
    private _matrix: mat4;
    private _matrixTemp: mat4;

    constructor(private _gl: WebGLRenderingContext, settings: RendererSettings){
        
        this._ortho = mat4.ortho(mat4.create(), 0, _gl.canvas.width, _gl.canvas.height, 0, -256, 0);
        this._projection = mat4.perspective(mat4.create(), 1, 1, -255, 0);
        this._view = mat4.lookAt(mat4.create(), vec3.fromValues(0,-1,1.5), vec3.fromValues(0,1,.7), vec3.fromValues(0, 1, 0));

        this._matrix = mat4.create();
        this._matrixTemp = mat4.create();
        
        this.setDefaults(settings);
    }

    setDefaults(defaults: RendererSettings){
        this._defaults = defaults;//$.extend({},defaults);        
    }      

    render(){
        this.renderList.forEach((r)=> r.buffer.update());
        
        //this._gl.clear(this._gl.COLOR_CLEAR_VALUE);
        this._gl.useProgram(this._defaults.shader.program);
        
        this.renderList.forEach((r)=>{
            this._setOptions(r);
            this._buildMatrix(r);
            let u = this._getUniforms(r);
            
            if(u){
                twgl.setUniforms(this._defaults.shader, u);
            }
            twgl.setBuffersAndAttributes(this._gl, this._defaults.shader, r.buffer.bufferInfo);
            twgl.drawBufferInfo(this._gl, r.buffer.bufferInfo);
        });
    }

    protected _setOptions(r: RenderableOptions){
        let zSort = r.zSort != undefined ? r.zSort : this._defaults.zSort; 
        let blendMode = r.blendMode || this._defaults.blendMode;
            
        if(zSort != this._settings.zSort){
            zSort 
            ? this._gl.enable(this._gl.DEPTH_TEST) 
            : this._gl.disable(this._gl.DEPTH_TEST);
            this._settings.zSort = zSort;
        }
        if(blendMode != this._settings.blendMode){
            switch (blendMode) {
                case "alpha":
                    this._gl.enable(this._gl.BLEND);
                    this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
                    break;
                default:
                    this._gl.disable(this._gl.BLEND);
                    break;          
            }
            this._settings.blendMode = blendMode;
        }
    }

    a = 0;

    protected _buildMatrix(r: RenderableBufferOptions<Buffer>){
        let transform = r.transform
            ? r.transform.matrix
            : MAT4_IDENT;
        
        if(r.mode7){
            mat4.mul(this._matrixTemp, this._ortho, transform);
            mat4.mul(this._matrix, this._projection, this._view);
            mat4.mul(this._matrix, this._matrix, this._matrixTemp);
        }
        else {
            mat4.mul(this._matrix, this._ortho, transform);
            //mat4.mul(this._matrix, this._ortho, r.transform.matrix);
        }
    }

    protected _getUniforms(r: RenderableBufferOptions<Buffer>){
        
        this.a-=0.0001;
        let a = this.a;

        let u = {
            matrix: this._matrix,
        };

        let texture = r.texture || this._defaults.texture;
        let palette = r.palette || this._defaults.palette;
        let paletteId = r.paletteId || this._defaults.paletteId;

        if(texture != this._settings.texture)
            this._settings.texture = u["texture"] = texture;

        if(palette != this._settings.palette)
            this._settings.palette = u["palette"] = palette;

        if(paletteId != this._settings.paletteId){
            this._settings.paletteId = paletteId;
            u["pal_offset"] = paletteId * PAL_OFFSET;
        }

        return u;
    }
}