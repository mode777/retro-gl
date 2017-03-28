var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./constants"], function (require, exports, constants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
                return this._length + constants_1.LENGTH_LENGTH + constants_1.TYPE_LENGTH + constants_1.CRC_LENGTH;
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
            if (type != constants_1.ChunkType.Header)
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
            if (type != constants_1.ChunkType.Palette)
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
            if (type != constants_1.ChunkType.Data)
                throw "Not a data chunk";
            return _this;
        }
        DataChunk.prototype.decompress = function () {
            return pako.inflate(this._data);
        };
        return DataChunk;
    }(PngChunk));
    exports.DataChunk = DataChunk;
    var EndChunk = (function (_super) {
        __extends(EndChunk, _super);
        function EndChunk(length, type, data, crc) {
            var _this = _super.call(this, length, type, data, crc) || this;
            if (type != constants_1.ChunkType.End)
                throw "Not a end chunk";
            return _this;
        }
        return EndChunk;
    }(PngChunk));
    exports.EndChunk = EndChunk;
});
//# sourceMappingURL=chunks.js.map