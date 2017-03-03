define(["require", "exports"], function (require, exports) {
    "use strict";
    var Renderer = (function () {
        function Renderer(_gl, _shader) {
            this._gl = _gl;
            this._shader = _shader;
            this.renderList = [];
            this._projection = mat4.create();
            mat4.ortho(this._projection, 0, _gl.canvas.width, _gl.canvas.height, 0, 1, -1);
        }
        Renderer.prototype.render = function () {
            var _this = this;
            this.renderList.forEach(function (r) { return r.mesh.update(); });
            //this._gl.clear(this._gl.COLOR_CLEAR_VALUE);
            this._gl.useProgram(this._shader.program);
            twgl.setUniforms(this._shader, {
                proj: this._projection,
            });
            this.renderList.forEach(function (r) {
                var u = _this._getUniforms(r);
                if (u) {
                    twgl.setUniforms(_this._shader, u);
                }
                twgl.setBuffersAndAttributes(_this._gl, _this._shader, r.mesh.bufferInfo);
                twgl.drawBufferInfo(_this._gl, r.mesh.bufferInfo);
            });
        };
        Renderer.prototype._getUniforms = function (r) {
            var changed = false;
            var u = {};
            if (r.texture != this._texture) {
                changed = true;
                this._texture = u["texture"] = r.texture;
            }
            if (r.palette != this._palette) {
                changed = true;
                this._palette = u["palette"] = r.palette;
            }
            if (r.paletteId != this._paletteId) {
                changed = true;
                this._paletteId = r.paletteId;
                this._palette_x = u["palette_x"] = r.palOffsetX;
                this._palette_y = u["palette_y"] = r.palOffsetY;
            }
            if (changed)
                return u;
            else
                return null;
        };
        return Renderer;
    }());
    exports.Renderer = Renderer;
});
//# sourceMappingURL=Renderer.js.map