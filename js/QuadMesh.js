define(["require", "exports", "./constants"], function (require, exports, constants_1) {
    "use strict";
    var QuadMesh = (function () {
        function QuadMesh(_gl, _size) {
            this._gl = _gl;
            this._size = _size;
            this._dirty_start = constants_1.HUGE;
            this._dirty_end = 0;
            this._data = new ArrayBuffer(_size * constants_1.VERTICES_QUAD * constants_1.VERTEX_SIZE);
            this._geometry = new Uint16Array(this._data);
            this._texcoord = new Uint8Array(this._data);
            var indices = this._indices = new Uint16Array(_size * constants_1.INDICES_QUAD);
            this._createIndices();
            this._transTemp = vec3.create();
        }
        Object.defineProperty(QuadMesh.prototype, "isDirty", {
            get: function () {
                return (this._dirty_end - this._dirty_start) > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuadMesh.prototype, "bufferInfo", {
            get: function () {
                return this._bufferInfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuadMesh.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuadMesh.prototype, "range", {
            get: function () {
                return this._range;
            },
            set: function (value) {
                this._range = value;
                if (this._bufferInfo) {
                    this._bufferInfo.numElements = value * constants_1.INDICES_QUAD;
                }
            },
            enumerable: true,
            configurable: true
        });
        QuadMesh.prototype.create = function () {
            var packedBuffer = twgl.createBufferFromTypedArray(this._gl, this._data, this._gl.ARRAY_BUFFER, this._gl.DYNAMIC_DRAW);
            var indexBuffer = twgl.createBufferFromTypedArray(this._gl, this._indices, this._gl.ELEMENT_ARRAY_BUFFER);
            var stride = constants_1.VERTEX_SIZE;
            this._bufferInfo = {
                numElements: this._range ? this._range * constants_1.INDICES_QUAD : this._indices.length,
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
                    z_index: {
                        buffer: packedBuffer,
                        numComponents: 1,
                        type: this._gl.UNSIGNED_BYTE,
                        stride: stride,
                        offset: 4,
                        normalize: false
                    },
                    pal_shift: {
                        buffer: packedBuffer,
                        numComponents: 1,
                        type: this._gl.UNSIGNED_BYTE,
                        stride: stride,
                        offset: 5,
                        normalize: true
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
            this._range = this._bufferInfo.numElements / constants_1.INDICES_QUAD;
            this._dirty_start = constants_1.HUGE;
            this._dirty_end = 0;
            return this;
        };
        QuadMesh.prototype.setPosition = function (id, x1, y1, x2, y2, z) {
            if (z === void 0) { z = constants_1.MIN_Z; }
            var vertex = id * constants_1.VERTICES_QUAD;
            this._setVertexPos(vertex, x1, y1, z);
            this._setVertexPos(vertex + 1, x2, y1, z);
            this._setVertexPos(vertex + 2, x2, y2, z);
            this._setVertexPos(vertex + 3, x1, y2, z);
            this._setQuadDirty(id);
        };
        QuadMesh.prototype.transformFunc = function (func) {
            for (var i = 0; i < this._size * constants_1.VERTICES_QUAD; i++) {
                var pos = (i * constants_1.VERTEX_SIZE) >> 1;
                this._loadTemp(pos);
                func(i, this._transTemp);
                this._applyTemp(pos);
            }
            this._setAllDirty();
        };
        QuadMesh.prototype._loadTemp = function (offset) {
            var geo = this._geometry;
            this._transTemp[0] = geo[offset];
            this._transTemp[1] = geo[offset + 1];
            this._transTemp[2] = geo[offset + 2];
        };
        QuadMesh.prototype._applyTemp = function (offset) {
            var geo = this._geometry;
            geo[offset] = this._transTemp[0];
            geo[offset + 1] = this._transTemp[1];
            geo[offset + 2] = this._transTemp[2];
        };
        QuadMesh.prototype.setTexture = function (id, x1, y1, x2, y2) {
            //console.log(x1, y1, x2, y2);
            var vertex = id * constants_1.VERTICES_QUAD;
            this._setVertexUv(vertex, x1, y1);
            this._setVertexUv(vertex + 1, x2, y1);
            this._setVertexUv(vertex + 2, x2, y2);
            this._setVertexUv(vertex + 3, x1, y2);
            this._setQuadDirty(id);
        };
        QuadMesh.prototype.setQuad = function (id, x1, y1, x2, y2, originX1, originY1, originX2, originY2, z, pal) {
            if (z === void 0) { z = constants_1.MIN_Z; }
            if (pal === void 0) { pal = 0; }
            var vertex = id * constants_1.VERTICES_QUAD;
            this._setVertexUv(vertex, originX1, originY1);
            this._setVertexUv(vertex + 1, originX2, originY1);
            this._setVertexUv(vertex + 2, originX2, originY2);
            this._setVertexUv(vertex + 3, originX1, originY2);
            this._setVertexPos(vertex, x1, y1, z);
            this._setVertexPos(vertex + 1, x2, y1, z);
            this._setVertexPos(vertex + 2, x2, y2, z);
            this._setVertexPos(vertex + 3, x1, y2, z);
            this._setVertexPal(vertex, pal);
            this._setVertexPal(vertex + 1, pal);
            this._setVertexPal(vertex + 2, pal);
            this._setVertexPal(vertex + 3, pal);
            this._setQuadDirty(id);
        };
        QuadMesh.prototype.setPal = function (id, pal) {
            var vertex = id * constants_1.VERTICES_QUAD;
            this._setVertexPal(vertex, pal);
            this._setVertexPal(vertex + 1, pal);
            this._setVertexPal(vertex + 2, pal);
            this._setVertexPal(vertex + 3, pal);
            this._setQuadDirty(id);
        };
        // render(shader: twgl.ProgramInfo){
        //     twgl.setBuffersAndAttributes(this._gl, shader, this._bufferInfo);
        //     twgl.drawBufferInfo(this._gl, this._bufferInfo);
        // }
        QuadMesh.prototype.update = function () {
            if (this.isDirty) {
                var gl = this._gl;
                var buffer = this.bufferInfo.attribs["position"].buffer;
                var data = new Uint8Array(this._data, this._dirty_start, this._dirty_end - this._dirty_start);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, this._dirty_start, data);
                this._dirty_start = constants_1.HUGE;
                this._dirty_end = 0;
            }
        };
        QuadMesh.prototype.destroy = function () {
            this._gl.deleteBuffer(this._bufferInfo.attribs["position"].buffer);
            this._gl.deleteBuffer(this._bufferInfo.attribs["texcoord"].buffer);
            this._gl.deleteBuffer(this._bufferInfo.attribs["indices"].buffer);
            this._indices = null;
            this._geometry = null;
            this._texcoord = null;
            this._data = null;
        };
        QuadMesh.prototype._setQuadDirty = function (id) {
            this._dirty_start = Math.min(id * constants_1.QUAD_SIZE, this._dirty_start);
            this._dirty_end = Math.max(id * constants_1.QUAD_SIZE + constants_1.QUAD_SIZE, this._dirty_end);
        };
        QuadMesh.prototype._setAllDirty = function () {
            this._dirty_start = 0;
            this._dirty_end = this._size * constants_1.QUAD_SIZE;
        };
        QuadMesh.prototype._setVertexPos = function (vertex, x, y, z) {
            // divide by two.
            var pos = (vertex * constants_1.VERTEX_SIZE) >> 1;
            var geo = this._geometry;
            geo[pos] = x;
            geo[pos + 1] = y;
            this._setVertexZ(vertex, z);
            //geo[pos+ 2] = z;
        };
        QuadMesh.prototype._setVertexZ = function (vertex, z) {
            var uvs = this._texcoord;
            var pos = (vertex * constants_1.VERTEX_SIZE) + 4;
            uvs[pos] = z;
        };
        QuadMesh.prototype._setVertexPal = function (vertex, palette) {
            var uvs = this._texcoord;
            var pos = (vertex * constants_1.VERTEX_SIZE) + 5;
            uvs[pos] = palette;
        };
        QuadMesh.prototype._setVertexUv = function (vertex, x, y) {
            var uvs = this._texcoord;
            var pos = (vertex * constants_1.VERTEX_SIZE) + constants_1.OFFSET_UV;
            uvs[pos] = x;
            uvs[pos + 1] = y;
        };
        QuadMesh.prototype._createIndices = function () {
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
        return QuadMesh;
    }());
    exports.QuadMesh = QuadMesh;
});
//# sourceMappingURL=QuadMesh.js.map