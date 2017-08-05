import Stats = require("stats.js");
import { IndexedRenderer, Renderer } from "./../core";
import { getContext } from "twgl.js";

export class Scene {
    
    public readonly gl: WebGLRenderingContext;
    
    private _stats: Stats; 
    private _running: boolean; 
        
    constructor(public readonly canvas: HTMLCanvasElement){
        let gl = getContext(canvas, {
            premultipliedAlpha: false,
            alpha: false,
            antialias: false
        });

        //twgl.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        this.useStats();
    }

    private useStats(){
        this._stats = new Stats();
        this._stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this._stats.dom );
    }

    public start(){

    }

    public stop(){

    }

    public 

    public userRenderer(renderer: Renderer){
        
    }

    private _render(){

    }
}