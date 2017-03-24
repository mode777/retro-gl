define(["require", "exports"], function (require, exports) {
    "use strict";
    function compressAndEncode(data) {
        var compressed = pako.deflate(data, {
            to: "string"
        });
        return btoa(compressed);
    }
    exports.compressAndEncode = compressAndEncode;
    function decodeAndDecompress(b64) {
        var decoded = atob(b64);
        return pako.inflate(b64);
    }
    exports.decodeAndDecompress = decodeAndDecompress;
});
//# sourceMappingURL=utils.js.map