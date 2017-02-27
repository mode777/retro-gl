define(["require", "exports"], function (require, exports) {
    "use strict";
    var Graphics = (function () {
        function Graphics(_gl) {
            this._gl = _gl;
        }
        Graphics.prototype.CreateSuperTile = function (tids, data) {
            data = data || {
                position: new Float32Array(1152),
                texcoord: new Float32Array(768)
            };
            var ctr = 0;
            var posCtr = 0;
            var texCtr = 0;
            var tidPos = {
                x: 0,
                y: 0
            };
            for (var y = 0; y < 8; y++) {
                for (var x = 0; x < 8; x++) {
                    this._getTidPos(tids[ctr], tidPos);
                    this._createPositions(x * 16, y * 16, 16, 16, data["position"], posCtr);
                    this._createUvs(x * 16, y * 16, 16, 16, data["texcoord"], texCtr);
                    ctr++;
                    posCtr += 18;
                    texCtr += 12;
                }
            }
        };
        Graphics.prototype._createPositions = function (x, y, w, h, position, offset) {
            position[offset++] = x;
            position[offset++] = y;
            position[offset++] = 0;
            position[offset++] = x + w;
            position[offset++] = y;
            position[offset++] = 0;
            position[offset++] = x;
            position[offset++] = y + h;
            position[offset++] = 0;
            position[offset++] = x;
            position[offset++] = y + h;
            position[offset++] = 0;
            position[offset++] = x + w;
            position[offset++] = y;
            position[offset++] = 0;
            position[offset++] = x + w;
            position[offset++] = y + h;
            position[offset++] = 0;
        };
        Graphics.prototype._createUvs = function (x, y, w, h, texcoord, offset) {
            texcoord[offset++] = x;
            texcoord[offset++] = y;
            texcoord[offset++] = x + w;
            texcoord[offset++] = y;
            texcoord[offset++] = x;
            texcoord[offset++] = y + h;
            texcoord[offset++] = x;
            texcoord[offset++] = y + h;
            texcoord[offset++] = x + w;
            texcoord[offset++] = y;
            texcoord[offset++] = x + w;
            texcoord[offset++] = y + h;
        };
        Graphics.prototype._getTidPos = function (tid, out) {
            out.x = tid % 16;
            out.y = Math.floor(tid / 16);
        };
        return Graphics;
    }());
    exports.Graphics = Graphics;
});
//# sourceMappingURL=Graphics.js.map