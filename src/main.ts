import { QuadMesh } from './QuadMesh';
import { TileMesh } from './TileMesh';
import { Renderer } from './Renderer';
import { Renderable } from './Renderable';

let gl: WebGLRenderingContext;
let t = 0;
let tiles: Renderable<TileMesh>;
let renderer: Renderer;
// let tiles2: TileSprite;
// let tiles3: TileSprite;
// let tiles4: TileSprite;

let sprite: Renderable<QuadMesh>;

async function main(){
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");

    var stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    gl = twgl.getContext(canvas, {
        premultipliedAlpha: false,
        alpha: false,
        antialias: false
    });

    //twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    let tileset = createAlphaTexture("/res/textures/tileset.png");    
    let font = createAlphaTexture("/res/textures/font.png");    
    let palette = createTexture("/res/textures/out_pal2.png");    
 
    let vs = await $.get("/res/shaders/8bit_vs.glsl");
    let fs = await $.get("/res/shaders/8bit_fs.glsl");
    let programInfo = twgl.createProgramInfo(gl, [vs, fs]);
    renderer = new Renderer(gl, programInfo);

    tiles = createTileSprite(tileset, palette, 5);
    // tiles2 = createTileSprite();
    // tiles3 = createTileSprite();
    // tiles4 = createTileSprite();
    sprite = createSprite(font, palette, 17, 0,0,0,0,255,255);

    renderer.renderList.push(tiles);
    renderer.renderList.push(sprite);

    function render(time) {
        stats.begin();

        t+=0.005;
        renderer.render();

        stats.end();
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
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

main();

setInterval(()=> {
    // for(var i = 0; i<32*32; i++){
    //     tiles.setTileSeq(i, (i+offset)%7)
    //     tiles2.setTileSeq(i, (i+1+offset)%7)
    //     tiles3.setTileSeq(i, (i+2+offset)%7)
    //     tiles4.setTileSeq(i, (i+3+offset)%7)
    // }

    // tiles.setTile(offset%7,2,2);
    // tiles.setTile(offset%7,5,5);
    // tiles.setTile(offset%7,20,20);
    
    // tiles.update();    
    // tiles4.update();    
    // tiles2.update();    
    // tiles3.update();    
    
    offset++;
}, 500);
