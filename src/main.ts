let gl: WebGLRenderingContext;
let paletteId = 1;
let t = 0;

async function main(){
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");

    gl = twgl.getContext(canvas, {
        premultipliedAlpha: false,
        alpha: false
    });

    //twgl.resizeCanvasToDisplaySize(gl.canvas);
    
    let vs = await $.get("/res/shaders/8bit_vs.glsl");
    let fs = await $.get("/res/shaders/8bit_fs.glsl");
    let programInfo = twgl.createProgramInfo(gl, [vs, fs]);

    let quad = createQuad();
    let texture = createAlphaTexture("/res/textures/out2.png");    
    let palette = createTexture("/res/textures/out_pal2.png");    

    let projMat = mat4.create();
    mat4.ortho(projMat, 0, gl.canvas.width, gl.canvas.height, 0, 1, -1); 

    function render(time) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        var uniforms = {
            texture: texture,
            palette: palette,
            palette_id: paletteId,
            proj: projMat,
            time: t+=0.001
        };

        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, quad);
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, quad);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function createQuad(){
    let arrays = {
        position: [
            0, 0, 0, 
            1024, 0, 0, 
            0, 1024, 0, 
            0, 1024, 0, 
            1024, 0, 0, 
            1024, 1024, 0
        ],
        texcoord: [
            0,0,
            1,0,
            0,1,
            0,1,
            1,0,
            1,1
        ]
    };
    return twgl.createBufferInfoFromArrays(gl, arrays);
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

main();