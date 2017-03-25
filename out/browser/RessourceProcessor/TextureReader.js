define(["require", "exports", "./utils"], function (require, exports, utils_1) {
    "use strict";
    var TextureReader = (function () {
        function TextureReader(_texture) {
            this._texture = _texture;
        }
        TextureReader.prototype._getRawData = function () {
            return utils_1.decodeAndDecompress(this._texture.imageData);
        };
        return TextureReader;
    }());
    exports.TextureReader = TextureReader;
});
//# sourceMappingURL=TextureReader.js.map