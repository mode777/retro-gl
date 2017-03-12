define(["require", "exports", "./constants"], function (require, exports, constants_1) {
    "use strict";
    var Renderer = (function () {
        function Renderer(_gl, settings) {
            this._gl = _gl;
            this.renderList = [];
            this._settings = {};
            this.a = 0;
            this._ortho = mat4.ortho(mat4.create(), 0, _gl.canvas.width, _gl.canvas.height, 0, -256, 0);
            this._projection = mat4.perspective(mat4.create(), 1, 1, -255, 0);
            this._view = mat4.lookAt(mat4.create(), vec3.fromValues(0, -1, 1.3), vec3.fromValues(0, 1, .5), vec3.fromValues(0, 1, 0));
            this._matrix = mat4.create();
            var t = vec4.fromValues(0, 0, 0, 1);
            this._buildMatrix(false);
            vec4.transformMat4(t, t, this._matrix);
            console.log(t);
            this.setDefaults(settings);
        }
        Renderer.prototype.setDefaults = function (defaults) {
            this._defaults = $.extend({}, defaults);
        };
        Renderer.prototype.render = function () {
            var _this = this;
            this.renderList.forEach(function (r) { return r.buffer.update(); });
            //this._gl.clear(this._gl.COLOR_CLEAR_VALUE);
            this._gl.useProgram(this._defaults.shader.program);
            this.renderList.forEach(function (r) {
                _this._setOptions(r);
                _this._buildMatrix(r.mode7);
                var u = _this._getUniforms(r);
                if (u) {
                    twgl.setUniforms(_this._defaults.shader, u);
                }
                twgl.setBuffersAndAttributes(_this._gl, _this._defaults.shader, r.buffer.bufferInfo);
                twgl.drawBufferInfo(_this._gl, r.buffer.bufferInfo);
            });
        };
        Renderer.prototype._setOptions = function (r) {
            var zSort = r.zSort != undefined ? r.zSort : this._defaults.zSort;
            var blendMode = r.blendMode || this._defaults.blendMode;
            if (zSort != this._settings.zSort) {
                zSort
                    ? this._gl.enable(this._gl.DEPTH_TEST)
                    : this._gl.disable(this._gl.DEPTH_TEST);
                this._settings.zSort = zSort;
            }
            if (blendMode != this._settings.blendMode) {
                switch (blendMode) {
                    case "alpha":
                        this._gl.enable(this._gl.BLEND);
                        this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
                        break;
                    default:
                        this._gl.disable(this._gl.BLEND);
                        break;
                }
                this._settings.blendMode = blendMode;
            }
        };
        Renderer.prototype._buildMatrix = function (mode7) {
            if (mode7) {
                mat4.mul(this._matrix, this._projection, this._view);
                mat4.mul(this._matrix, this._matrix, this._ortho);
            }
            else {
                mat4.mul(this._matrix, this._ortho, constants_1.MAT4_IDENT);
            }
        };
        Renderer.prototype._getUniforms = function (r) {
            this.a -= 0.0001;
            var a = this.a;
            var u = {
                matrix: this._matrix,
            };
            var texture = r.texture || this._defaults.texture;
            var palette = r.palette || this._defaults.palette;
            var paletteId = r.paletteId || this._defaults.paletteId;
            if (texture != this._settings.texture)
                this._settings.texture = u["texture"] = texture;
            if (palette != this._settings.palette)
                this._settings.palette = u["palette"] = palette;
            if (paletteId != this._settings.paletteId) {
                this._settings.paletteId = paletteId;
                u["pal_offset"] = paletteId * constants_1.PAL_OFFSET;
            }
            return u;
        };
        return Renderer;
    }());
    exports.Renderer = Renderer;
});
//# sourceMappingURL=Renderer.js.map