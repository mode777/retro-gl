define(["require", "exports", "./core/index"], function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function initWebGl() {
        var canvas = document.getElementById("canvas");
        var gl = twgl.getContext(canvas, {
            premultipliedAlpha: false,
            alpha: false,
            antialias: false
        });
        //twgl.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        return gl;
    }
    exports.initWebGl = initWebGl;
    function createTexture(gl, path) {
        return twgl.createTexture(gl, {
            src: path,
            min: gl.NEAREST,
            mag: gl.NEAREST
        });
    }
    exports.createTexture = createTexture;
    function createAlphaTexture(gl, path) {
        return twgl.createTexture(gl, {
            src: path,
            min: gl.NEAREST,
            mag: gl.NEAREST,
            format: gl.LUMINANCE,
            internalFormat: gl.LUMINANCE
        });
    }
    exports.createAlphaTexture = createAlphaTexture;
    var offset = 5;
    function createTileSprite(gl, texture, palette, paletteId) {
        var tids = [];
        for (var i = 0; i < 32 * 32; i++) {
            tids.push(1);
        }
        offset++;
        var mesh = new index_1.TileBuffer(gl, 32, 32).create(tids, 1);
        return new index_1.Renderable({
            buffer: mesh,
            texture: texture,
            palette: palette,
            paletteId: paletteId,
            //mode7: true,
            zSort: false
        });
    }
    exports.createTileSprite = createTileSprite;
    function createSprite(gl, texture, palette, paletteId, x, y, ox, oy, w, h) {
        var sb = new index_1.QuadBuffer(gl, 1);
        sb.setAttributes(0, x, y, x + w, y + h, ox, oy, ox + w, oy + w, index_1.MIN_Z, 0);
        sb.create();
        return new index_1.Renderable({
            buffer: sb,
            texture: texture,
            palette: palette,
            paletteId: paletteId,
            zSort: false
        });
    }
    exports.createSprite = createSprite;
});
//# sourceMappingURL=helpers.js.map