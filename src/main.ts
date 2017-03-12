import { QuadBuffer } from './QuadBuffer';
import { TileBuffer } from './TileBuffer';
import { Renderer } from './Renderer';
import { Renderable } from './Renderable';
import { TextBuffer } from './TextBuffer';
import { FontInfo, Sprite } from './interfaces';
import { MIN_Z, VERTEX_SIZE, VERTICES_QUAD, QUAD_SIZE } from './constants';
import { Quad } from './Quad';

let gl: WebGLRenderingContext;
let t = 0;
let renderer: Renderer;

let tiles: Renderable<TileBuffer>;
let text: Renderable<TextBuffer>;

async function main(){
    
    var stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    initWebGl();
    
    let tileset = createAlphaTexture("/res/textures/tileset.png");    
    let font = createAlphaTexture("/res/textures/font.png");    
    let palette = createTexture("/res/textures/pal_new.png");   
    let fontInfo = await $.getJSON("/res/fonts/font.json");

    let vs = await $.get("/res/shaders/8bit_vs.glsl");
    let fs = await $.get("/res/shaders/8bit_fs.glsl");
    let programInfo = twgl.createProgramInfo(gl, [vs, fs]);
    renderer = new Renderer(gl, {
        shader: programInfo,
        palette: palette,
        texture: font,
        paletteId: 0,
        zSort: true,
        blendMode: "none"
    });

    tiles = createTileSprite(tileset, palette, 1);
    //let tiles2 = createTileSprite(tileset, palette, 1);
    
    let fntBuffer = new TextBuffer(gl, 128, fontInfo).create();
    fntBuffer.write("Start Game", 320, 130,50,4,4);
    fntBuffer.write("Load Game", 320, 130,50+16,4);
    fntBuffer.write("Settings", 320, 130,50+16*2,4);
    fntBuffer.write("Quit", 320, 130,50+16*3,4);    
    text = new Renderable({
        buffer: fntBuffer,
        texture: font
    });

    let sprites: Sprite[] = [];
    for (var i = 0; i < "Start Game".length; i++) {
        let sprite = fntBuffer.createSprite(i);
        sprites.push(sprite);
    }

    let statsBuffer = new TextBuffer(gl, 33, fontInfo).create();
    let statsRend = new Renderable({
        buffer: statsBuffer,
        texture: font
    });

    renderer.renderList.push(tiles);
    renderer.renderList.push(text);
    let a = .5;

    function render(time) {
        stats.begin();
        
        t+=0.1;
        a*=0.9;
        sprites.forEach(s => s.transform.y = Math.sin(s.x/4+t)*3);

        renderer.render();
        
        stats.end();
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    setInterval(()=> {

    }, 16);
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


let offset = 5;
function createTileSprite(texture,palette, paletteId){
    let tids = [];
    for(var i = 0; i<32*32; i++){
        tids.push(3 + i%4);
    }
    
    offset++;
    
    let mesh = new TileBuffer(gl, 32, 32).create(tids, 1);
    
    return new Renderable({
        buffer: mesh,
        texture: texture,
        palette: palette,
        paletteId: paletteId,
        mode7: true,
        zSort: false
    });
}

function createSprite(texture, palette, paletteId, x,y,ox,oy,w,h){
    let sb = new QuadBuffer(gl,1);
    sb.setAttributes(0,x,y,x+w,y+h,ox,oy,ox+w,oy+w, MIN_Z, 0);
    sb.create();
    return new Renderable({
        buffer:sb, 
        texture: texture, 
        palette: palette, 
        paletteId: paletteId,
        zSort: false
    });
}

main();
