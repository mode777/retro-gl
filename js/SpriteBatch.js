define(["require", "exports"], function (require, exports) {
    "use strict";
    var VERTICES_QUAD = 4;
    var INDICES_QUAD = 6;
    var COMP_POS = 3;
    var COMP_UV = 2;
    var UV_TILE = 16;
    var UV_NORM = 256;
    var SpriteBatch = (function () {
        function SpriteBatch(_size) {
            this._size = _size;
            this._geometry = new Uint16Array(_size * VERTICES_QUAD * COMP_POS);
            this._texcoord = new Uint8Array(_size * VERTICES_QUAD * COMP_UV);
            var indices = this._indices = new Uint16Array(_size * INDICES_QUAD);
            this._createIndices();
            this._arrays = {
                position: this._geometry,
                texcoord: this._texcoord,
                indices: this._indices
            };
        }
        Object.defineProperty(SpriteBatch.prototype, "arrays", {
            get: function () {
                return this._arrays;
            },
            enumerable: true,
            configurable: true
        });
        SpriteBatch.prototype.setPosition = function (id, x1, y1, x2, y2, z) {
            if (z === void 0) { z = 0; }
            var geo = this._geometry;
            var offset = id * VERTICES_QUAD * COMP_POS;
            geo[offset] = x1;
            geo[offset + 1] = y1;
            geo[offset + 2] = z;
            geo[offset + 3] = x2;
            geo[offset + 4] = y1;
            geo[offset + 5] = z;
            geo[offset + 6] = x2;
            geo[offset + 7] = y2;
            geo[offset + 8] = z;
            geo[offset + 9] = x1;
            geo[offset + 10] = y2;
            geo[offset + 11] = z;
        };
        SpriteBatch.prototype.setTexture = function (id, x1, y1, x2, y2) {
            var tileset = this._texcoord;
            var offset = id * VERTICES_QUAD * COMP_UV;
            tileset[offset] = x1;
            tileset[offset + 1] = y1;
            tileset[offset + 2] = x2;
            tileset[offset + 3] = y1;
            tileset[offset + 4] = x2;
            tileset[offset + 5] = y2;
            tileset[offset + 6] = x1;
            tileset[offset + 7] = y2;
        };
        SpriteBatch.prototype._createIndices = function () {
            var indices = this._indices;
            var max = this._size * INDICES_QUAD;
            var vertex = 0;
            for (var i = 0; i < max; i += INDICES_QUAD) {
                /*  *1---*2
                    |  /  |
                    *4---*3  */
                indices[i] = vertex; // 1
                indices[i + 1] = vertex + 1; // 2
                indices[i + 2] = vertex + 3; // 4
                indices[i + 3] = vertex + 3; // 4
                indices[i + 4] = vertex + 1; // 2
                indices[i + 5] = vertex + 2; // 3
                vertex += VERTICES_QUAD;
            }
        };
        return SpriteBatch;
    }());
    exports.SpriteBatch = SpriteBatch;
});
//# sourceMappingURL=SpriteBatch.js.map