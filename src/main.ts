import { TileLayer } from './TileLayer';

let gl: WebGLRenderingContext;
let paletteId = 5;
let t = 0;
let tl: TileLayer;
let layerBuffer: twgl.BufferInfo;

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

    tl = creatTileLayer();
    console.log(tl);

    layerBuffer = twgl.createBufferInfoFromArrays(gl, tl.arrays);
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
        t+=0.001;
        twgl.setBuffersAndAttributes(gl, programInfo, layerBuffer);
        twgl.setUniforms(programInfo, {
            palette: palette,
            palette_id: paletteId,
            time: 128 + Math.floor(Math.sin(t)*256)
        });
        twgl.drawBufferInfo(gl, layerBuffer);

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

function creatTileLayer(){
    let tids = [];
    for(var i = 0; i<32*32; i++){
        tids.push(i%7);
    }
    
    return new TileLayer(gl).create(tids);
}

main();

let offset = 0;
setInterval(()=> {
    for(var i = 0; i<32*32; i++){
        tl.setTileSeq((i+offset)%7, i);
    }
    offset++;
    twgl.setAttribInfoBufferFromArray(gl, layerBuffer.attribs["texcoord"], tl.arrays["texcoord"]);
}, 50);