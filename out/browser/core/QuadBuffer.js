define(["require", "exports", "./constants", "./Transform"], function (require, exports, constants_1, Transform_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var POS_OFFSET_1X = 0;
    var POS_OFFSET_1Y = POS_OFFSET_1X + 1;
    var POS_OFFSET_2X = constants_1.VERTEX_SIZE_SHORT;
    var POS_OFFSET_2Y = POS_OFFSET_2X + 1;
    var POS_OFFSET_3X = constants_1.VERTEX_SIZE_SHORT * 2;
    var POS_OFFSET_3Y = POS_OFFSET_3X + 1;
    var POS_OFFSET_4X = constants_1.VERTEX_SIZE_SHORT * 3;
    var POS_OFFSET_4Y = POS_OFFSET_4X + 1;
    var Z_OFFSET_1 = constants_1.OFFSET_Z_INDEX;
    var Z_OFFSET_2 = constants_1.VERTEX_SIZE + constants_1.OFFSET_Z_INDEX;
    var Z_OFFSET_3 = constants_1.VERTEX_SIZE * 2 + constants_1.OFFSET_Z_INDEX;
    var Z_OFFSET_4 = constants_1.VERTEX_SIZE * 3 + constants_1.OFFSET_Z_INDEX;
    var PAL_OFFSET_1 = constants_1.OFFSET_PAL_SHIFT;
    var PAL_OFFSET_2 = constants_1.VERTEX_SIZE + constants_1.OFFSET_PAL_SHIFT;
    var PAL_OFFSET_3 = constants_1.VERTEX_SIZE * 2 + constants_1.OFFSET_PAL_SHIFT;
    var PAL_OFFSET_4 = constants_1.VERTEX_SIZE * 3 + constants_1.OFFSET_PAL_SHIFT;
    var UV_OFFSET_1X = constants_1.OFFSET_UV;
    var UV_OFFSET_1Y = UV_OFFSET_1X + 1;
    var UV_OFFSET_2X = constants_1.VERTEX_SIZE + constants_1.OFFSET_UV;
    var UV_OFFSET_2Y = UV_OFFSET_2X + 1;
    var UV_OFFSET_3X = constants_1.VERTEX_SIZE * 2 + constants_1.OFFSET_UV;
    var UV_OFFSET_3Y = UV_OFFSET_3X + 1;
    var UV_OFFSET_4X = constants_1.VERTEX_SIZE * 3 + constants_1.OFFSET_UV;
    var UV_OFFSET_4Y = UV_OFFSET_4X + 1;
    var BufferedSprite = (function () {
        function BufferedSprite(_id, _buffer, transform, options) {
            this._id = _id;
            this._buffer = _buffer;
            this._isDirty = true;
            this._transform = transform || new Transform_1.Transform2d();
            this._options = options || _buffer.getAttributeInfo(_id);
        }
        Object.defineProperty(BufferedSprite.prototype, "transform", {
            get: function () {
                return this._transform;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BufferedSprite.prototype, "isDirty", {
            get: function () {
                return this._isDirty;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BufferedSprite.prototype, "x", {
            get: function () {
                return this._options.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BufferedSprite.prototype, "y", {
            get: function () {
                return this._options.y;
            },
            enumerable: true,
            configurable: true
        });
        // setAttribute(key: AttributeKey, value: any){
        //     this._isDirty = true;
        //     this._options[key] = value;
        // }
        BufferedSprite.prototype.update = function () {
            if (this._transform.isDirty || this._isDirty) {
                var a = this._options;
                var m = this._transform.matrix;
                var id = this._id;
                this._buffer.setPositionTransformed(id, a.x, a.y, a.x + a.w, a.y + a.h, m);
                this._buffer.setZ(id, a.z || 1);
                this._buffer.setPalShift(id, a.palOffset || 0);
                this._buffer.setUv(id, a.textureX, a.textureY, a.textureX + a.w, a.textureY + a.h);
                this._isDirty = false;
            }
        };
        BufferedSprite.prototype.center = function () {
            this._transform.ox = this._options.x + this._options.w / 2;
            this._transform.oy = this._options.y + this._options.h / 2;
        };
        return BufferedSprite;
    }());
    var QuadBuffer = (function () {
        function QuadBuffer(_gl, _size) {
            this._gl = _gl;
            this._size = _size;
            this._dirty_start = constants_1.HUGE;
            this._dirty_end = 0;
            this._data = new ArrayBuffer(_size * constants_1.VERTICES_QUAD * constants_1.VERTEX_SIZE);
            this._shortView = new Uint16Array(this._data);
            this._byteView = new Uint8Array(this._data);
            this._indices = new Uint16Array(_size * constants_1.INDICES_QUAD);
            this._createIndices();
        }
        Object.defineProperty(QuadBuffer.prototype, "isDirty", {
            get: function () {
                return (this._dirty_end - this._dirty_start) > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuadBuffer.prototype, "bufferInfo", {
            get: function () {
                if (!this._bufferInfo)
                    throw "Buffer not created. Did you forget to call create(...)?";
                return this._bufferInfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuadBuffer.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuadBuffer.prototype, "range", {
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
        QuadBuffer.prototype.update = function () {
            if (this._sprites) {
                this._sprites.forEach(function (s) { return s.update(); });
            }
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
        QuadBuffer.prototype.destroy = function () {
            this._gl.deleteBuffer(this._bufferInfo.attribs["position"].buffer);
            this._gl.deleteBuffer(this._bufferInfo.attribs["texcoord"].buffer);
            this._gl.deleteBuffer(this._bufferInfo.attribs["indices"].buffer);
            this._indices = null;
            this._shortView = null;
            this._byteView = null;
            this._data = null;
        };
        QuadBuffer.prototype.create = function () {
            var packedBuffer = twgl.createBufferFromTypedArray(this._gl, this._data, this._gl.ARRAY_BUFFER, this._gl.DYNAMIC_DRAW);
            var indexBuffer = twgl.createBufferFromTypedArray(this._gl, this._indices, this._gl.ELEMENT_ARRAY_BUFFER);
            this._bufferInfo = {
                numElements: this._range ? this._range * constants_1.INDICES_QUAD : this._indices.length,
                indices: indexBuffer,
                elementType: this._gl.UNSIGNED_SHORT,
                attribs: {
                    position: {
                        buffer: packedBuffer,
                        numComponents: constants_1.COMP_POS,
                        type: this._gl.UNSIGNED_SHORT,
                        stride: constants_1.VERTEX_SIZE,
                        offset: 0
                    },
                    z_index: {
                        buffer: packedBuffer,
                        numComponents: constants_1.COMP_Z_INDEX,
                        type: this._gl.UNSIGNED_BYTE,
                        stride: constants_1.VERTEX_SIZE,
                        offset: constants_1.OFFSET_Z_INDEX,
                        normalize: false
                    },
                    pal_shift: {
                        buffer: packedBuffer,
                        numComponents: constants_1.COMP_PAL_PAL_SHIFT,
                        type: this._gl.UNSIGNED_BYTE,
                        stride: constants_1.VERTEX_SIZE,
                        offset: constants_1.OFFSET_PAL_SHIFT,
                        normalize: true
                    },
                    texcoord: {
                        buffer: packedBuffer,
                        numComponents: constants_1.COMP_UV,
                        type: this._gl.UNSIGNED_BYTE,
                        stride: constants_1.VERTEX_SIZE,
                        offset: constants_1.OFFSET_UV,
                        normalize: false
                    },
                },
            };
            this._range = this._bufferInfo.numElements / constants_1.INDICES_QUAD;
            this._dirty_start = constants_1.HUGE;
            this._dirty_end = 0;
            return this;
        };
        QuadBuffer.prototype.setPosition = function (id, x1, y1, x2, y2) {
            var start = id * constants_1.QUAD_SIZE_SHORT;
            var pos = this._shortView;
            pos[start + POS_OFFSET_1X] = x1;
            pos[start + POS_OFFSET_1Y] = y1;
            pos[start + POS_OFFSET_2X] = x2;
            pos[start + POS_OFFSET_2Y] = y1;
            pos[start + POS_OFFSET_3X] = x2;
            pos[start + POS_OFFSET_3Y] = y2;
            pos[start + POS_OFFSET_4X] = x1;
            pos[start + POS_OFFSET_4Y] = y2;
            this.setQuadDirty(start);
        };
        QuadBuffer.prototype.setPositionTransformed = function (id, x1, y1, x2, y2, m) {
            var start = id * constants_1.QUAD_SIZE_SHORT;
            var pos = this._shortView;
            pos[start + POS_OFFSET_1X] = m[0] * x1 + m[4] * y1 + m[12];
            pos[start + POS_OFFSET_1Y] = m[1] * x1 + m[5] * y1 + m[13];
            pos[start + POS_OFFSET_2X] = m[0] * x2 + m[4] * y1 + m[12];
            pos[start + POS_OFFSET_2Y] = m[1] * x2 + m[5] * y1 + m[13];
            pos[start + POS_OFFSET_3X] = m[0] * x2 + m[4] * y2 + m[12];
            pos[start + POS_OFFSET_3Y] = m[1] * x2 + m[5] * y2 + m[13];
            pos[start + POS_OFFSET_4X] = m[0] * x1 + m[4] * y2 + m[12];
            pos[start + POS_OFFSET_4Y] = m[1] * x1 + m[5] * y2 + m[13];
        };
        QuadBuffer.prototype.setUv = function (id, x1, y1, x2, y2) {
            var start = id * constants_1.QUAD_SIZE;
            var bytes = this._byteView;
            bytes[start + UV_OFFSET_1X] = x1;
            bytes[start + UV_OFFSET_1Y] = y1;
            bytes[start + UV_OFFSET_2X] = x2 - 1;
            bytes[start + UV_OFFSET_2Y] = y1;
            bytes[start + UV_OFFSET_3X] = x2 - 1;
            bytes[start + UV_OFFSET_3Y] = y2 - 1;
            bytes[start + UV_OFFSET_4X] = x1;
            bytes[start + UV_OFFSET_4Y] = y2 - 1;
            this.setQuadDirty(start);
        };
        QuadBuffer.prototype.setPalShift = function (id, pal) {
            var start = id * constants_1.QUAD_SIZE;
            var bytes = this._byteView;
            bytes[start + PAL_OFFSET_1] = pal;
            bytes[start + PAL_OFFSET_2] = pal;
            bytes[start + PAL_OFFSET_3] = pal;
            bytes[start + PAL_OFFSET_4] = pal;
            this.setQuadDirty(start);
        };
        QuadBuffer.prototype.getPalShift = function (id) {
            return this._byteView[id * constants_1.QUAD_SIZE + PAL_OFFSET_1];
        };
        QuadBuffer.prototype.setZ = function (id, z) {
            var start = id * constants_1.QUAD_SIZE;
            var bytes = this._byteView;
            bytes[start + Z_OFFSET_1] = z;
            bytes[start + Z_OFFSET_2] = z;
            bytes[start + Z_OFFSET_3] = z;
            bytes[start + Z_OFFSET_4] = z;
            this.setQuadDirty(start);
        };
        QuadBuffer.prototype.getZ = function (id) {
            return this._byteView[id * constants_1.QUAD_SIZE + Z_OFFSET_1];
        };
        QuadBuffer.prototype.setAttributes = function (id, x1, y1, x2, y2, uvx1, uvy1, uvx2, uvy2, z, pal) {
            var startShort = id * constants_1.QUAD_SIZE_SHORT;
            var startByte = id * constants_1.QUAD_SIZE;
            var shorts = this._shortView;
            var bytes = this._byteView;
            shorts[startShort + POS_OFFSET_1X] = x1;
            shorts[startShort + POS_OFFSET_1Y] = y1;
            bytes[startByte + Z_OFFSET_1] = z;
            bytes[startByte + PAL_OFFSET_1] = pal;
            bytes[startByte + UV_OFFSET_1X] = uvx1;
            bytes[startByte + UV_OFFSET_1Y] = uvy1;
            shorts[startShort + POS_OFFSET_2X] = x2;
            shorts[startShort + POS_OFFSET_2Y] = y1;
            bytes[startByte + Z_OFFSET_2] = z;
            bytes[startByte + PAL_OFFSET_2] = pal;
            bytes[startByte + UV_OFFSET_2X] = uvx2 - 1;
            bytes[startByte + UV_OFFSET_2Y] = uvy1;
            shorts[startShort + POS_OFFSET_3X] = x2;
            shorts[startShort + POS_OFFSET_3Y] = y2;
            bytes[startByte + Z_OFFSET_3] = z;
            bytes[startByte + PAL_OFFSET_3] = pal;
            bytes[startByte + UV_OFFSET_3X] = uvx2 - 1;
            bytes[startByte + UV_OFFSET_3Y] = uvy2 - 1;
            shorts[startShort + POS_OFFSET_4X] = x1;
            shorts[startShort + POS_OFFSET_4Y] = y2;
            bytes[startByte + Z_OFFSET_4] = z;
            bytes[startByte + PAL_OFFSET_4] = pal;
            bytes[startByte + UV_OFFSET_4X] = uvx1;
            bytes[startByte + UV_OFFSET_4Y] = uvy2 - 1;
            this.setQuadDirty(startByte);
        };
        QuadBuffer.prototype.getAttributeInfo = function (id) {
            var startShort = id * constants_1.QUAD_SIZE_SHORT;
            var startByte = id * constants_1.QUAD_SIZE;
            var shorts = this._shortView;
            var bytes = this._byteView;
            return {
                x: shorts[startShort + POS_OFFSET_1X],
                y: shorts[startShort + POS_OFFSET_1Y],
                w: shorts[startShort + POS_OFFSET_3X] - shorts[startShort + POS_OFFSET_1X],
                h: shorts[startShort + POS_OFFSET_3Y] - shorts[startShort + POS_OFFSET_1Y],
                z: bytes[startByte + Z_OFFSET_1],
                palOffset: bytes[startByte + PAL_OFFSET_1],
                textureX: bytes[startByte + UV_OFFSET_1X],
                textureY: bytes[startByte + UV_OFFSET_1Y]
            };
        };
        QuadBuffer.prototype.setAttributeBytes = function (id, values) {
            var startByte = id * constants_1.QUAD_SIZE;
            var bytes = this._byteView;
            bytes.set(values, startByte);
            this.setQuadDirty(startByte);
        };
        QuadBuffer.prototype.getAttributeBytes = function (id, values) {
            var startByte = id * constants_1.QUAD_SIZE;
            return new Uint8Array(this._data, startByte, constants_1.QUAD_SIZE);
        };
        QuadBuffer.prototype.clearQuad = function (id) {
            this.setAttributes(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        };
        QuadBuffer.prototype.setQuadDirty = function (byteOffset) {
            this._dirty_start = Math.min(byteOffset, this._dirty_start);
            this._dirty_end = Math.max(byteOffset + constants_1.QUAD_SIZE, this._dirty_end);
        };
        QuadBuffer.prototype.setAllDirty = function () {
            this._dirty_start = 0;
            this._dirty_end = this._size * constants_1.QUAD_SIZE;
        };
        QuadBuffer.prototype.createSprite = function (id, transform, options) {
            var sprite = new BufferedSprite(id, this, transform, options);
            this._sprites = this._sprites || [];
            this._sprites.push(sprite);
            return sprite;
        };
        QuadBuffer.prototype._createIndices = function () {
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
        QuadBuffer.prototype._vec2Transform = function (x, y, m, offset) {
            if (offset === void 0) { offset = 0; }
            this._shortView[offset] = m[0] * x + m[4] * y + m[12];
            this._shortView[offset + 1] = m[1] * x + m[5] * y + m[13];
        };
        return QuadBuffer;
    }());
    exports.QuadBuffer = QuadBuffer;
});
//# sourceMappingURL=QuadBuffer.js.map