define(["require", "exports", "./constants"], function (require, exports, constants_1) {
    "use strict";
    var Renderable = (function () {
        function Renderable(mesh, texture, palette, _paletteId) {
            this.mesh = mesh;
            this.texture = texture;
            this.palette = palette;
            this._paletteId = _paletteId;
            this.paletteId = _paletteId;
        }
        Object.defineProperty(Renderable.prototype, "paletteId", {
            get: function () {
                return this._paletteId;
            },
            set: function (value) {
                this._paletteId = value;
                this._pOffsetX = (value % 16) * constants_1.PAL_OFFSET;
                this._pOffsetY = Math.floor(value / 16) * constants_1.PAL_OFFSET;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderable.prototype, "palOffsetX", {
            get: function () {
                return this._pOffsetX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderable.prototype, "palOffsetY", {
            get: function () {
                return this._pOffsetY;
            },
            enumerable: true,
            configurable: true
        });
        return Renderable;
    }());
    exports.Renderable = Renderable;
});
//# sourceMappingURL=Renderable.js.map