var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GifBlock = (function () {
        function GifBlock(_view, _offset) {
            this._view = _view;
            this._offset = _offset;
        }
        return GifBlock;
    }());
    exports.GifBlock = GifBlock;
    var COLOR_TABLE_FLAG = 128;
    var OCT_MASK = 7;
    var SORT_FLAG = 8;
    var LogicalScreenDescriptorBlock = (function (_super) {
        __extends(LogicalScreenDescriptorBlock, _super);
        function LogicalScreenDescriptorBlock() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(LogicalScreenDescriptorBlock.prototype, "length", {
            get: function () {
                return 7;
            },
            enumerable: true,
            configurable: true
        });
        LogicalScreenDescriptorBlock.prototype.read = function () {
            this._cw = this._view.getUint16(this._offset, true);
            this._ch = this._view.getUint16(this._offset + 2, true);
            this._flags = this._view.getUint8(this._offset + 4);
            this._bg = this._view.getUint8(this._offset + 5);
            this._ratio = this._view.getUint8(this._offset + 6);
            return length;
        };
        Object.defineProperty(LogicalScreenDescriptorBlock.prototype, "canvasWidth", {
            get: function () {
                return this._cw;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LogicalScreenDescriptorBlock.prototype, "canvasHeight", {
            get: function () {
                return this._ch;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LogicalScreenDescriptorBlock.prototype, "hasGlobalColorTable", {
            get: function () {
                return (this._flags & COLOR_TABLE_FLAG) > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LogicalScreenDescriptorBlock.prototype, "paletteSorted", {
            get: function () {
                return (this._flags & SORT_FLAG) > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LogicalScreenDescriptorBlock.prototype, "colorDepth", {
            get: function () {
                return ((this._flags >> 4) & OCT_MASK) + 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LogicalScreenDescriptorBlock.prototype, "totalColors", {
            get: function () {
                return 1 << ((this._flags & OCT_MASK) + 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LogicalScreenDescriptorBlock.prototype, "backgroundColor", {
            get: function () {
                return this._bg;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LogicalScreenDescriptorBlock.prototype, "pixelAspect", {
            get: function () {
                return this._ratio == 0 ? 0 : (this._ratio + 15) / 64;
            },
            enumerable: true,
            configurable: true
        });
        return LogicalScreenDescriptorBlock;
    }(GifBlock));
    exports.LogicalScreenDescriptorBlock = LogicalScreenDescriptorBlock;
    var PAL_COLOR_COMP = 3;
    var ColorTableBock = (function (_super) {
        __extends(ColorTableBock, _super);
        function ColorTableBock(view, offset, _colors) {
            var _this = _super.call(this, view, offset) || this;
            _this._colors = _colors;
            return _this;
        }
        Object.defineProperty(ColorTableBock.prototype, "length", {
            get: function () {
                return this._colors * PAL_COLOR_COMP;
            },
            enumerable: true,
            configurable: true
        });
        ColorTableBock.prototype.read = function () {
            console.log(this._colors);
            this._data = new Uint8Array(this._view.buffer, this._offset, this.length);
            return this.length;
        };
        ColorTableBock.prototype.data = function () {
            return this._data;
        };
        return ColorTableBock;
    }(GifBlock));
    exports.ColorTableBock = ColorTableBock;
});
// export class ExtensionBlock extends GifBlock {
// } 
//# sourceMappingURL=blocks.js.map