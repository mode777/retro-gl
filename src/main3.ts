import { initWebGl, createTexture } from './helpers';


(async function main(){
    let gl = initWebGl();

    let vs = await $.get("/res/shaders/basic_vs.glsl");
    let fs = await $.get("/res/shaders/basic_fs.glsl");
    let programInfo = twgl.createProgramInfo(gl, [vs, fs]);    
    
    var arrays = {
        position: [-0.9, -0.9, 0, 0.9, -0.9, 0, -0.9, 0.9, 0, -0.9, 0.9, 0, 0.9, -0.9, 0, 0.9, 0.9, 0],
        texcoord: [ 0,  1,    1,  1,     0, 0,     0, 0,    1,  1,    1, 0   ],        
    };
    var buffer = twgl.createBufferInfoFromArrays(gl, arrays);

    let vsPp = await $.get("/res/shaders/pp_vs.glsl");
    let fsPp = await $.get("/res/shaders/pp_fs.glsl");
    let programInfoPp = twgl.createProgramInfo(gl, [vsPp, fsPp]); 

    var arraysPp = {
        position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
        texcoord: [ 0,  1,    1,  1,     0, 0,     0, 0,    1,  1,    1, 0   ],        
    }
    var bufferPp = twgl.createBufferInfoFromArrays(gl, arraysPp);

    var fbi = twgl.createFramebufferInfo(gl);
    twgl.bindFramebufferInfo(gl, fbi);
    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, buffer);
    twgl.drawBufferInfo(gl, buffer);
    twgl.bindFramebufferInfo(gl);


    let offset = 0;

    function render(){
        gl.useProgram(programInfoPp.program);
        twgl.setBuffersAndAttributes(gl, programInfoPp, bufferPp);
        twgl.setUniforms(programInfoPp, {
            texture: fbi.attachments[0],
            offset: offset+=0.1
        });
        twgl.drawBufferInfo(gl, bufferPp);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
       

    
})();
