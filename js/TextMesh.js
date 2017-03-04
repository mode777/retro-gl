var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./QuadMesh", "./constants"], function (require, exports, QuadMesh_1, constants_1) {
    "use strict";
    var TextMesh = (function (_super) {
        __extends(TextMesh, _super);
        function TextMesh(_gl, _size, _fontInfo) {
            var _this = _super.call(this, _gl, _size) || this;
            _this._fontInfo = _fontInfo;
            _this._fontLoookup = [];
            return _this;
        }
        Object.defineProperty(TextMesh.prototype, "text", {
            get: function () {
                return this._text;
            },
            enumerable: true,
            configurable: true
        });
        TextMesh.prototype.create = function (text) {
            this._createFont();
            if (text)
                this.putText(text);
            _super.prototype.create.call(this);
            return this;
        };
        TextMesh.prototype.putText = function (text) {
            if (text.length > this.size)
                text = text.substr(0, this.size);
            var ox = 0;
            var oy = 0;
            for (var i = 0; i < text.length; i++) {
                var offset = this._fontLoookup[text.charCodeAt(i)];
                var x = this._font[offset];
                var y = this._font[offset + 1];
                var w = this._font[offset + 2];
                var h = this._font[offset + 3];
                this.setQuad(i, ox, oy, ox + w, oy + h, x, y, x + w, y + h);
                console.log(ox);
                if (ox > 256) {
                    oy += h;
                    ox = 0;
                }
                else {
                    ox += w;
                }
            }
            this.range = text.length;
            this._text = text;
        };
        TextMesh.prototype._createFont = function () {
            var info = this._fontInfo;
            var chars = info.chars;
            this._font = new Uint8Array(chars.length * constants_1.VERTICES_QUAD);
            var wRow = constants_1.TEXTURE_SIZE / this._fontInfo.x;
            for (var i = 0; i < chars.length; i++) {
                var x = (i % wRow) * info.x;
                var y = Math.floor(i / wRow) * info.y;
                var w = info.widths ? info.widths[i] : info.x;
                var h = info.y;
                var offset = i * constants_1.VERTICES_QUAD;
                this._fontLoookup[chars.charCodeAt(i)] = offset;
                this._font[offset] = x;
                this._font[offset + 1] = y;
                this._font[offset + 2] = w;
                this._font[offset + 3] = h;
            }
        };
        return TextMesh;
    }(QuadMesh_1.QuadMesh));
    exports.TextMesh = TextMesh;
});
//# sourceMappingURL=TextMesh.js.map