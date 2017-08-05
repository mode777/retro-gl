import Stats = require("stats.js");
import { IndexedRenderer, Renderer, Renderable } from "./../core";
import { createUuid } from "./helpers";

export class Scene<T extends Renderable> {
    
    private _stats: Stats; 
    private _running: boolean; 
    private _renderCallback: () => void;
    private _registeredCallbacks: {[key: string]: () => void} = {};
    
    constructor(public readonly renderer: Renderer<T>){     
        this.useStats();
        this._renderCallback = () => this._render();
    }

    private useStats(){
        this._stats = new Stats();
        this._stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this._stats.dom );
    }

    public start(){
        this._running = true;
        requestAnimationFrame(this._renderCallback);
    }

    public registerUpdateCallback(callback: () => void, id?: string): string{
        id = id || createUuid();
        this._registeredCallbacks[id] = callback;
        return id;
    }

    public deregisterUpdateCallback(id: string){
        delete this._registeredCallbacks[id];
    }

    public stop(){
        this._running = false;
    }

    public add(renderable: T){
        this.renderer.renderList.push(renderable);
    }

    public remove(renderable: T){
        const list = this.renderer.renderList;
        const index = list.indexOf(renderable);
        if(index != -1){
            list.splice(index,1);
        }
    }

    private _render(){
        this._stats.begin();
        Object.keys(this._registeredCallbacks).forEach(id => {
            this._registeredCallbacks[id]();
        })
        this.renderer.render();
        this._stats.end();

        if(this._running){
            requestAnimationFrame(this._renderCallback);
        }
    }
}