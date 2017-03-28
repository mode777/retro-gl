define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChunkType;
    (function (ChunkType) {
        ChunkType[ChunkType["Header"] = 1229472850] = "Header";
        ChunkType[ChunkType["Palette"] = 1347179589] = "Palette";
        ChunkType[ChunkType["Data"] = 1229209940] = "Data";
        ChunkType[ChunkType["End"] = 1229278788] = "End";
    })(ChunkType = exports.ChunkType || (exports.ChunkType = {}));
    var ColorType;
    (function (ColorType) {
        ColorType[ColorType["Greyscale"] = 0] = "Greyscale";
        ColorType[ColorType["Truecolor"] = 2] = "Truecolor";
        ColorType[ColorType["Indexed"] = 3] = "Indexed";
        ColorType[ColorType["GreyscaleAlpha"] = 4] = "GreyscaleAlpha";
        ColorType[ColorType["TruecolorAlpha"] = 6] = "TruecolorAlpha";
    })(ColorType = exports.ColorType || (exports.ColorType = {}));
    exports.SIGN_OFFSET = 8;
    exports.LENGTH_LENGTH = 4;
    exports.TYPE_LENGTH = 4;
    exports.CRC_LENGTH = 4;
});
//# sourceMappingURL=constants.js.map