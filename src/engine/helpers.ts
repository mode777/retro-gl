import * as twgl from "twgl.js";

export function createGlContext(canvas: HTMLCanvasElement){
    const gl = twgl.getContext(canvas, {
        premultipliedAlpha: false,
        alpha: false,
        antialias: false
    });
    twgl.resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    return gl;
}

// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export function createUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }); 
}
