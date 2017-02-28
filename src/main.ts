import { TileLayer } from './TileLayer';
import { SpriteBatch } from './SpriteBatch';

let gl: WebGLRenderingContext;
let paletteId = 5;
let t = 0;
let tl: TileLayer;
let layerBuffer: twgl.BufferInfo;
let batch: twgl.BufferInfo;

async function main(){
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");

    gl = twgl.getContext(canvas, {
        premultipliedAlpha: false,
        alpha: false,
        antialias: false
    });

    //twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    let vs = await $.get("/res/shaders/8bit_vs.glsl");
    let fs = await $.get("/res/shaders/8bit_fs.glsl");
    let programInfo = twgl.createProgramInfo(gl, [vs, fs]);

    tl = createTileLayer();
    let b = new SpriteBatch(2);
    b.setPosition(0,16,32,32,48);
    b.setTexture(0, 16,0,32,16);

    b.setPosition(1,0,0,200,150);
    b.setTexture(1, 32,0,48,16);
    //b.setTexture(1, 240-16,240-16,255-16,255-16);

    console.log(b);
    console.log(tl);

    layerBuffer = twgl.createBufferInfoFromArrays(gl, tl.arrays);
    batch = twgl.createBufferInfoFromArrays(gl, b.arrays);

    let texture = createAlphaTexture("/res/textures/tileset.png");    
    let palette = createTexture("/res/textures/out_pal2.png");    

    let projMat = mat4.create();
    mat4.ortho(projMat, 0, gl.canvas.width, gl.canvas.height, 0, 1, -1); 

    gl.useProgram(programInfo.program);
    twgl.setUniforms(programInfo, {
        texture: texture,
        palette: palette,
        palette_id: paletteId,
        proj: projMat,
        time: t
    });


    function render(time) {
        t+=0.005;
        twgl.setUniforms(programInfo, {
            palette: palette,
            palette_id: paletteId,
            time: 128 + Math.floor(Math.sin(t)*256)
        });
        
        twgl.setBuffersAndAttributes(gl, programInfo, layerBuffer);
        twgl.drawBufferInfo(gl, layerBuffer);
        
        twgl.setBuffersAndAttributes(gl, programInfo, batch);
        twgl.drawBufferInfo(gl, batch);

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

function createTileLayer(){
    let tids = [];
    for(var i = 0; i<32*32; i++){
        tids.push(i%7);
    }
    
    return new TileLayer(gl).create(tids);
}

main();

let offset = 0;
// setInterval(()=> {
//     for(var i = 0; i<32*32; i++){
//         tl.setTileSeq((i+offset)%7, i);
//     }
//     offset++;
//     twgl.setAttribInfoBufferFromArray(gl, layerBuffer.attribs["texcoord"], tl.arrays["texcoord"]);
// }, 50);