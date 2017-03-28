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
define(["require", "exports", "./lib/JQueryBinaryTransport", "./helpers", "./core/Renderer", "./GifReader/GifReader"], function (require, exports, binaryPlugin, helpers_1, Renderer_1, GifReader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    binaryPlugin.register();
    (function main() {
        return __awaiter(this, void 0, void 0, function () {
            function render() {
                renderer.render();
                requestAnimationFrame(render);
            }
            var gl, vs, fs, fs24, programInfo, renderer, buffer, gif;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gl = helpers_1.initWebGl();
                        return [4 /*yield*/, $.get("/res/shaders/8bit_vs.glsl")];
                    case 1:
                        vs = _a.sent();
                        return [4 /*yield*/, $.get("/res/shaders/8bit_fs.glsl")];
                    case 2:
                        fs = _a.sent();
                        return [4 /*yield*/, $.get("/res/shaders/24bit_fs.glsl")];
                    case 3:
                        fs24 = _a.sent();
                        programInfo = twgl.createProgramInfo(gl, [vs, fs]);
                        renderer = new Renderer_1.Renderer(gl, {
                            shader: programInfo,
                            palette: null,
                            texture: null,
                            paletteId: 0,
                            zSort: true,
                            blendMode: "none"
                        });
                        requestAnimationFrame(render);
                        return [4 /*yield*/, $.ajax({
                                url: "res/textures/megamanx2_2.gif",
                                type: "GET",
                                dataType: "binary",
                                responseType: "arraybuffer",
                                processData: false
                            })];
                    case 4:
                        buffer = _a.sent();
                        gif = new GifReader_1.GifReader(buffer);
                        console.log(gif);
                        return [2 /*return*/];
                }
            });
        });
    })();
});
//# sourceMappingURL=main4.js.map