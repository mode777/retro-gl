var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../core/IndexedTexture", "./TextureReader"], function (require, exports, IndexedTexture_1, TextureReader_1) {
    "use strict";
    var IndexedTextureReader = (function (_super) {
        __extends(IndexedTextureReader, _super);
        function IndexedTextureReader(_gl, texture) {
            var _this = _super.call(this, texture) || this;
            _this._gl = _gl;
            return _this;
        }
        IndexedTextureReader.prototype.getRessource = function () {
            var tex = new IndexedTexture_1.IndexedTexture(this._gl);
            tex.setRawData(this._getRawData());
            return tex;
        };
        return IndexedTextureReader;
    }(TextureReader_1.TextureReader));
    exports.IndexedTextureReader = IndexedTextureReader;
});
//# sourceMappingURL=IndexedTextureReader.js.map