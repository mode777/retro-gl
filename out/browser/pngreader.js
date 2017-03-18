var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
define(["require", "exports", "./lib/JQueryBinaryTransport"], function (require, exports, binaryPlugin) {
    "use strict";
    var SIGN_OFFSET = 8;
    var LENGTH_LENGTH = 4;
    var TYPE_LENGTH = 4;
    var CRC_LENGTH = 4;
    var PngChunk = (function () {
        function PngChunk(_length, _type, _data, _crc) {
            this._length = _length;
            this._type = _type;
            this._data = _data;
            this._crc = _crc;
            if (_length != _data.length)
                throw "Invalid length";
        }
        Object.defineProperty(PngChunk.prototype, "dataLength", {
            get: function () {
                return this._length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PngChunk.prototype, "totalLength", {
            get: function () {
                return this._length + LENGTH_LENGTH + TYPE_LENGTH + CRC_LENGTH;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PngChunk.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PngChunk.prototype, "crc", {
            get: function () {
                return this._crc;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PngChunk.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        return PngChunk;
    }());
    exports.PngChunk = PngChunk;
    var HeaderChunk = (function (_super) {
        __extends(HeaderChunk, _super);
        function HeaderChunk(length, type, data, crc) {
            var _this = _super.call(this, length, type, data, crc) || this;
            if (type != ChunkType.Header)
                throw "Not a header chunk";
            _this._read();
            return _this;
        }
        HeaderChunk.prototype._read = function () {
            var view = new DataView(this._data.buffer, this._data.byteOffset, this._data.byteLength);
            this._width = view.getUint32(0, false);
            this._height = view.getUint32(4, false);
            this._bitDepth = view.getUint8(8);
            this._colorType = view.getUint8(9);
            this._compressionMethod = view.getUint8(10);
            this._filterMethod = view.getUint8(11);
            this._interlace = view.getUint8(12) == 1 ? true : false;
        };
        Object.defineProperty(HeaderChunk.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderChunk.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderChunk.prototype, "bitDepth", {
            get: function () {
                return this._bitDepth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderChunk.prototype, "colorType", {
            get: function () {
                return this._colorType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderChunk.prototype, "interlaced", {
            get: function () {
                return this._interlace;
            },
            enumerable: true,
            configurable: true
        });
        return HeaderChunk;
    }(PngChunk));
    exports.HeaderChunk = HeaderChunk;
    var PaletteChunk = (function (_super) {
        __extends(PaletteChunk, _super);
        function PaletteChunk(length, type, data, crc) {
            var _this = _super.call(this, length, type, data, crc) || this;
            if (type != ChunkType.Palette)
                throw "Not a palette chunk";
            if (data.length % 3 != 0)
                throw "Invalid palette length";
            return _this;
        }
        Object.defineProperty(PaletteChunk.prototype, "colors", {
            get: function () {
                return this._data.length / 3;
            },
            enumerable: true,
            configurable: true
        });
        PaletteChunk.prototype.getColor = function (id) {
            return new Uint8Array(this._data.buffer, this._data.byteOffset + id * 3, 3);
        };
        return PaletteChunk;
    }(PngChunk));
    exports.PaletteChunk = PaletteChunk;
    var DataChunk = (function (_super) {
        __extends(DataChunk, _super);
        function DataChunk(length, type, data, crc) {
            var _this = _super.call(this, length, type, data, crc) || this;
            if (type != ChunkType.Data)
                throw "Not a data chunk";
            return _this;
        }
        DataChunk.prototype.decompress = function (width, height) {
            // TODO: Support other modes / bit depths
            var decoded = pako.inflate(this._data);
            // First byte in row is filter --> remove
            var rawData = new Uint8Array(width * height);
            var rPtr = 0;
            for (var i = 0; i < decoded.length; i++) {
                if (i % (width + 1) != 0) {
                    rawData[rPtr] = decoded[i];
                    rPtr++;
                }
            }
            return rawData;
        };
        return DataChunk;
    }(PngChunk));
    exports.DataChunk = DataChunk;
    var EndChunk = (function (_super) {
        __extends(EndChunk, _super);
        function EndChunk(length, type, data, crc) {
            var _this = _super.call(this, length, type, data, crc) || this;
            if (type != ChunkType.End)
                throw "Not a end chunk";
            return _this;
        }
        return EndChunk;
    }(PngChunk));
    exports.EndChunk = EndChunk;
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
        ColorType[ColorType["TrueColor"] = 2] = "TrueColor";
        ColorType[ColorType["Indexed"] = 3] = "Indexed";
        ColorType[ColorType["GreyscaleAlpha"] = 4] = "GreyscaleAlpha";
        ColorType[ColorType["TruecolorAlpha"] = 6] = "TruecolorAlpha";
    })(ColorType = exports.ColorType || (exports.ColorType = {}));
    var PngReader = (function () {
        function PngReader(data) {
            this.data = data;
            this._dataView = new DataView(data);
            this._signature = new Uint8Array(data, 0, SIGN_OFFSET);
            this._read();
        }
        Object.defineProperty(PngReader.prototype, "header", {
            get: function () {
                return this._header;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PngReader.prototype, "palette", {
            get: function () {
                return this._palette;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PngReader.prototype, "imageData", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        PngReader.prototype._read = function () {
            this._checkSignature();
            this._readChunks();
        };
        PngReader.prototype._checkSignature = function () {
            var sig = this._signature;
            if (!(sig[0] == 137
                && sig[1] == 80
                && sig[2] == 78
                && sig[3] == 71
                && sig[4] == 13
                && sig[5] == 10
                && sig[6] == 26
                && sig[7] == 10))
                throw "Data is not a png";
        };
        PngReader.prototype._readChunks = function () {
            var offset = SIGN_OFFSET;
            while (offset < this._dataView.byteLength) {
                var chunk = this._readChunk(offset);
                if (chunk) {
                    switch (chunk.type) {
                        case ChunkType.Header:
                            this._header = chunk;
                            break;
                        case ChunkType.Palette:
                            this._palette = chunk;
                            break;
                        case ChunkType.Data:
                            this._data = chunk;
                            break;
                        default:
                            break;
                    }
                    offset += chunk.totalLength;
                }
            }
        };
        PngReader.prototype._readChunk = function (offset) {
            var view = this._dataView;
            var length = view.getUint32(offset, false);
            offset += 4;
            var type = view.getUint32(offset, false);
            offset += 4;
            var data = new Uint8Array(this._dataView.buffer, offset, length);
            offset += length;
            var crc = view.getUint32(offset, false);
            switch (type) {
                case ChunkType.Header:
                    return new HeaderChunk(length, type, data, crc);
                case ChunkType.Palette:
                    return new PaletteChunk(length, type, data, crc);
                case ChunkType.Data:
                    return new DataChunk(length, type, data, crc);
                case ChunkType.End:
                    return new EndChunk(length, type, data, crc);
                default:
            }
        };
        return PngReader;
    }());
    exports.PngReader = PngReader;
    function main() {
        return __awaiter(this, void 0, void 0, function () {
            var buffer, png;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        binaryPlugin.register();
                        return [4 /*yield*/, $.ajax({
                                url: "res/textures/8bit_test.png",
                                type: "GET",
                                dataType: "binary",
                                responseType: "arraybuffer",
                                processData: false
                            })];
                    case 1:
                        buffer = _a.sent();
                        png = new PngReader(buffer);
                        console.log(png.header);
                        console.log(png.palette);
                        console.log(png.palette.getColor(4));
                        console.log(png.imageData.decompress(png.header.width, png.header.height));
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.main = main;
});
//# sourceMappingURL=pngreader.js.map