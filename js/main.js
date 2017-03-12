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
define(["require", "exports", "./QuadBuffer", "./TileBuffer", "./Renderer", "./Renderable", "./TextBuffer", "./constants"], function (require, exports, QuadBuffer_1, TileBuffer_1, Renderer_1, Renderable_1, TextBuffer_1, constants_1) {
    "use strict";
    var gl;
    var t = 0;
    var renderer;
    var tiles;
    var text;
    function main() {
        return __awaiter(this, void 0, void 0, function () {
            function render(time) {
                stats.begin();
                t += 0.1;
                a *= 0.9;
                sprites.forEach(function (s) { return s.transform.y = Math.sin(s.x / 4 + t) * 3; });
                renderer.render();
                stats.end();
                requestAnimationFrame(render);
            }
            var stats, tileset, font, palette, fontInfo, vs, fs, programInfo, fntBuffer, sprites, i, sprite, statsBuffer, statsRend, a;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stats = new Stats();
                        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
                        document.body.appendChild(stats.dom);
                        initWebGl();
                        tileset = createAlphaTexture("/res/textures/tileset.png");
                        font = createAlphaTexture("/res/textures/font.png");
                        palette = createTexture("/res/textures/pal_new.png");
                        return [4 /*yield*/, $.getJSON("/res/fonts/font.json")];
                    case 1:
                        fontInfo = _a.sent();
                        return [4 /*yield*/, $.get("/res/shaders/8bit_vs.glsl")];
                    case 2:
                        vs = _a.sent();
                        return [4 /*yield*/, $.get("/res/shaders/8bit_fs.glsl")];
                    case 3:
                        fs = _a.sent();
                        programInfo = twgl.createProgramInfo(gl, [vs, fs]);
                        renderer = new Renderer_1.Renderer(gl, {
                            shader: programInfo,
                            palette: palette,
                            texture: font,
                            paletteId: 0,
                            zSort: true,
                            blendMode: "none"
                        });
                        tiles = createTileSprite(tileset, palette, 1);
                        fntBuffer = new TextBuffer_1.TextBuffer(gl, 128, fontInfo).create();
                        fntBuffer.write("Start Game", 320, 130, 50, 4, 4);
                        fntBuffer.write("Load Game", 320, 130, 50 + 16, 4);
                        fntBuffer.write("Settings", 320, 130, 50 + 16 * 2, 4);
                        fntBuffer.write("Quit", 320, 130, 50 + 16 * 3, 4);
                        text = new Renderable_1.Renderable({
                            buffer: fntBuffer,
                            texture: font
                        });
                        sprites = [];
                        for (i = 0; i < "Start Game".length; i++) {
                            sprite = fntBuffer.createSprite(i);
                            sprites.push(sprite);
                        }
                        statsBuffer = new TextBuffer_1.TextBuffer(gl, 33, fontInfo).create();
                        statsRend = new Renderable_1.Renderable({
                            buffer: statsBuffer,
                            texture: font
                        });
                        renderer.renderList.push(text);
                        renderer.renderList.push(tiles);
                        a = .5;
                        requestAnimationFrame(render);
                        setInterval(function () {
                        }, 16);
                        return [2 /*return*/];
                }
            });
        });
    }
    function initWebGl() {
        var canvas = document.getElementById("canvas");
        gl = twgl.getContext(canvas, {
            premultipliedAlpha: false,
            alpha: false,
            antialias: false
        });
        //twgl.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
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
    var offset = 5;
    function createTileSprite(texture, palette, paletteId) {
        var tids = [];
        for (var i = 0; i < 32 * 32; i++) {
            tids.push(6);
        }
        offset++;
        var mesh = new TileBuffer_1.TileBuffer(gl, 32, 32).create(tids, 1);
        return new Renderable_1.Renderable({
            buffer: mesh,
            texture: texture,
            palette: palette,
            paletteId: paletteId
        });
    }
    function createSprite(texture, palette, paletteId, x, y, ox, oy, w, h) {
        var sb = new QuadBuffer_1.QuadBuffer(gl, 1);
        sb.setAttributes(0, x, y, x + w, y + h, ox, oy, ox + w, oy + w, constants_1.MIN_Z, 0);
        sb.create();
        return new Renderable_1.Renderable({
            buffer: sb,
            texture: texture,
            palette: palette,
            paletteId: paletteId
        });
    }
    main();
    var o = mat4.ortho(mat4.create(), 0, 320, 180, 0, -256, 0);
    var p = mat4.perspective(mat4.create(), 1, 1, 0.1, 100);
    var v = mat4.lookAt(mat4.create(), vec3.fromValues(0, 0, 0), vec3.create(), vec3.fromValues(0, 1, 0));
    var res = mat4.create();
    //let res = o;
    mat4.mul(res, p, v);
    mat4.mul(res, res, o);
    var p1 = vec3.fromValues(0, 0, 1);
    var p2 = vec3.fromValues(320, 0, 1);
    var p3 = vec3.fromValues(320, 180, 1);
    var p4 = vec3.fromValues(0, 180, 1);
    vec3.transformMat4(p1, p1, res);
    vec3.transformMat4(p2, p2, res);
    vec3.transformMat4(p3, p3, res);
    vec3.transformMat4(p4, p4, res);
    console.log(p1, p2, p3, p4);
});
//# sourceMappingURL=main.js.map