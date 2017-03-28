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
define(["require", "exports", "./TextureReader", "../core/RgbaTexture"], function (require, exports, TextureReader_1, RgbaTexture_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RgbaTextureReader = (function (_super) {
        __extends(RgbaTextureReader, _super);
        function RgbaTextureReader(_gl, texture) {
            var _this = _super.call(this, texture) || this;
            _this._gl = _gl;
            return _this;
        }
        RgbaTextureReader.prototype.getRessource = function () {
            var tex = new RgbaTexture_1.RgbaTexture(this._gl);
            tex.setRawData(this._getRawData());
            return tex;
        };
        return RgbaTextureReader;
    }(TextureReader_1.TextureReader));
    exports.RgbaTextureReader = RgbaTextureReader;
});
//# sourceMappingURL=RgbaTextureReader.js.map