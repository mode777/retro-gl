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
            _this._text = "";
            return _this;
        }
        Object.defineProperty(TextMesh.prototype, "text", {
            get: function () {
                return this._text;
            },
            enumerable: true,
            configurable: true
        });
        TextMesh.prototype.create = function (text, width, x, y, z) {
            if (width === void 0) { width = constants_1.HUGE; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = constants_1.MIN_Z; }
            this._createFont();
            if (text)
                this.setText(text, width, x, y, z);
            _super.prototype.create.call(this);
            this.range = text ? text.length : 0;
            return this;
        };
        TextMesh.prototype.setText = function (text, width, x, y, z, pal) {
            if (width === void 0) { width = constants_1.HUGE; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = constants_1.MIN_Z; }
            if (pal === void 0) { pal = 0; }
            this._putText(text, width, 0, x, y, z, pal);
            this.range = text.length;
            this._text = text;
        };
        TextMesh.prototype.appendText = function (text, width, x, y, z, pal) {
            if (width === void 0) { width = constants_1.HUGE; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = constants_1.MIN_Z; }
            if (pal === void 0) { pal = 0; }
            this._putText(text, width, this.range, x, y, z, pal);
            this.range += text.length;
            this._text += text;
        };
        TextMesh.prototype._putText = function (text, width, quad_offset, x, y, z, pal) {
            if (width === void 0) { width = constants_1.HUGE; }
            if (quad_offset === void 0) { quad_offset = 0; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = constants_1.MIN_Z; }
            if (pal === void 0) { pal = 0; }
            var ctr = 0;
            if (text.length > this.size)
                text = text.substr(0, this.size);
            var ox = x;
            var oy = y;
            for (var i = 0; i < text.length; i++) {
                var offset = this._fontLoookup[text.charCodeAt(i)];
                var x_1 = this._font[offset];
                var y_1 = this._font[offset + 1];
                var w = this._font[offset + 2];
                var h = this._font[offset + 3];
                this.setQuad(this.range + i, ox, oy, ox + w, oy + h, x_1, y_1, x_1 + w, y_1 + h, z, pal);
                if (ox > width) {
                    oy += h;
                    ox = 0;
                }
                else {
                    ox += w;
                }
            }
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