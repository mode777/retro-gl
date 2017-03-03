define(["require", "exports", "./constants", "./SpriteBatch"], function (require, exports, constants_1, SpriteBatch_1) {
    "use strict";
    var TileSprite = (function () {
        function TileSprite(_gl, _width, _height, _twidth, _theight) {
            if (_twidth === void 0) { _twidth = 16; }
            if (_theight === void 0) { _theight = 16; }
            this._gl = _gl;
            this._width = _width;
            this._height = _height;
            this._twidth = _twidth;
            this._theight = _theight;
        }
        TileSprite.prototype.create = function (tids) {
            this._createTileset();
            this._batch = new SpriteBatch_1.SpriteBatch(this._gl, this._width * this._height);
            this._createGeometry();
            if (tids)
                this.setTiles(tids);
            this._batch.create();
            return this;
        };
        TileSprite.prototype.render = function (shader) {
            this._batch.render(shader);
        };
        TileSprite.prototype.setTile = function (tid, x, y, z) {
            if (z === void 0) { z = 0; }
            var seq = y * this._width + x;
            this.setTileSeq(seq, tid);
            return this;
        };
        TileSprite.prototype.setTiles = function (tids) {
            for (var i = 0; i < tids.length; i++) {
                this.setTileSeq(i, tids[i]);
            }
            return this;
        };
        TileSprite.prototype.setTileSeq = function (seq, tid, z) {
            if (z === void 0) { z = 0; }
            if (tid == 0) {
                this._batch.setQuad(seq, 0, 0, 0, 0, 0, 0, 0, 0);
                return;
            }
            var ts = this._tileset;
            var offset = tid * (constants_1.VERTICES_QUAD);
            var x1 = (seq % this._width) * this._twidth;
            var y1 = Math.floor(seq / this._width) * this._theight;
            var x2 = x1 + this._twidth;
            var y2 = y1 + this._theight;
            this._batch.setQuad(seq, x1, y1, x2, y2, ts[offset], ts[offset + 1], ts[offset + 2], ts[offset + 3]);
        };
        TileSprite.prototype.update = function () {
            this._batch.update();
        };
        TileSprite.prototype.destroy = function () {
            this._batch.destroy();
        };
        TileSprite.prototype._createTileset = function () {
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
        TileSprite.prototype._createGeometry = function () {
            var ctr = 0;
            var idxCtr = 0;
            var vertex = 0;
            for (var y = 0; y < this._theight * this._height; y += this._theight) {
                for (var x = 0; x < this._twidth * this._width; x += this._twidth) {
                    this._batch.setPosition(ctr, x, y, x + this._twidth, y + this._theight);
                    ctr++;
                }
            }
        };
        return TileSprite;
    }());
    exports.TileSprite = TileSprite;
});
//# sourceMappingURL=TileSprite.js.map