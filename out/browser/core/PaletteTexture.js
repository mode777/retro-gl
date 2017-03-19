var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./constants", "./PixelTexture"], function (require, exports, constants_1, PixelTexture_1) {
    "use strict";
    var PaletteTexture = (function (_super) {
        __extends(PaletteTexture, _super);
        function PaletteTexture(gl) {
            return _super.call(this, gl) || this;
        }
        Object.defineProperty(PaletteTexture.prototype, "_components", {
            get: function () {
                return constants_1.COMP_RGBA;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PaletteTexture.prototype, "_options", {
            get: function () {
                return {
                    target: this._gl.TEXTURE_2D,
                    width: constants_1.TEXTURE_SIZE,
                    height: constants_1.TEXTURE_SIZE,
                    min: this._gl.NEAREST,
                    mag: this._gl.NEAREST,
                    src: this._texdata,
                    format: this._gl.RGBA,
                    type: this._gl.UNSIGNED_BYTE
                };
            },
            enumerable: true,
            configurable: true
        });
        PaletteTexture.prototype.setPalFunc = function (palId, func) {
            var tex = this._texdata;
            var f = Math.floor;
            var totComp = this._components;
            var start = palId * constants_1.TEXTURE_SIZE * totComp;
            var end = start + constants_1.TEXTURE_SIZE * totComp;
            for (var i = start; i < end; i++) {
                var comp = i % constants_1.COMP_RGBA;
                var pixel = Math.floor((i - comp) / totComp);
                tex[i] = func(pixel % 256, i % totComp);
            }
            this.setPalDirty(palId);
        };
        PaletteTexture.prototype.setPalDirty = function (palId) {
            this.setRowDirty(palId);
        };
        PaletteTexture.prototype.setPngPalette = function (palId, pngPal) {
            this.setPalFunc(palId, function (x, comp) {
                // Make first color transparent
                if (x == 0 && comp == PixelTexture_1.ColorComponent.A)
                    return 0;
                switch (comp) {
                    case PixelTexture_1.ColorComponent.A:
                        return 255;
                    default:
                        return pngPal[x * constants_1.COMP_RGB + comp];
                }
            });
        };
        PaletteTexture.prototype.setIndex = function (palId, index, color) {
            return this.setPixel(index, palId, color);
        };
        PaletteTexture.prototype.getIndex = function (palId, index) {
            return this.getPixel(index, palId);
        };
        PaletteTexture.prototype.shift = function (palId, start, end) {
            var len = end - start;
            for (var i = 0; i < len; i++) {
                this.switch(palId, start + i, end);
            }
        };
        PaletteTexture.prototype.switch = function (palId, idx1, idx2) {
            var temp = this.getIndex(palId, idx1);
            this.setIndex(palId, idx1, this.getIndex(palId, idx2));
            this.setIndex(palId, idx2, temp);
        };
        return PaletteTexture;
    }(PixelTexture_1.PixelTexture));
    exports.PaletteTexture = PaletteTexture;
});
//# sourceMappingURL=PaletteTexture.js.map