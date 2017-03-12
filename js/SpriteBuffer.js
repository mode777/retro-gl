var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./QuadBuffer", "./Transform"], function (require, exports, QuadBuffer_1, Transform_1) {
    "use strict";
    //export type AttributeKey = "x" | "y" | "w" | "h" | "z" | "palOffset" | "textureX" | "textureY" | "textureW" | "textureH";
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
                this._buffer.SetPositionTransformed(id, a.x, a.y, a.x + a.w, a.y + a.h, m);
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
    exports.BufferedSprite = BufferedSprite;
    var SpriteBuffer = (function (_super) {
        __extends(SpriteBuffer, _super);
        function SpriteBuffer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SpriteBuffer;
    }(QuadBuffer_1.QuadBuffer));
    exports.SpriteBuffer = SpriteBuffer;
});
//# sourceMappingURL=SpriteBuffer.js.map