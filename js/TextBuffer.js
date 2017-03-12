var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./QuadBuffer", "./constants"], function (require, exports, QuadBuffer_1, constants_1) {
    "use strict";
    var TextBuffer = (function (_super) {
        __extends(TextBuffer, _super);
        function TextBuffer(_gl, _size, _fontInfo) {
            var _this = _super.call(this, _gl, _size) || this;
            _this._fontInfo = _fontInfo;
            _this._fontLoookup = [];
            _this._text = "";
            _this._ptr = 0;
            return _this;
        }
        Object.defineProperty(TextBuffer.prototype, "text", {
            get: function () {
                return this._text;
            },
            enumerable: true,
            configurable: true
        });
        TextBuffer.prototype.create = function (text, width, x, y, z) {
            if (width === void 0) { width = constants_1.HUGE; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = constants_1.MIN_Z; }
            this._createFont();
            if (text)
                this.write(text, width, x, y, z);
            _super.prototype.create.call(this);
            //this.range = text ? text.length : 0;
            return this;
        };
        TextBuffer.prototype.seek = function (pos) {
            this._ptr = pos;
        };
        // public setText(text: string, offset=0, width = HUGE, x = 0, y = 0, z = MIN_Z, pal = 0){
        //     this._putText(text, width, offset, x,y,z,pal)
        //     //this.range = offset + text.length;
        //     this._text = text;
        // }
        TextBuffer.prototype.clear = function (length) {
            for (var i = this._ptr; i < this._ptr + length; i++) {
                this.clearQuad(i);
            }
            this._ptr += length;
        };
        // public appendText(text: string, width = HUGE, x = 0, y = 0, z = MIN_Z, pal = 0){
        //     this._putText(text, width, this.range,x,y,z,pal);
        //     //this.range += text.length;
        //     this._text += text;
        // }
        TextBuffer.prototype.write = function (text, width, x, y, z, pal) {
            if (width === void 0) { width = constants_1.HUGE; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = constants_1.MIN_Z; }
            if (pal === void 0) { pal = 0; }
            var ctr = 0;
            if (this._ptr + text.length > this.size)
                text = text.substr(0, this.size - this._ptr);
            var ox = x;
            var oy = y;
            for (var i = 0; i < text.length; i++) {
                var offset = this._fontLoookup[text.charCodeAt(i)];
                var x_1 = this._font[offset];
                var y_1 = this._font[offset + 1];
                var w = this._font[offset + 2];
                var h = this._font[offset + 3];
                this.setAttributes(this._ptr + i, ox, oy, ox + w, oy + h, x_1, y_1, x_1 + w, y_1 + h, z, pal);
                if (ox > width) {
                    oy += h;
                    ox = 0;
                }
                else {
                    ox += w;
                }
            }
            this._ptr += text.length;
        };
        TextBuffer.prototype._createFont = function () {
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
        return TextBuffer;
    }(QuadBuffer_1.QuadBuffer));
    exports.TextBuffer = TextBuffer;
});
//# sourceMappingURL=TextBuffer.js.map