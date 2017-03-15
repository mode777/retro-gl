define(["require", "exports", "./Transform"], function (require, exports, Transform_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Renderable = (function () {
        function Renderable(_options) {
            this._options = _options;
            _options.transform = _options.transform || new Transform_1.Transform2d();
            this.paletteId = _options.paletteId;
        }
        Object.defineProperty(Renderable.prototype, "paletteId", {
            get: function () {
                return this._options.paletteId;
            },
            set: function (value) {
                this._options.paletteId = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderable.prototype, "texture", {
            get: function () {
                return this._options.texture;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderable.prototype, "buffer", {
            get: function () {
                return this._options.buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderable.prototype, "palette", {
            get: function () {
                return this._options.palette;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderable.prototype, "shader", {
            get: function () {
                return this._options.shader;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderable.prototype, "transform", {
            get: function () {
                return this._options.transform;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderable.prototype, "zSort", {
            get: function () {
                return this._options.zSort;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderable.prototype, "blendMode", {
            get: function () {
                return this._options.blendMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderable.prototype, "mode7", {
            get: function () {
                return this._options.mode7;
            },
            enumerable: true,
            configurable: true
        });
        return Renderable;
    }());
    exports.Renderable = Renderable;
});
//# sourceMappingURL=Renderable.js.map