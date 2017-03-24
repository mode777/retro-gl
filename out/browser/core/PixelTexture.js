define(["require", "exports", "./constants"], function (require, exports, constants_1) {
    "use strict";
    var ColorComponent;
    (function (ColorComponent) {
        ColorComponent[ColorComponent["R"] = 0] = "R";
        ColorComponent[ColorComponent["G"] = 1] = "G";
        ColorComponent[ColorComponent["B"] = 2] = "B";
        ColorComponent[ColorComponent["A"] = 3] = "A";
    })(ColorComponent = exports.ColorComponent || (exports.ColorComponent = {}));
    var PixelTexture = (function () {
        function PixelTexture(_gl) {
            this._gl = _gl;
            this._dirtyStart = constants_1.HUGE;
            this._dirtyEnd = 0;
            this._texdata = new Uint8Array(constants_1.TEXTURE_SIZE * constants_1.TEXTURE_SIZE * this._components);
        }
        Object.defineProperty(PixelTexture.prototype, "texture", {
            get: function () {
                if (!this._texture)
                    throw "No texture available. Did you forget to call create(...)?";
                return this._texture;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PixelTexture.prototype, "rawData", {
            get: function () {
                return this._texdata;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PixelTexture.prototype, "colorDepth", {
            get: function () {
                switch (this._options.format) {
                    case this._gl.RGBA:
                        return 32;
                    case this._gl.LUMINANCE:
                    case this._gl.ALPHA:
                        return 8;
                    case this._gl.RGB:
                        return 24;
                }
            },
            enumerable: true,
            configurable: true
        });
        PixelTexture.prototype.setDataFunc = function (func) {
            var tex = this._texdata;
            var f = Math.floor;
            var totalComp = this._components;
            for (var i = 0; i < tex.length; i++) {
                var comp = i % totalComp;
                var pixel = Math.floor((i - comp) / totalComp);
                tex[i] = func(pixel % constants_1.TEXTURE_SIZE, Math.floor(pixel / constants_1.TEXTURE_SIZE), i % totalComp);
            }
            this.setAllDirty();
        };
        PixelTexture.prototype.create = function () {
            this._texture = twgl.createTexture(this._gl, this._options);
            this._dirtyEnd = 0;
            this._dirtyStart = constants_1.HUGE;
            return this;
        };
        PixelTexture.prototype.update = function () {
            var updateLength = this._dirtyEnd - this._dirtyStart;
            if (updateLength > 0) {
                var o = this._options;
                var updateData = new Uint8Array(this._texdata.buffer, this._dirtyStart, updateLength);
                var rowSize = this._components * constants_1.TEXTURE_SIZE;
                var x = 0;
                var y = Math.floor(this._dirtyStart / rowSize);
                var w = 256;
                var h = Math.floor(updateLength / rowSize);
                console.log(x, y, w, h);
                this._gl.bindTexture(o.target, this.texture);
                this._gl.texSubImage2D(o.target, 0, x, y, w, h, o.format, o.type, updateData);
                this._dirtyEnd = 0;
                this._dirtyStart = constants_1.HUGE;
            }
        };
        PixelTexture.prototype.setAllDirty = function () {
            this._dirtyStart = 0;
            this._dirtyEnd = this._texdata.length;
        };
        PixelTexture.prototype.getPixel = function (x, y) {
            var c = this._components;
            var res = new Array(c);
            var offset = (y * constants_1.TEXTURE_SIZE + x) * c;
            for (var i = 0; i < c; i++) {
                res[i] = this._texdata[offset + i];
            }
            return res;
        };
        PixelTexture.prototype.setPixel = function (x, y, color) {
            var c = this._components;
            if (color.length != c)
                throw "Color needs to be an array with length " + c;
            var offset = (y * constants_1.TEXTURE_SIZE + x) * c;
            for (var i = 0; i < c; i++) {
                this._texdata[offset + i] = color[i];
            }
            this.setRowDirty(y);
        };
        PixelTexture.prototype.setRowDirty = function (y) {
            var start = y * constants_1.TEXTURE_SIZE * this._components;
            this._dirtyStart = Math.min(this._dirtyStart, start);
            this._dirtyEnd = Math.max(this._dirtyEnd, start + constants_1.TEXTURE_SIZE * this._components);
        };
        return PixelTexture;
    }());
    exports.PixelTexture = PixelTexture;
});
//# sourceMappingURL=PixelTexture.js.map