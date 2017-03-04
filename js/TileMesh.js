var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./constants", "./QuadMesh"], function (require, exports, constants_1, QuadMesh_1) {
    "use strict";
    var TileMesh = (function (_super) {
        __extends(TileMesh, _super);
        function TileMesh(gl, _width, _height, _twidth, _theight) {
            if (_twidth === void 0) { _twidth = 16; }
            if (_theight === void 0) { _theight = 16; }
            var _this = _super.call(this, gl, _width * _height) || this;
            _this._width = _width;
            _this._height = _height;
            _this._twidth = _twidth;
            _this._theight = _theight;
            return _this;
        }
        TileMesh.prototype.create = function (tids) {
            this._createTileset();
            //this._createGeometry();
            if (tids)
                this.setTiles(tids);
            _super.prototype.create.call(this);
            return this;
        };
        TileMesh.prototype.setTile = function (tid, x, y, z) {
            if (z === void 0) { z = 0; }
            var seq = y * this._width + x;
            this.setTileSeq(seq, tid);
            return this;
        };
        TileMesh.prototype.setTiles = function (tids) {
            for (var i = 0; i < tids.length; i++) {
                this.setTileSeq(i, tids[i]);
            }
            return this;
        };
        TileMesh.prototype.setTileSeq = function (seq, tid, z) {
            if (z === void 0) { z = 0; }
            if (tid == 0) {
                this.setQuad(seq, 0, 0, 0, 0, 0, 0, 0, 0);
                return;
            }
            var ts = this._tileset;
            var offset = tid * (constants_1.VERTICES_QUAD);
            var x1 = (seq % this._width) * this._twidth;
            var y1 = Math.floor(seq / this._width) * this._theight;
            var x2 = x1 + this._twidth;
            var y2 = y1 + this._theight;
            this.setQuad(seq, x1, y1, x2, y2, ts[offset], ts[offset + 1], ts[offset + 2], ts[offset + 3]);
        };
        TileMesh.prototype._createTileset = function () {
            var ctr = 0;
            var tileset = new Uint8Array((constants_1.TEXTURE_SIZE / this._twidth) * (constants_1.TEXTURE_SIZE / this._theight) * constants_1.VERTICES_QUAD);
            for (var y = 0; y < constants_1.TEXTURE_SIZE; y += this._twidth) {
                for (var x = 0; x < constants_1.TEXTURE_SIZE; x += this._theight) {
                    tileset[ctr++] = x;
                    tileset[ctr++] = y;
                    tileset[ctr++] = x + this._twidth;
                    tileset[ctr++] = y + this._theight;
                }
            }
            this._tileset = tileset;
        };
        TileMesh.prototype._createGeometry = function () {
            var ctr = 0;
            var idxCtr = 0;
            var vertex = 0;
            for (var y = 0; y < this._theight * this._height; y += this._theight) {
                for (var x = 0; x < this._twidth * this._width; x += this._twidth) {
                    this.setPosition(ctr, x, y, x + this._twidth, y + this._theight);
                    ctr++;
                }
            }
        };
        return TileMesh;
    }(QuadMesh_1.QuadMesh));
    exports.TileMesh = TileMesh;
});
//# sourceMappingURL=TileMesh.js.map