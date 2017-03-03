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
define(["require", "exports", "./QuadMesh", "./TileMesh", "./Renderer", "./Renderable"], function (require, exports, QuadMesh_1, TileMesh_1, Renderer_1, Renderable_1) {
    "use strict";
    var gl;
    var t = 0;
    var tiles;
    var renderer;
    // let tiles2: TileSprite;
    // let tiles3: TileSprite;
    // let tiles4: TileSprite;
    var sprite;
    function main() {
        return __awaiter(this, void 0, void 0, function () {
            function render(time) {
                stats.begin();
                t += 0.005;
                renderer.render();
                stats.end();
                requestAnimationFrame(render);
            }
            var canvas, stats, tileset, font, palette, vs, fs, programInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        canvas = document.getElementById("canvas");
                        stats = new Stats();
                        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
                        document.body.appendChild(stats.dom);
                        gl = twgl.getContext(canvas, {
                            premultipliedAlpha: false,
                            alpha: false,
                            antialias: false
                        });
                        //twgl.resizeCanvasToDisplaySize(gl.canvas);
                        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                        tileset = createAlphaTexture("/res/textures/tileset.png");
                        font = createAlphaTexture("/res/textures/font.png");
                        palette = createTexture("/res/textures/out_pal2.png");
                        return [4 /*yield*/, $.get("/res/shaders/8bit_vs.glsl")];
                    case 1:
                        vs = _a.sent();
                        return [4 /*yield*/, $.get("/res/shaders/8bit_fs.glsl")];
                    case 2:
                        fs = _a.sent();
                        programInfo = twgl.createProgramInfo(gl, [vs, fs]);
                        renderer = new Renderer_1.Renderer(gl, programInfo);
                        tiles = createTileSprite(tileset, palette, 5);
                        // tiles2 = createTileSprite();
                        // tiles3 = createTileSprite();
                        // tiles4 = createTileSprite();
                        sprite = createSprite(font, palette, 17, 0, 0, 0, 0, 255, 255);
                        renderer.renderList.push(tiles);
                        renderer.renderList.push(sprite);
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
    var offset = 1;
    function createTileSprite(texture, palette, paletteId) {
        var tids = [];
        for (var i = 0; i < 32 * 32; i++) {
            tids.push((offset % 6) + 1);
        }
        offset++;
        var mesh = new TileMesh_1.TileMesh(gl, 32, 32).create(tids);
        return new Renderable_1.Renderable(mesh, texture, palette, paletteId);
    }
    function createSprite(texture, palette, paletteId, x, y, ox, oy, w, h) {
        var sb = new QuadMesh_1.QuadMesh(gl, 1);
        sb.setQuad(0, x, y, x + w, y + h, ox, oy, ox + w, oy + w);
        sb.create();
        return new Renderable_1.Renderable(sb, texture, palette, paletteId);
    }
    main();
    setInterval(function () {
        // for(var i = 0; i<32*32; i++){
        //     tiles.setTileSeq(i, (i+offset)%7)
        //     tiles2.setTileSeq(i, (i+1+offset)%7)
        //     tiles3.setTileSeq(i, (i+2+offset)%7)
        //     tiles4.setTileSeq(i, (i+3+offset)%7)
        // }
        // tiles.setTile(offset%7,2,2);
        // tiles.setTile(offset%7,5,5);
        // tiles.setTile(offset%7,20,20);
        // tiles.update();    
        // tiles4.update();    
        // tiles2.update();    
        // tiles3.update();    
        offset++;
    }, 500);
});
//# sourceMappingURL=main.js.map