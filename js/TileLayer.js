define(["require", "exports"], function (require, exports) {
    "use strict";
    var TILES_X = 32;
    var TILES_Y = 32;
    var TILESIZE_X = 16;
    var TILESIZE_Y = 16;
    var VERTICES_TILE = 6;
    var COMP_POS = 3;
    var COMP_UV = 2;
    var UV_TILE = 0.0625;
    var UV_NORM = 1;
    var TILESET_X = 16;
    var TILESET_Y = 16;
    var TileLayer = (function () {
        function TileLayer(_gl) {
            this._gl = _gl;
        }
        TileLayer.prototype.create = function (tids) {
            this._createTileset();
            this._createGeometry();
            this._texcoord = new Float32Array(TILES_X * TILES_Y * VERTICES_TILE * COMP_UV);
            this._arrays = {
                position: this._geometry,
                texcoord: this._texcoord
            };
            if (tids)
                this.setTiles(tids);
            return this;
        };
        TileLayer.prototype.setTiles = function (tids) {
            for (var i = 0; i < tids.length; i++) {
                this._setTileUvs(tids[i], i * VERTICES_TILE * COMP_UV);
            }
            return this;
        };
        TileLayer.prototype.setTile = function (tid, x, y) {
            var no = y * TILES_X + x;
            this._setTileUvs(tid, no * VERTICES_TILE * COMP_UV);
            return this;
        };
        TileLayer.prototype.setTileSeq = function (tid, seq) {
            this._setTileUvs(tid, seq * VERTICES_TILE * COMP_UV);
            return this;
        };
        Object.defineProperty(TileLayer.prototype, "arrays", {
            get: function () {
                return this._arrays;
            },
            enumerable: true,
            configurable: true
        });
        TileLayer.prototype._setTileUvs = function (tid, offset) {
            var stride = VERTICES_TILE * COMP_UV;
            var tileComp = tid * stride;
            for (var i = tileComp; i < tileComp + stride; i++) {
                this._texcoord[offset++] = this._tileset[i];
            }
        };
        TileLayer.prototype._createTileset = function () {
            var ctr = 0;
            var tileset = new Float32Array(TILESET_X * TILESET_Y * VERTICES_TILE * COMP_UV);
            for (var y = 0; y < UV_NORM; y += UV_TILE) {
                for (var x = 0; x < UV_NORM; x += UV_TILE) {
                    tileset[ctr++] = x;
                    tileset[ctr++] = y;
                    tileset[ctr++] = x + UV_TILE;
                    tileset[ctr++] = y;
                    tileset[ctr++] = x;
                    tileset[ctr++] = y + UV_TILE;
                    tileset[ctr++] = x;
                    tileset[ctr++] = y + UV_TILE;
                    tileset[ctr++] = x + UV_TILE;
                    tileset[ctr++] = y;
                    tileset[ctr++] = x + UV_TILE;
                    tileset[ctr++] = y + UV_TILE;
                }
            }
            this._tileset = tileset;
        };
        TileLayer.prototype._createGeometry = function () {
            var ctr = 0;
            var geo = new Uint16Array(TILES_X * TILES_Y * VERTICES_TILE * COMP_POS);
            for (var y = 0; y < TILES_Y * TILESIZE_Y; y += TILESIZE_Y) {
                for (var x = 0; x < TILES_X * TILESIZE_X; x += TILESIZE_X) {
                    geo[ctr++] = x;
                    geo[ctr++] = y;
                    geo[ctr++] = 0;
                    geo[ctr++] = x + TILESIZE_X;
                    geo[ctr++] = y;
                    geo[ctr++] = 0;
                    geo[ctr++] = x;
                    geo[ctr++] = y + TILESIZE_Y;
                    geo[ctr++] = 0;
                    geo[ctr++] = x;
                    geo[ctr++] = y + TILESIZE_Y;
                    geo[ctr++] = 0;
                    geo[ctr++] = x + TILESIZE_X;
                    geo[ctr++] = y;
                    geo[ctr++] = 0;
                    geo[ctr++] = x + TILESIZE_X;
                    geo[ctr++] = y + TILESIZE_Y;
                    geo[ctr++] = 0;
                }
            }
            this._geometry = geo;
        };
        return TileLayer;
    }());
    exports.TileLayer = TileLayer;
});
//# sourceMappingURL=TileLayer.js.map