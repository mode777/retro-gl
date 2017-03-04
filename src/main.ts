import { QuadMesh } from './QuadMesh';
import { TileMesh } from './TileMesh';
import { Renderer } from './Renderer';
import { Renderable } from './Renderable';
import { TextMesh } from './TextMesh';
import { FontInfo } from './interfaces';

let gl: WebGLRenderingContext;
let t = 0;
let renderer: Renderer;

let tiles: Renderable<TileMesh>;
let text: Renderable<TextMesh>;

async function main(){
    
    var stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    initWebGl();
    
    let tileset = createAlphaTexture("/res/textures/tileset.png");    
    let font = createAlphaTexture("/res/textures/font.png");    
    let palette = createTexture("/res/textures/out_pal2.png");   
    let fontInfo = await $.getJSON("/res/fonts/font.json");

    let vs = await $.get("/res/shaders/8bit_vs.glsl");
    let fs = await $.get("/res/shaders/8bit_fs.glsl");
    let programInfo = twgl.createProgramInfo(gl, [vs, fs]);
    renderer = new Renderer(gl, programInfo);

    tiles = createTileSprite(tileset, palette, 5);
    // tiles2 = createTileSprite();
    // tiles3 = createTileSprite();
    // tiles4 = createTileSprite();
    text = createText(font, palette, 17, fontInfo,  "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores");
    text.mesh.range = 0;
    console.log(text);

    renderer.renderList.push(tiles);
    renderer.renderList.push(text);

    function render(time) {
        stats.begin();

        t+=0.005;
        renderer.render();

        stats.end();
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function initWebGl(){
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");

    gl = twgl.getContext(canvas, {
        premultipliedAlpha: false,
        alpha: false,
        antialias: false
    });

    //twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

function createTexture(path: string){
    return twgl.createTexture(gl, {
        src: path,
        min: gl.NEAREST,
        mag: gl.NEAREST
    });
}

function createAlphaTexture(path: string){
    return twgl.createTexture(gl, {
        src: path,
        min: gl.NEAREST,
        mag: gl.NEAREST,
        format: gl.LUMINANCE,
        internalFormat: gl.LUMINANCE

    });
}


let offset = 1;
function createTileSprite(texture,palette, paletteId){
    let tids = [];
    for(var i = 0; i<32*32; i++){
        tids.push((offset%6)+1);
    }
    
    offset++;
    let mesh = new TileMesh(gl, 32, 32).create(tids);
    return new Renderable(mesh,texture, palette, paletteId);
}

function createSprite(texture, palette, paletteId, x,y,ox,oy,w,h){
    let sb = new QuadMesh(gl,1);
    sb.setQuad(0,x,y,x+w,y+h,ox,oy,ox+w,oy+w);
    sb.create();
    return new Renderable(sb,texture,palette,paletteId);
}

function createText(texture, palette, paletteId, fontInfo, text){
    let tMesh = new TextMesh(gl, 512, fontInfo).create(text);
    return new Renderable(tMesh, texture, palette, paletteId);
}

main();

setInterval(()=> {
    text.mesh.range = ((text.mesh.range+1)%text.mesh.text.length) 
}, 16);
