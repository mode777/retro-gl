define(["require", "exports"], function (require, exports) {
    "use strict";
    var VERTICES_QUAD = 4;
    var INDICES_QUAD = 6;
    var COMP_POS = 3;
    var COMP_SIZE_POS = 2;
    var COMP_UV = 2;
    var COMP_SIZE_UV = 1;
    // const UV_TILE = 16;
    // const UV_NORM = 256;
    var OFFSET_UV = COMP_POS * COMP_SIZE_POS;
    var VERTEX_SIZE = COMP_POS * COMP_SIZE_POS + COMP_UV * COMP_SIZE_UV;
    var SpriteBatch = (function () {
        function SpriteBatch(_gl, _size) {
            this._gl = _gl;
            this._size = _size;
            this._data = new ArrayBuffer(_size * VERTICES_QUAD * VERTEX_SIZE);
            this._geometry = new Uint16Array(this._data);
            this._texcoord = new Uint8Array(this._data);
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
        Object.defineProperty(SpriteBatch.prototype, "bufferInfo", {
            get: function () {
                return this._bufferInfo;
            },
            enumerable: true,
            configurable: true
        });
        SpriteBatch.prototype.createBuffers = function () {
            var packedBuffer = twgl.createBufferFromTypedArray(this._gl, this._data, this._gl.ARRAY_BUFFER, this._gl.DYNAMIC_DRAW);
            var indexBuffer = twgl.createBufferFromTypedArray(this._gl, this._indices, this._gl.ELEMENT_ARRAY_BUFFER);
            var stride = VERTEX_SIZE;
            this._bufferInfo = {
                numElements: this._indices.length,
                indices: indexBuffer,
                elementType: this._gl.UNSIGNED_SHORT,
                attribs: {
                    position: {
                        buffer: packedBuffer,
                        numComponents: 3,
                        type: this._gl.UNSIGNED_SHORT,
                        stride: stride,
                        offset: 0
                    },
                    texcoord: {
                        buffer: packedBuffer,
                        numComponents: 2,
                        type: this._gl.UNSIGNED_BYTE,
                        stride: stride,
                        offset: OFFSET_UV,
                        normalize: true
                    },
                },
            };
            console.log(this._bufferInfo);
            return this;
        };
        SpriteBatch.prototype.setPosition = function (id, x1, y1, x2, y2, z) {
            if (z === void 0) { z = 0; }
            var vertex = id * VERTICES_QUAD;
            this.setVertexPos(vertex, x1, y1, z);
            this.setVertexPos(vertex + 1, x2, y1, z);
            this.setVertexPos(vertex + 2, x2, y2, z);
            this.setVertexPos(vertex + 3, x1, y2, z);
        };
        SpriteBatch.prototype.setVertexPos = function (vertex, x, y, z) {
            var pos = (vertex * VERTEX_SIZE) / COMP_SIZE_POS;
            var geo = this._geometry;
            geo[pos] = x;
            geo[pos + 1] = y;
            geo[pos + 2] = z;
        };
        SpriteBatch.prototype.setTexture = function (id, x1, y1, x2, y2) {
            var vertex = id * VERTICES_QUAD;
            this.setVertexUv(vertex, x1, y1);
            this.setVertexUv(vertex + 1, x2, y1);
            this.setVertexUv(vertex + 2, x2, y2);
            this.setVertexUv(vertex + 3, x1, y2);
        };
        SpriteBatch.prototype.setVertexUv = function (vertex, x, y) {
            var uvs = this._texcoord;
            var pos = (vertex * VERTEX_SIZE) + OFFSET_UV;
            uvs[pos] = x;
            uvs[pos + 1] = y;
        };
        SpriteBatch.prototype.setQuad = function (id, x, y, quad, z) {
            if (z === void 0) { z = 0; }
            this.setPosition(id, x, y, x + quad.width, y + quad.height, z);
            this.setTexture(id, quad.x, quad.y, quad.x + quad.width, quad.y + quad.height);
        };
        SpriteBatch.prototype.render = function (shader) {
            twgl.setBuffersAndAttributes(this._gl, shader, this._bufferInfo);
            twgl.drawBufferInfo(this._gl, this._bufferInfo);
        };
        SpriteBatch.prototype.destroy = function () {
            this._gl.deleteBuffer(this._bufferInfo.attribs["position"].buffer);
            this._gl.deleteBuffer(this._bufferInfo.attribs["texcoord"].buffer);
            this._gl.deleteBuffer(this._bufferInfo.attribs["indices"].buffer);
            this._indices = null;
            this._geometry = null;
            this._texcoord = null;
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