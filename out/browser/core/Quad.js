define(["require", "exports", "./constants"], function (require, exports, constants_1) {
    "use strict";
    var Quad = (function () {
        function Quad(_data, _offset) {
            if (_data === void 0) { _data = new ArrayBuffer(constants_1.VERTEX_SIZE * constants_1.VERTICES_QUAD); }
            if (_offset === void 0) { _offset = 0; }
            this._data = _data;
            this._offset = _offset;
            this._pos1 = new Uint16Array(this._data, this._offset, 2);
            this._pos2 = new Uint16Array(this._data, this._offset + constants_1.VERTEX_SIZE, 2);
            this._pos3 = new Uint16Array(this._data, this._offset + constants_1.VERTEX_SIZE * 2, 2);
            this._pos4 = new Uint16Array(this._data, this._offset + constants_1.VERTEX_SIZE * 3, 2);
            this._z_shift1 = new Uint8Array(this._data, this._offset + constants_1.OFFSET_Z_INDEX, 2);
            this._z_shift2 = new Uint8Array(this._data, this._offset + constants_1.VERTEX_SIZE + constants_1.OFFSET_Z_INDEX, 2);
            this._z_shift3 = new Uint8Array(this._data, this._offset + constants_1.VERTEX_SIZE * 2 + constants_1.OFFSET_Z_INDEX, 2);
            this._z_shift4 = new Uint8Array(this._data, this._offset + constants_1.VERTEX_SIZE * 3 + constants_1.OFFSET_Z_INDEX, 2);
            this._uv1 = new Uint8Array(this._data, this._offset + constants_1.OFFSET_UV, 2);
            this._uv2 = new Uint8Array(this._data, this._offset + constants_1.VERTEX_SIZE + constants_1.OFFSET_UV, 2);
            this._uv3 = new Uint8Array(this._data, this._offset + constants_1.VERTEX_SIZE * 2 + constants_1.OFFSET_UV, 2);
            this._uv4 = new Uint8Array(this._data, this._offset + constants_1.VERTEX_SIZE * 3 + constants_1.OFFSET_UV, 2);
        }
        Quad.prototype.applyTransform = function (matrix, out_quad) {
            if (out_quad === void 0) { out_quad = this; }
            vec2.transformMat4(out_quad._pos1, this._pos1, matrix);
            //this._transVec2(matrix, <vec2>this._pos1, <vec2>out_quad._pos1);
            //this._transVec2(matrix, <vec2>this._pos2, <vec2>out_quad._pos2);
            //this._transVec2(matrix, <vec2>this._pos3, <vec2>out_quad._pos3);
            //this._transVec2(matrix, <vec2>this._pos4, <vec2>out_quad._pos4);
            return out_quad;
        };
        Quad.prototype.setPos = function (x, y, w, h) {
            this._pos1[0] = x;
            this._pos1[1] = y;
            this._pos2[0] = x + w;
            this._pos2[1] = y;
            this._pos3[0] = x + w;
            this._pos3[1] = y + h;
            this._pos4[0] = x;
            this._pos4[1] = y + h;
        };
        Quad.prototype.setUv = function (x, y, w, h) {
            this._uv1[0] = x;
            this._uv1[1] = y;
            this._uv2[0] = x + w;
            this._uv2[1] = y;
            this._uv3[0] = x + w;
            this._uv3[1] = y + h;
            this._uv4[0] = x;
            this._uv4[1] = y + h;
        };
        Quad.prototype.setZ = function (z) {
            this._z_shift1[0] = z;
            this._z_shift2[0] = z;
            this._z_shift3[0] = z;
            this._z_shift4[0] = z;
        };
        Quad.prototype.setPalShift = function (s) {
            this._z_shift1[1] = s;
            this._z_shift2[1] = s;
            this._z_shift3[1] = s;
            this._z_shift4[1] = s;
        };
        Quad.prototype.setAttributes = function (x, y, w, h, z, pal, ux, uy, uw, uh) {
            this.setPos(x, y, w, h);
            this.setZ(z);
            this.setPalShift(pal);
            this.setUv(ux, uy, uw, uh);
        };
        return Quad;
    }());
    exports.Quad = Quad;
});
//# sourceMappingURL=Quad.js.map