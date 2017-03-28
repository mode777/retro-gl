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
define(["require", "exports", "./constants", "./PixelTexture"], function (require, exports, constants_1, PixelTexture_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IndexedTexture = (function (_super) {
        __extends(IndexedTexture, _super);
        function IndexedTexture(gl) {
            return _super.call(this, gl) || this;
        }
        Object.defineProperty(IndexedTexture.prototype, "_components", {
            get: function () {
                return constants_1.COMP_INDEXED;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IndexedTexture.prototype, "_options", {
            get: function () {
                return {
                    target: this._gl.TEXTURE_2D,
                    width: constants_1.TEXTURE_SIZE,
                    height: constants_1.TEXTURE_SIZE,
                    min: this._gl.NEAREST,
                    mag: this._gl.NEAREST,
                    src: this._texdata,
                    format: this._gl.LUMINANCE,
                    type: this._gl.UNSIGNED_BYTE
                };
            },
            enumerable: true,
            configurable: true
        });
        return IndexedTexture;
    }(PixelTexture_1.PixelTexture));
    exports.IndexedTexture = IndexedTexture;
});
//# sourceMappingURL=IndexedTexture.js.map