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
define(["require", "exports", "./RgbaTexture", "./constants"], function (require, exports, RgbaTexture_1, constants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PaletteTexture = (function (_super) {
        __extends(PaletteTexture, _super);
        function PaletteTexture() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
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
        PaletteTexture.prototype.setRawPalette = function (palId, data) {
            var offset = this._components * constants_1.TEXTURE_SIZE * palId;
            for (var i = 0; i < data.length; i++) {
                this._texdata[offset + i] = data[i];
            }
        };
        PaletteTexture.prototype.setPalDirty = function (palId) {
            this.setRowDirty(palId);
        };
        // public setPngPalette(palId: number, pngPal: Uint8Array){
        //     this.setPalFunc(palId, (x, comp) => {
        //         // Make first color transparent
        //         if(x == 0 && comp == ColorComponent.A)
        //             return 0;
        //         switch (comp) {
        //             case ColorComponent.A:
        //                 return 255;
        //             default:
        //                 return pngPal[x * COMP_RGB + comp]; 
        //         }
        //     });
        // }
        PaletteTexture.prototype.setIndex = function (palId, index, color) {
            return this.setPixel(index, palId, color);
        };
        PaletteTexture.prototype.getIndex = function (palId, index) {
            return this.getPixel(index, palId);
        };
        PaletteTexture.prototype.shift = function (palId, start, end) {
            var len = end - start;
            for (var i = 0; i < len; i++) {
                this.switchColors(palId, start + i, end);
            }
        };
        PaletteTexture.prototype.switchColors = function (palId, idx1, idx2) {
            var temp = this.getIndex(palId, idx1);
            this.setIndex(palId, idx1, this.getIndex(palId, idx2));
            this.setIndex(palId, idx2, temp);
        };
        return PaletteTexture;
    }(RgbaTexture_1.RgbaTexture));
    exports.PaletteTexture = PaletteTexture;
});
//# sourceMappingURL=PaletteTexture.js.map