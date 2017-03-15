define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FLOAT_SIZE = 4;
    exports.SHORT_SIZE = 2;
    exports.BYTE_SIZE = 1;
    exports.VERTICES_QUAD = 4;
    exports.INDICES_QUAD = 6;
    exports.COMP_POS = 2;
    exports.COMP_Z_INDEX = 1;
    exports.COMP_SIZE_Z_INDEX = 1;
    exports.COMP_SIZE_POS = 2;
    exports.COMP_PAL_PAL_SHIFT = 1;
    exports.COMP_SIZE_PAL_SHIFT = 1;
    exports.COMP_UV = 2;
    exports.COMP_SIZE_UV = 1;
    exports.UV_TILE = 16;
    exports.TEXTURE_SIZE = 256;
    exports.HUGE = Number.MAX_VALUE;
    exports.MIN_Z = 1;
    exports.MAX_Z = 255;
    exports.PAL_OFFSET = 1 / 256;
    exports.OFFSET_Z_INDEX = exports.COMP_POS * exports.COMP_SIZE_POS;
    exports.OFFSET_PAL_SHIFT = exports.OFFSET_Z_INDEX + exports.COMP_SIZE_Z_INDEX;
    exports.OFFSET_UV = exports.OFFSET_PAL_SHIFT + exports.COMP_SIZE_PAL_SHIFT;
    exports.VERTEX_SIZE = exports.COMP_POS * exports.COMP_SIZE_POS + exports.COMP_UV * exports.COMP_SIZE_UV + exports.COMP_SIZE_Z_INDEX + exports.COMP_SIZE_PAL_SHIFT;
    exports.VERTEX_SIZE_SHORT = exports.VERTEX_SIZE >> 1;
    exports.QUAD_SIZE = exports.VERTEX_SIZE * exports.VERTICES_QUAD;
    exports.QUAD_SIZE_SHORT = exports.VERTEX_SIZE_SHORT * exports.VERTICES_QUAD;
    exports.MAT4_IDENT = mat4.identity(mat4.create());
});
//# sourceMappingURL=constants.js.map