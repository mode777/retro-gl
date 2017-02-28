var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "./TileLayer", "./SpriteBatch"], function (require, exports, TileLayer_1, SpriteBatch_1) {
    "use strict";
    var gl;
    var paletteId = 5;
    var t = 0;
    var tl;
    var layerBuffer;
    var batch;
    function main() {
        return __awaiter(this, void 0, void 0, function () {
            function render(time) {
                t += 0.005;
                twgl.setUniforms(programInfo, {
                    palette: palette,
                    palette_id: paletteId,
                    time: 128 + Math.floor(Math.sin(t) * 256)
                });
                twgl.setBuffersAndAttributes(gl, programInfo, layerBuffer);
                twgl.drawBufferInfo(gl, layerBuffer);
                twgl.setBuffersAndAttributes(gl, programInfo, batch);
                twgl.drawBufferInfo(gl, batch);
                requestAnimationFrame(render);
            }
            var canvas, vs, fs, programInfo, b, texture, palette, projMat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        canvas = document.getElementById("canvas");
                        gl = twgl.getContext(canvas, {
                            premultipliedAlpha: false,
                            alpha: false,
                            antialias: false
                        });
                        //twgl.resizeCanvasToDisplaySize(gl.canvas);
                        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                        return [4 /*yield*/, $.get("/res/shaders/8bit_vs.glsl")];
                    case 1:
                        vs = _a.sent();
                        return [4 /*yield*/, $.get("/res/shaders/8bit_fs.glsl")];
                    case 2:
                        fs = _a.sent();
                        programInfo = twgl.createProgramInfo(gl, [vs, fs]);
                        tl = createTileLayer();
                        b = new SpriteBatch_1.SpriteBatch(2);
                        b.setPosition(0, 16, 32, 32, 48);
                        b.setTexture(0, 16, 0, 32, 16);
                        b.setPosition(1, 0, 0, 200, 150);
                        b.setTexture(1, 32, 0, 48, 16);
                        //b.setTexture(1, 240-16,240-16,255-16,255-16);
                        console.log(b);
                        console.log(tl);
                        layerBuffer = twgl.createBufferInfoFromArrays(gl, tl.arrays);
                        batch = twgl.createBufferInfoFromArrays(gl, b.arrays);
                        texture = createAlphaTexture("/res/textures/tileset.png");
                        palette = createTexture("/res/textures/out_pal2.png");
                        projMat = mat4.create();
                        mat4.ortho(projMat, 0, gl.canvas.width, gl.canvas.height, 0, 1, -1);
                        gl.useProgram(programInfo.program);
                        twgl.setUniforms(programInfo, {
                            texture: texture,
                            palette: palette,
                            palette_id: paletteId,
                            proj: projMat,
                            time: t
                        });
                        requestAnimationFrame(render);
                        return [2 /*return*/];
                }
            });
        });
    }
    function createTexture(path) {
        return twgl.createTexture(gl, {
            src: path,
            min: gl.NEAREST,
            mag: gl.NEAREST
        });
    }
    function createAlphaTexture(path) {
        return twgl.createTexture(gl, {
            src: path,
            min: gl.NEAREST,
            mag: gl.NEAREST,
            format: gl.LUMINANCE,
            internalFormat: gl.LUMINANCE
        });
    }
    function createTileLayer() {
        var tids = [];
        for (var i = 0; i < 32 * 32; i++) {
            tids.push(i % 7);
        }
        return new TileLayer_1.TileLayer(gl).create(tids);
    }
    main();
    var offset = 0;
});
// setInterval(()=> {
//     for(var i = 0; i<32*32; i++){
//         tl.setTileSeq((i+offset)%7, i);
//     }
//     offset++;
//     twgl.setAttribInfoBufferFromArray(gl, layerBuffer.attribs["texcoord"], tl.arrays["texcoord"]);
// }, 50); 
//# sourceMappingURL=main.js.map