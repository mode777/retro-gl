define(["require", "exports", "./chunks", "./constants"], function (require, exports, chunks_1, constants_1) {
    "use strict";
    var PngReader = (function () {
        function PngReader(data) {
            this.data = data;
            this._dataView = new DataView(data);
            this._signature = new Uint8Array(data, 0, constants_1.SIGN_OFFSET);
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
        Object.defineProperty(PngReader.prototype, "imageColorComponents", {
            get: function () {
                switch (this._header.colorType) {
                    case constants_1.ColorType.Greyscale:
                    case constants_1.ColorType.Indexed:
                        return 1;
                    case constants_1.ColorType.TruecolorAlpha:
                        return 4;
                    case constants_1.ColorType.Truecolor:
                        return 3;
                    default:
                        throw "unsupported color format";
                }
            },
            enumerable: true,
            configurable: true
        });
        PngReader.prototype.createPixelData = function () {
            var w = this._header.width;
            var h = this._header.height;
            var c = this.imageColorComponents;
            var bytes = w * h * c;
            var pngData = this.imageData.decompress();
            var data = new Uint8Array(bytes);
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    var pngOffset = y * (w * c + 1) + x * c + 1;
                    var pxOffset = y * (w * c) + x * c;
                    for (var i = 0; i < c; i++) {
                        data[pxOffset + i] = pngData[pngOffset + i];
                    }
                }
            }
            return data;
        };
        PngReader.prototype.createPaletteDataRgba = function (size) {
            // rgba
            var c = 4;
            // rgb
            var cPng = 3;
            var data = new Uint8Array(size * c);
            var pngData = this._palette.data;
            for (var i = 0; i < this._palette.colors; i++) {
                var offsetPng = cPng * i;
                var offset = c * i;
                data[offset] = pngData[offsetPng];
                data[offset + 1] = pngData[offsetPng + 1];
                data[offset + 2] = pngData[offsetPng + 2];
                data[offset + 3] = 255;
            }
            return data;
        };
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
            var offset = constants_1.SIGN_OFFSET;
            while (offset < this._dataView.byteLength) {
                var chunk = this._readChunk(offset);
                if (chunk) {
                    switch (chunk.type) {
                        case constants_1.ChunkType.Header:
                            this._header = chunk;
                            break;
                        case constants_1.ChunkType.Palette:
                            this._palette = chunk;
                            break;
                        case constants_1.ChunkType.Data:
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
                case constants_1.ChunkType.Header:
                    return new chunks_1.HeaderChunk(length, type, data, crc);
                case constants_1.ChunkType.Palette:
                    return new chunks_1.PaletteChunk(length, type, data, crc);
                case constants_1.ChunkType.Data:
                    return new chunks_1.DataChunk(length, type, data, crc);
                case constants_1.ChunkType.End:
                    return new chunks_1.EndChunk(length, type, data, crc);
                default:
            }
        };
        return PngReader;
    }());
    exports.PngReader = PngReader;
});
//# sourceMappingURL=PngReader.js.map