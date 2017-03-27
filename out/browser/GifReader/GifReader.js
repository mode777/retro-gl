// https://www.w3.org/Graphics/GIF/spec-gif89a.txt
define(["require", "exports", "./blocks"], function (require, exports, blocks_1) {
    "use strict";
    var HEADER_OFFSET = 6;
    var GifReader = (function () {
        function GifReader(data) {
            this._header = new Uint8Array(data, 0, HEADER_OFFSET);
            this._view = new DataView(data);
            this._read();
        }
        GifReader.prototype._read = function () {
            var offset = 0;
            this._checkHeader();
            offset += HEADER_OFFSET;
            this._lsd = new blocks_1.LogicalScreenDescriptorBlock(this._view, offset);
            offset += this._lsd.length;
            if (this._lsd.hasGlobalColorTable) {
                this._gtt = new blocks_1.ColorTableBock(this._view, offset, this._lsd.totalColors);
                offset += this._gtt.length;
            }
        };
        GifReader.prototype._checkHeader = function () {
            var h = this._header;
            if (!(h[0] == 0x47
                && h[1] == 0x49
                && h[2] == 0x46
                && h[3] == 0x38
                && h[4] == 0x39
                && h[5] == 0x61))
                throw "Image is not a (suported) gif.";
        };
        return GifReader;
    }());
    exports.GifReader = GifReader;
});
//# sourceMappingURL=GifReader.js.map