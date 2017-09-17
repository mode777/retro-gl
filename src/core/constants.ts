import { mat4 } from "gl-matrix";

export const FLOAT = 4;
export const SHORT = 2;
export const BYTE = 1;
export const RGBA = 4;
export const RGB = 3;
export const HUGE = Number.MAX_VALUE;
export const VERTICES_QUAD = 4;
export const INDICES_QUAD = 6;
export const POS_COMPONENTS = 2;
export const UV_COMPONENTS = 2;
export const COLOR_COMPONENTS = 4;
export const MAT4_IDENT = mat4.identity(mat4.create());
export const MAX_VERTICES = (2 << 15);
export const QUADBUFFER_INITIAL_CAPACITY = 16;

export const POS_BYTES = FLOAT;
export const UV_BYTES = FLOAT;
export const COLOR_BYTES = BYTE;

export const POS_SIZE_BYTE = POS_COMPONENTS * POS_BYTES;
export const UV_SIZE_BYTE = UV_COMPONENTS * UV_BYTES;
export const COLOR_SIZE_BYTE = COLOR_COMPONENTS * COLOR_BYTES;

export const POS_OFFSET_BYTE = 0;
export const POS_OFFSET_SHORT = POS_OFFSET_BYTE / SHORT;
export const POS_OFFSET_FLOAT = POS_OFFSET_BYTE / FLOAT;

export const UV_OFFSET_BYTE = POS_OFFSET_BYTE + POS_SIZE_BYTE;
export const UV_OFFSET_SHORT = UV_OFFSET_BYTE / SHORT;
export const UV_OFFSET_FLOAT = UV_OFFSET_BYTE / FLOAT;

export const COLOR_OFFSET_BYTE = UV_OFFSET_BYTE + UV_SIZE_BYTE;
export const COLOR_OFFSET_SHORT = COLOR_OFFSET_BYTE / SHORT;
export const COLOR_OFFSET_FLOAT = COLOR_OFFSET_BYTE / FLOAT;

export const VERTEX_SIZE_BYTE = POS_SIZE_BYTE + UV_SIZE_BYTE + COLOR_SIZE_BYTE; 
export const VERTEX_SIZE_SHORT = VERTEX_SIZE_BYTE / SHORT;
export const VERTEX_SIZE_FLOAT = VERTEX_SIZE_BYTE / FLOAT;

export const QUAD_SIZE_BYTE = VERTEX_SIZE_BYTE * VERTICES_QUAD; 
export const QUAD_SIZE_SHORT = VERTEX_SIZE_SHORT * VERTICES_QUAD; 
export const QUAD_SIZE_FLOAT = VERTEX_SIZE_FLOAT * VERTICES_QUAD; 

export const MAX_QUADS = MAX_VERTICES / VERTICES_QUAD;
