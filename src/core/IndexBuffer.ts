import { createBufferFromTypedArray } from "twgl.js";
import { INDICES_QUAD, VERTICES_QUAD, MAX_VERTICES } from "./constants";

// define a global buffer for quads
let indexBuffer: WebGLBuffer;
let elementType: number;

function init(gl: WebGLRenderingContext){
    elementType = gl.UNSIGNED_SHORT;

    const indices = new Uint16Array(MAX_VERTICES * INDICES_QUAD);
    const max = MAX_VERTICES * VERTICES_QUAD;

    let vertex = 0;
    for(let i = 0; i < max; i += INDICES_QUAD){
        /*  *1---*2
            |  /  |
            *4---*3  */
        indices[i  ] = vertex;     // 1
        indices[i+1] = vertex + 1; // 2
        indices[i+2] = vertex + 3; // 4

        indices[i+3] = vertex + 3; // 4
        indices[i+4] = vertex + 1; // 2
        indices[i+5] = vertex + 2; // 3

        vertex += VERTICES_QUAD;
    }

    indexBuffer = createBufferFromTypedArray(
        gl, indices, gl.ELEMENT_ARRAY_BUFFER);
}

export class IndexBuffer{

    constructor(gl: WebGLRenderingContext){
        if(!indexBuffer){
            init(gl);
        }
    }

    get buffer(){
        return indexBuffer;
    }

    get elementType() {
        return elementType;
    }
}