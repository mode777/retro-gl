export const VERTICES_QUAD = 4;
export const INDICES_QUAD = 6;
export const COMP_POS = 3;
export const COMP_SIZE_POS = 2;
export const COMP_UV = 2;
export const COMP_SIZE_UV = 1;
export const UV_TILE = 16;
export const TEXTURE_SIZE = 256;
export const HUGE = Number.MAX_VALUE;

export const PAL_OFFSET = 1 / 16;
export const OFFSET_UV = COMP_POS * COMP_SIZE_POS;
export const VERTEX_SIZE = COMP_POS * COMP_SIZE_POS + COMP_UV * COMP_SIZE_UV; 
export const QUAD_SIZE = VERTEX_SIZE * VERTICES_QUAD; 
