export enum ChunkType {
    Header = 0x49484452,
    Palette = 0x504C5445,
    Data = 0x49444154,
    End = 0x49454E44
}

export type BitDepth = 1 | 2 | 4 | 8 | 16;

export enum ColorType {
    Greyscale = 0,
    Truecolor = 2,
    Indexed = 3,
    GreyscaleAlpha = 4,
    TruecolorAlpha = 6
}

export const SIGN_OFFSET = 8;
export const LENGTH_LENGTH = 4;
export const TYPE_LENGTH = 4;
export const CRC_LENGTH = 4;