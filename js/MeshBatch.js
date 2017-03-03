define(["require", "exports", "./constants"], function (require, exports, constants_1) {
    "use strict";
    var MeshBatch = (function () {
        function MeshBatch(_gl, _size) {
            this._gl = _gl;
            this._size = _size;
            this._dirty_start = constants_1.HUGE;
            this._dirty_end = 0;
            this._data = new ArrayBuffer(_size * constants_1.VERTICES_QUAD * constants_1.VERTEX_SIZE);
            this._geometry = new Uint16Array(this._data);
            this._texcoord = new Uint8Array(this._data);
            var indices = this._indices = new Uint16Array(_size * constants_1.INDICES_QUAD);
            this._createIndices();
            this._arrays = {
                position: this._geometry,
                texcoord: this._texcoord,
                indices: this._indices
            };
        }
        Object.defineProperty(MeshBatch.prototype, "isDirty", {
            get: function () {
                return (this._dirty_end - this._dirty_start) > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MeshBatch.prototype, "bufferInfo", {
            get: function () {
                return this._bufferInfo;
            },
            enumerable: true,
            configurable: true
        });
        MeshBatch.prototype.create = function () {
            var packedBuffer = twgl.createBufferFromTypedArray(this._gl, this._data, this._gl.ARRAY_BUFFER, this._gl.DYNAMIC_DRAW);
            var indexBuffer = twgl.createBufferFromTypedArray(this._gl, this._indices, this._gl.ELEMENT_ARRAY_BUFFER);
            var stride = constants_1.VERTEX_SIZE;
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
                        offset: constants_1.OFFSET_UV,
                        normalize: true
                    },
                },
            };
            this._dirty_start = constants_1.HUGE;
            this._dirty_end = 0;
            return this;
        };
        MeshBatch.prototype.setPosition = function (id, x1, y1, x2, y2, z) {
            if (z === void 0) { z = 0; }
            var vertex = id * constants_1.VERTICES_QUAD;
            this._setVertexPos(vertex, x1, y1, z);
            this._setVertexPos(vertex + 1, x2, y1, z);
            this._setVertexPos(vertex + 2, x2, y2, z);
            this._setVertexPos(vertex + 3, x1, y2, z);
            this._setQuadDirty(id);
        };
        MeshBatch.prototype.setTexture = function (id, x1, y1, x2, y2) {
            //console.log(x1, y1, x2, y2);
            var vertex = id * constants_1.VERTICES_QUAD;
            this._setVertexUv(vertex, x1, y1);
            this._setVertexUv(vertex + 1, x2, y1);
            this._setVertexUv(vertex + 2, x2, y2);
            this._setVertexUv(vertex + 3, x1, y2);
            this._setQuadDirty(id);
        };
        MeshBatch.prototype.setQuad = function (id, x1, y1, x2, y2, originX1, originY1, originX2, originY2, z) {
            if (z === void 0) { z = 0; }
            var vertex = id * constants_1.VERTICES_QUAD;
            this._setVertexUv(vertex, originX1, originY1);
            this._setVertexUv(vertex + 1, originX2, originY1);
            this._setVertexUv(vertex + 2, originX2, originY2);
            this._setVertexUv(vertex + 3, originX1, originY2);
            this._setVertexPos(vertex, x1, y1, z);
            this._setVertexPos(vertex + 1, x2, y1, z);
            this._setVertexPos(vertex + 2, x2, y2, z);
            this._setVertexPos(vertex + 3, x1, y2, z);
            this._setQuadDirty(id);
        };
        MeshBatch.prototype.render = function (shader) {
            twgl.setBuffersAndAttributes(this._gl, shader, this._bufferInfo);
            twgl.drawBufferInfo(this._gl, this._bufferInfo);
        };
        MeshBatch.prototype.update = function () {
            if (this.isDirty) {
                var gl = this._gl;
                var buffer = this.bufferInfo.attribs["position"].buffer;
                var data = new Uint8Array(this._data, this._dirty_start, this._dirty_end - this._dirty_start);
                //let data = this._data;
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, this._dirty_start, data);
                this._dirty_start = constants_1.HUGE;
                this._dirty_end = 0;
            }
        };
        MeshBatch.prototype.destroy = function () {
            this._gl.deleteBuffer(this._bufferInfo.attribs["position"].buffer);
            this._gl.deleteBuffer(this._bufferInfo.attribs["texcoord"].buffer);
            this._gl.deleteBuffer(this._bufferInfo.attribs["indices"].buffer);
            this._indices = null;
            this._geometry = null;
            this._texcoord = null;
            this._data = null;
        };
        MeshBatch.prototype._setQuadDirty = function (id) {
            this._dirty_start = Math.min(id * constants_1.QUAD_SIZE, this._dirty_start);
            this._dirty_end = Math.max(id * constants_1.QUAD_SIZE + constants_1.QUAD_SIZE, this._dirty_end);
        };
        MeshBatch.prototype._setVertexPos = function (vertex, x, y, z) {
            // divide by two.
            var pos = (vertex * constants_1.VERTEX_SIZE) >> 1;
            var geo = this._geometry;
            geo[pos] = x;
            geo[pos + 1] = y;
            geo[pos + 2] = z;
        };
        MeshBatch.prototype._setVertexUv = function (vertex, x, y) {
            var uvs = this._texcoord;
            var pos = (vertex * constants_1.VERTEX_SIZE) + constants_1.OFFSET_UV;
            uvs[pos] = x;
            uvs[pos + 1] = y;
        };
        MeshBatch.prototype._createIndices = function () {
            var indices = this._indices;
            var max = this._size * constants_1.INDICES_QUAD;
            var vertex = 0;
            for (var i = 0; i < max; i += constants_1.INDICES_QUAD) {
                /*  *1---*2
                    |  /  |
                    *4---*3  */
                indices[i] = vertex; // 1
                indices[i + 1] = vertex + 1; // 2
                indices[i + 2] = vertex + 3; // 4
                indices[i + 3] = vertex + 3; // 4
                indices[i + 4] = vertex + 1; // 2
                indices[i + 5] = vertex + 2; // 3
                vertex += constants_1.VERTICES_QUAD;
            }
        };
        return MeshBatch;
    }());
    exports.MeshBatch = MeshBatch;
});
//# sourceMappingURL=MeshBatch.js.map