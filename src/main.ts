import { TileLayer } from './TileLayer';
import { SpriteBatch } from './SpriteBatch';

let gl: WebGLRenderingContext;
let paletteId = 5;
let t = 0;
let tl: TileLayer;
let layerBuffer: twgl.BufferInfo;

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
    
    let vs = await $.get("/res/shaders/8bit_vs.glsl");
    let fs = await $.get("/res/shaders/8bit_fs.glsl");
    let programInfo = twgl.createProgramInfo(gl, [vs, fs]);

    tl = createTileLayer();
    let batch = new SpriteBatch(gl, 2);
    let quad = {
        x: 16,
        y: 0,
        width: 16,
        height: 16
    };
    let quad2 = {
        x: 32,
        y: 0,
        width: 16,
        height: 16
    };
    batch.setQuad(0, 50, 50, quad);
    batch.setQuad(1, 100, 50, quad2);

    console.log(batch);
    console.log(tl);

    layerBuffer = twgl.createBufferInfoFromArrays(gl, tl.arrays);
    console.log(layerBuffer);
    batch.createBuffers();

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
        stats.begin();

        t+=0.005;
        twgl.setUniforms(programInfo, {
            palette: palette,
            palette_id: paletteId,
            //time: 128 + Math.floor(Math.sin(t)*256)
        });
        
        //twgl.setBuffersAndAttributes(gl, programInfo, layerBuffer);
        //twgl.drawBufferInfo(gl, layerBuffer);
        
        batch.render(programInfo);

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