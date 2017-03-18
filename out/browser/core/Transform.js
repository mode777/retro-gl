define(["require", "exports"], function (require, exports) {
    "use strict";
    var Transform2d = (function () {
        function Transform2d() {
            this._dirty = true;
            this._rDirty = true;
            this._matrix = mat4.create();
            this._quat = quat.create();
            this._trans = vec3.fromValues(0, 0, 0);
            this._origin = vec3.fromValues(0, 0, 0);
            this._scale = vec3.fromValues(1, 1, 1);
            this._axis = vec3.fromValues(0, 0, 1);
            this._angle = 0;
        }
        Object.defineProperty(Transform2d.prototype, "matrix", {
            get: function () {
                if (this._dirty)
                    this._buildMatrix();
                this._buildMatrix();
                return this._matrix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform2d.prototype, "x", {
            get: function () {
                return this._trans[0];
            },
            set: function (value) {
                this._trans[0] = value;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform2d.prototype, "y", {
            get: function () {
                return this._trans[1];
            },
            set: function (value) {
                this._trans[1] = value;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform2d.prototype, "z", {
            get: function () {
                return this._trans[2];
            },
            set: function (value) {
                this._trans[2] = value;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform2d.prototype, "rot", {
            get: function () {
                return this._angle;
            },
            set: function (value) {
                this._angle = value;
                this._rDirty = true;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform2d.prototype, "sx", {
            get: function () {
                return this._scale[0];
            },
            set: function (value) {
                this._scale[0] = value;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform2d.prototype, "sy", {
            get: function () {
                return this._scale[1];
            },
            set: function (value) {
                this._scale[1] = value;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform2d.prototype, "ox", {
            get: function () {
                return this._origin[0];
            },
            set: function (value) {
                this._origin[0] = value;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform2d.prototype, "oy", {
            get: function () {
                return this._origin[1];
            },
            set: function (value) {
                this._origin[1] = value;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform2d.prototype, "isDirty", {
            get: function () {
                return this._dirty;
            },
            enumerable: true,
            configurable: true
        });
        Transform2d.prototype.update = function () {
            if (this._dirty)
                this._buildMatrix();
        };
        Transform2d.prototype._buildMatrix = function () {
            if (this._rDirty)
                this._buildQuat();
            mat4.fromRotationTranslationScaleOrigin(this._matrix, this._quat, this._trans, this._scale, this._origin);
            this._dirty = false;
        };
        Transform2d.prototype._buildQuat = function () {
            quat.setAxisAngle(this._quat, this._axis, this._angle);
            this._rDirty = false;
        };
        return Transform2d;
    }());
    exports.Transform2d = Transform2d;
});
//# sourceMappingURL=Transform.js.map