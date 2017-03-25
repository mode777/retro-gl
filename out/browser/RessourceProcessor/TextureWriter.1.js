define(["require", "exports", "./utils"], function (require, exports, utils_1) {
    "use strict";
    var TextureWriter = (function () {
        function TextureWriter(_texture) {
            this._texture = _texture;
        }
        TextureWriter.prototype.getJson = function () {
            return {
                colorDepth: this._texture.colorDepth,
                imageData: utils_1.compressAndEncode(this._texture.getRawData())
            };
        };
        return TextureWriter;
    }());
    exports.TextureWriter = TextureWriter;
});
//# sourceMappingURL=TextureWriter.1.js.map