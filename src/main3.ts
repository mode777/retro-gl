import { initWebGl, createTexture } from './helpers';


(async function main(){
    let gl = initWebGl();

    let vs = await $.get("/res/shaders/basic_vs.glsl");
    let fs = await $.get("/res/shaders/basic_fs.glsl");
    let programInfo = twgl.createProgramInfo(gl, [vs, fs]);    
    
    var arrays = {
        position: [-1.1, -1.1, 0, 1.1, -1.1, 0, -1.1, 1.1, 0, -1.1, 1.1, 0, 1.1, -1.1, 0, 1.1, 1.1, 0],
        texcoord: [ 0,  1,    1,  1,     0, 0,     0, 0,    1,  1,    1, 0   ],        
    };
    var buffer = twgl.createBufferInfoFromArrays(gl, arrays);

    let vsPp = await $.get("/res/shaders/pp_vs.glsl");
    let fsPp = await $.get("/res/shaders/pp_fs.glsl");
    let programInfoPp = twgl.createProgramInfo(gl, [vsPp, fsPp]); 

    var arraysPp = {
        position: [-1.5, -1.5, 0, 1.5, -1.5, 0, -1.5, 1.5, 0, -1.5, 1.5, 0, 1.5, -1.5, 0, 1.5, 1.5, 0],
        texcoord: [ 0,  1,    1,  1,     0, 0,     0, 0,    1,  1,    1, 0   ],        
    }
    var bufferPp = twgl.createBufferInfoFromArrays(gl, arraysPp);

    var fbi = twgl.createFramebufferInfo(gl, [
        {
            attach: gl.COLOR_ATTACHMENT0,
            mag: gl.NEAREST,
            min: gl.NEAREST
        },
        {
            attach: gl.DEPTH_STENCIL_ATTACHMENT,
            format: gl.DEPTH_STENCIL
        }
    ]);
    console.log(fbi);


    let offset = 0;
    let offsetPp = 0;
    function render(){
        twgl.bindFramebufferInfo(gl, fbi);
        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, buffer);
        twgl.setUniforms(programInfo, {
            offset: offset+=0.001
        });
        twgl.drawBufferInfo(gl, buffer);
        twgl.bindFramebufferInfo(gl);
        
        gl.useProgram(programInfoPp.program);
        twgl.setBuffersAndAttributes(gl, programInfoPp, bufferPp);
        twgl.setUniforms(programInfoPp, {
            texture: fbi.attachments[0],
            offset: offsetPp+=0.1
        });
        twgl.drawBufferInfo(gl, bufferPp);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
       

    
})();
