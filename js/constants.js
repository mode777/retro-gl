define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.VERTICES_QUAD = 4;
    exports.INDICES_QUAD = 6;
    exports.COMP_POS = 3;
    exports.COMP_SIZE_POS = 2;
    exports.COMP_UV = 2;
    exports.COMP_SIZE_UV = 1;
    exports.UV_TILE = 16;
    exports.TEXTURE_SIZE = 256;
    exports.HUGE = Number.MAX_VALUE;
    exports.PAL_OFFSET = 1 / 16;
    exports.OFFSET_UV = exports.COMP_POS * exports.COMP_SIZE_POS;
    exports.VERTEX_SIZE = exports.COMP_POS * exports.COMP_SIZE_POS + exports.COMP_UV * exports.COMP_SIZE_UV;
    exports.QUAD_SIZE = exports.VERTEX_SIZE * exports.VERTICES_QUAD;
    exports.MAT4_IDENT = mat4.identity(mat4.create());
});
//# sourceMappingURL=constants.js.map