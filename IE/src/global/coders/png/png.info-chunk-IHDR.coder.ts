import { PNGCoderInfoChunk } from "./png.info-chunk.coder";

export const PNGCoderInfoChunkIHDRType = Buffer.from([73, 72, 68, 82]);

export class PNGCoderInfoChunkIHDR extends PNGCoderInfoChunk {

    public get WIDTH(): Buffer {
        return this.DATA.slice(0, 4);
    };

    public get HEIGHT(): Buffer {
        return this.DATA.slice(4, 8);
    };

    public get BIT_DEPTH(): Buffer {
        return this.DATA.slice(8, 9);
    };

    public get COLOR_TYPE(): Buffer {
        return this.DATA.slice(9, 10);
    };

    public get COMPRESSION_METHOD(): Buffer {
        return this.DATA.slice(10, 11);
    };

    public get FILTER_METHOD(): Buffer {
        return this.DATA.slice(11, 12);
    };

    public get INTERLACE_METHOD(): Buffer {
        return this.DATA.slice(12, 13);
    };

    //

    public get width(): number {
        const buffer = this.WIDTH;
        return buffer[0] * 256 * 256 * 256 + buffer[1] * 256 * 256 + buffer[2] * 256 + buffer[3];
    };

    public get height(): number {
        const buffer = this.HEIGHT;
        return buffer[0] * 256 * 256 * 256 + buffer[1] * 256 * 256 + buffer[2] * 256 + buffer[3];
    };

    public get bit_depth(): number {
        const buffer = this.BIT_DEPTH;
        return buffer[0];
    };

    public get sample_depth(): number {
        return this.color_type === 3 ? 8 : this.bit_depth;
    };

    public get color_type(): PNGCoderInfoChunkIHDRColorType {
        const buffer = this.COLOR_TYPE;
        return buffer[0] as PNGCoderInfoChunkIHDRColorType;
    };

    public get compression_method(): PNGCoderInfoChunkIHDRCompressionMethod {
        const buffer = this.COMPRESSION_METHOD;
        return buffer[0] as PNGCoderInfoChunkIHDRCompressionMethod;
    };

    public get filter_method(): PNGCoderInfoChunkIHDRFilterMethod {
        const buffer = this.FILTER_METHOD;
        return buffer[0] as PNGCoderInfoChunkIHDRFilterMethod;
    };

    public get interlace_method(): PNGCoderInfoChunkIHDRInterlaceMethod {
        const buffer = this.INTERLACE_METHOD;
        return buffer[0] as PNGCoderInfoChunkIHDRInterlaceMethod;
    };

    constructor(
        protected readonly buffer: Buffer
    ) {
        super(buffer);
    }

    public checkSelf(): void {
        // SUPER
        super.checkSelf();
        // WIDTH
        if (this.width === 0) {
            throw new Error("Chunk IHDR width must be greater than 0.");
        }
        // HEIGHT
        if (this.height === 0) {
            throw new Error("Chunk IHDR height must be greater than 0.");
        }
        // BIT DEPTH and COLOR TYPE
        const bit_depth_and_color_type_map = {
            [PNGCoderInfoChunkIHDRColorType.GRAYSCALE]: [1, 2, 4, 8, 16],
            [PNGCoderInfoChunkIHDRColorType.RGB_TRIPLE]: [8, 16],
            [PNGCoderInfoChunkIHDRColorType.PALETTE_INDEX]: [1, 2, 4, 8],
            [PNGCoderInfoChunkIHDRColorType.GRAYSCALE_ALPHA]: [8, 16],
            [PNGCoderInfoChunkIHDRColorType.RGB_TRIPLE_ALPHA]: [8, 16]
        };
        if (this.color_type in bit_depth_and_color_type_map) {
            if (bit_depth_and_color_type_map[this.color_type].indexOf(this.bit_depth) < 0) {
                throw new Error("Chunk IHDR bit depth must be equal to 1, 2, 4, 8, or 16.");
            }
        } else {
            throw new Error("Chunk IHDR color type must be equal to 0, 2, 3, 4, or 6.");
        }
        // COMPRESSION METHOD
        if (this.compression_method !== PNGCoderInfoChunkIHDRCompressionMethod.FLATE_32KSW) {
            throw new Error("Chunk IHDR compression method not recognized.");
        }
        // FILTER METHOD
        if (this.filter_method !== PNGCoderInfoChunkIHDRFilterMethod.ADAPTIVE_FILTERING_5BFT) {
            throw new Error("Chunk IHDR filter method not recognized.");
        }
        // INTERLACE METHOD
        if (this.interlace_method !== PNGCoderInfoChunkIHDRInterlaceMethod.NO_INTERLACE && this.interlace_method !== PNGCoderInfoChunkIHDRInterlaceMethod.ADAM7_INTERLACE) {
            throw new Error("Chunk IHDR interlace method not recognized.");
        }
    }

    public checkOthers(chunks: PNGCoderInfoChunk[]): void {
        // SUPER
        super.checkOthers(chunks);
        // POSITION
        if (chunks.indexOf(this) !== 0) {
            throw new Error("Chunk IHDR is not the first.");
        }
    }

}

export enum PNGCoderInfoChunkIHDRColorType {
    PALETTE_USED = 1 << 0,
    RGB_TRIPLE_USED = 1 << 1,
    ALPHA_USED = 1 << 2,
    //
    GRAYSCALE = 0,
    RGB_TRIPLE = RGB_TRIPLE_USED,
    PALETTE_INDEX = RGB_TRIPLE_USED | PALETTE_USED,
    GRAYSCALE_ALPHA = ALPHA_USED,
    RGB_TRIPLE_ALPHA = RGB_TRIPLE_USED | ALPHA_USED
}

export enum PNGCoderInfoChunkIHDRCompressionMethod {
    FLATE_32KSW = 0
}

export enum PNGCoderInfoChunkIHDRFilterMethod {
    ADAPTIVE_FILTERING_5BFT = 0
}

export enum PNGCoderInfoChunkIHDRInterlaceMethod {
    NO_INTERLACE = 0,
    ADAM7_INTERLACE = 1
}
