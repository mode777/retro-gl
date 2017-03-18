define(["require", "exports"], function (require, exports) {
    "use strict";
    var PNG = (function () {
        function PNG() {
            // initialize all members to keep the same hidden class
            this._width = 0;
            this._height = 0;
            this._bitDepth = 0;
            this._colorType = 0;
            this._compressionMethod = 0;
            this._filterMethod = 0;
            this._interlaceMethod = 0;
            this._colors = 0;
            this._alpha = false;
            this._pixelBits = 0;
            this._palette = null;
            this._pixels = null;
        }
        ;
        Object.defineProperty(PNG.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (width) {
                this._width = width;
            },
            enumerable: true,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(PNG.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (height) {
                this._height = height;
            },
            enumerable: true,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(PNG.prototype, "bitDepth", {
            get: function () {
                return this._bitDepth;
            },
            set: function (bitDepth) {
                if ([2, 4, 8, 16].indexOf(bitDepth) === -1) {
                    throw new Error("invalid bith depth " + bitDepth);
                }
                this._bitDepth = bitDepth;
            },
            enumerable: true,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(PNG.prototype, "colorType", {
            get: function () {
                return this._colorType;
            },
            set: function (colorType) {
                //   Color    Allowed    Interpretation
                //   Type    Bit Depths
                //
                //   0       1,2,4,8,16  Each pixel is a grayscale sample.
                //
                //   2       8,16        Each pixel is an R,G,B triple.
                //
                //   3       1,2,4,8     Each pixel is a palette index;
                //                       a PLTE chunk must appear.
                //
                //   4       8,16        Each pixel is a grayscale sample,
                //                       followed by an alpha sample.
                //
                //   6       8,16        Each pixel is an R,G,B triple,
                //                       followed by an alpha sample.
                var colors = 0, alpha = false;
                switch (colorType) {
                    case 0:
                        colors = 1;
                        break;
                    case 2:
                        colors = 3;
                        break;
                    case 3:
                        colors = 1;
                        break;
                    case 4:
                        colors = 2;
                        alpha = true;
                        break;
                    case 6:
                        colors = 4;
                        alpha = true;
                        break;
                    default: throw new Error("invalid color type");
                }
                this._colors = colors;
                this._alpha = alpha;
                this._colorType = colorType;
            },
            enumerable: true,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(PNG.prototype, "colors", {
            get: function () {
                return this._colors;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PNG.prototype, "compressionMethod", {
            get: function () {
                return this._compressionMethod;
            },
            set: function (compressionMethod) {
                if (compressionMethod !== 0) {
                    throw new Error("invalid compression method " + compressionMethod);
                }
                this._compressionMethod = compressionMethod;
            },
            enumerable: true,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(PNG.prototype, "filterMethod", {
            get: function () {
                return this._filterMethod;
            },
            set: function (filterMethod) {
                if (filterMethod !== 0) {
                    throw new Error("invalid filter method " + filterMethod);
                }
                this._filterMethod = filterMethod;
            },
            enumerable: true,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(PNG.prototype, "interlaceMethod", {
            get: function () {
                return this._interlaceMethod;
            },
            set: function (interlaceMethod) {
                if (interlaceMethod !== 0 && interlaceMethod !== 1) {
                    throw new Error("invalid interlace method " + interlaceMethod);
                }
                this._interlaceMethod = interlaceMethod;
            },
            enumerable: true,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(PNG.prototype, "palette", {
            get: function () {
                return this._palette;
            },
            set: function (palette) {
                if (palette.length % 3 !== 0) {
                    throw new Error("incorrect PLTE chunk length");
                }
                if (palette.length > (Math.pow(2, this._bitDepth) * 3)) {
                    throw new Error("palette has more colors than 2^bitdepth");
                }
                this._palette = palette;
            },
            enumerable: true,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(PNG.prototype, "pixels", {
            get: function () {
                return this._pixels;
            },
            set: function (pixels) {
                this._pixels = pixels;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * get the pixel color on a certain location in a normalized way
         * result is an array: [red, green, blue, alpha]
         */
        PNG.prototype.getPixel = function (x, y) {
            if (!this._pixels)
                throw new Error("pixel data is empty");
            if (x >= this._width || y >= this._height) {
                throw new Error("x,y position out of bound");
            }
            var i = this._colors * this._bitDepth / 8 * (y * this._width + x);
            var pixels = this._pixels;
            switch (this._colorType) {
                case 0: return [pixels[i], pixels[i], pixels[i], 255];
                case 2: return [pixels[i], pixels[i + 1], pixels[i + 2], 255];
                case 3: return [
                    this._palette[pixels[i] * 3 + 0],
                    this._palette[pixels[i] * 3 + 1],
                    this._palette[pixels[i] * 3 + 2],
                    255
                ];
                case 4: return [pixels[i], pixels[i], pixels[i], pixels[i + 1]];
                case 6: return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
            }
        };
        ;
        return PNG;
    }());
    exports.PNG = PNG;
});
//# sourceMappingURL=PNG.js.map