var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./constants", "./PixelTexture"], function (require, exports, constants_1, PixelTexture_1) {
    "use strict";
    var RgbaTexture = (function (_super) {
        __extends(RgbaTexture, _super);
        function RgbaTexture(gl) {
            return _super.call(this, gl) || this;
        }
        Object.defineProperty(RgbaTexture.prototype, "_components", {
            get: function () {
                return constants_1.COMP_RGBA;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RgbaTexture.prototype, "_options", {
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
        return RgbaTexture;
    }(PixelTexture_1.PixelTexture));
    exports.RgbaTexture = RgbaTexture;
});
//# sourceMappingURL=RgbaTexture.js.map