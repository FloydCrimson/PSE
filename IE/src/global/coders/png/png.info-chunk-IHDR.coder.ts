import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from './png.info-chunk.coder';

import { PNGCoderInfoChunkPLTE } from './png.info-chunk-PLTE.coder';

import { Support } from '../../helpers/support';

export class PNGCoderInfoChunkIHDR extends PNGCoderInfoChunk {

    public static Type: number = 0x49484452; // Buffer.from([73, 72, 68, 82])

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

    constructor(
        protected readonly service: PNGCoderService,
        protected readonly buffer: Buffer
    ) {
        super(service, buffer);
    }

    public checkSelf(): void {
        // SUPER
        super.checkSelf();
        // LENGTH
        if (this.getLength() !== 13) {
            throw new Error('Chunk IHDR must be of length 13. Found: ' + this.getLength());
        }
        // WIDTH
        if (this.getWidth() === 0) {
            throw new Error('Chunk IHDR width must be greater than 0.');
        }
        // HEIGHT
        if (this.getHeight() === 0) {
            throw new Error('Chunk IHDR height must be greater than 0.');
        }
        // BIT DEPTH and COLOR TYPE
        const color_type_map = {
            [PNGCoderInfoChunkIHDRColorType.GRAYSCALE]: [1, 2, 4, 8, 16],
            [PNGCoderInfoChunkIHDRColorType.TRUECOLOR]: [8, 16],
            [PNGCoderInfoChunkIHDRColorType.PALETTE_INDEX]: [1, 2, 4, 8],
            [PNGCoderInfoChunkIHDRColorType.GRAYSCALE_ALPHA]: [8, 16],
            [PNGCoderInfoChunkIHDRColorType.TRUECOLOR_ALPHA]: [8, 16]
        };
        if (this.getColorType() in color_type_map) {
            if (color_type_map[this.getColorType()].indexOf(this.getBitDepth()) < 0) {
                throw new Error('Chunk IHDR bit depth with color type ' + this.getColorType() + ' must be equal to one of the following values: ' + color_type_map[this.getColorType()].join(', ') + '. Found: ' + this.getBitDepth());
            }
        } else {
            throw new Error('Chunk IHDR color type must be equal to one of the following values: ' + Object.keys(color_type_map).join(', ') + '. Found: ' + this.getColorType());
        }
        // COMPRESSION METHOD
        if (this.getCompressionMethod() !== PNGCoderInfoChunkIHDRCompressionMethod.DEFLATEWS32K) {
            throw new Error('Chunk IHDR compression method unknown. Found: ' + this.getCompressionMethod());
        }
        // FILTER METHOD
        if (this.getFilterMethod() !== PNGCoderInfoChunkIHDRFilterMethod.ADAPTIVE_FILTERING_5BFT) {
            throw new Error('Chunk IHDR filter method unknown. Found: ' + this.getFilterMethod());
        }
        // INTERLACE METHOD
        if (this.getInterlaceMethod() !== PNGCoderInfoChunkIHDRInterlaceMethod.NO_INTERLACE && this.getInterlaceMethod() !== PNGCoderInfoChunkIHDRInterlaceMethod.ADAM7_INTERLACE) {
            throw new Error('Chunk IHDR interlace method unknown. Found: ' + this.getInterlaceMethod());
        }
    }

    public checkOthers(chunks: PNGCoderInfoChunk[]): void {
        // SUPER
        super.checkOthers(chunks);
        // POSITION
        if (this.chunks.indexOf(this) !== 0) {
            throw new Error('Chunk IHDR is not the first.');
        }
        // PRESENCE
        if (this.getColorType() === PNGCoderInfoChunkIHDRColorType.PALETTE_INDEX) {
            if (this.chunks.find((chunk) => chunk.getType() === PNGCoderInfoChunkPLTE.Type) === undefined) {
                throw new Error('Chunk IHDR with color type 3 needs chunk PLTE.');
            }
        }
    }

    public toString(): string {
        const messages = [super.toString()];
        // WIDTH
        messages.push('Width:\t\t\t\t' + this.getWidth());
        // HEIGHT
        messages.push('Height:\t\t\t\t' + this.getHeight());
        // BIT DEPTH
        messages.push('Bit Depth:\t\t\t' + this.getBitDepth());
        // SAMPLE DEPTH
        messages.push('Sample Depth:\t\t\t' + this.getSampleDepth());
        // COLOR TYPE
        messages.push('Color Type:\t\t\t' + Support.enumToString(PNGCoderInfoChunkIHDRColorType, this.getColorType()));
        // COMPRESSION METHOD
        messages.push('Compression Method:\t\t' + Support.enumToString(PNGCoderInfoChunkIHDRCompressionMethod, this.getCompressionMethod()));
        // FILTER METHOD
        messages.push('Filter Method:\t\t\t' + Support.enumToString(PNGCoderInfoChunkIHDRFilterMethod, this.getFilterMethod()));
        // INTERLACE METHOD
        messages.push('Interlace Method:\t\t' + Support.enumToString(PNGCoderInfoChunkIHDRInterlaceMethod, this.getInterlaceMethod()));
        //
        return messages.join('\n');
    }

    //

    public getWidth(): number {
        return this.WIDTH.readUInt32BE(0);
    };

    public getHeight(): number {
        return this.HEIGHT.readUInt32BE(0);
    };

    public getBitDepth(): number {
        return this.BIT_DEPTH.readUInt8(0);
    };

    public getSampleDepth(): number {
        return this.getColorType() === PNGCoderInfoChunkIHDRColorType.PALETTE_INDEX ? 8 : this.getBitDepth();
    };

    public getColorType(): PNGCoderInfoChunkIHDRColorType {
        return this.COLOR_TYPE.readUInt8(0);
    };

    public getCompressionMethod(): PNGCoderInfoChunkIHDRCompressionMethod {
        return this.COMPRESSION_METHOD.readUInt8(0);
    };

    public getFilterMethod(): PNGCoderInfoChunkIHDRFilterMethod {
        return this.FILTER_METHOD.readUInt8(0);
    };

    public getInterlaceMethod(): PNGCoderInfoChunkIHDRInterlaceMethod {
        return this.INTERLACE_METHOD.readUInt8(0);
    };

}

export enum PNGCoderInfoChunkIHDRColorType {
    PALETTE_USED = 1 << 0,
    RGB_TRIPLE_USED = 1 << 1,
    ALPHA_USED = 1 << 2,
    //
    GRAYSCALE = 0,
    TRUECOLOR = RGB_TRIPLE_USED,
    PALETTE_INDEX = RGB_TRIPLE_USED | PALETTE_USED,
    GRAYSCALE_ALPHA = ALPHA_USED,
    TRUECOLOR_ALPHA = RGB_TRIPLE_USED | ALPHA_USED
}

export enum PNGCoderInfoChunkIHDRCompressionMethod {
    DEFLATEWS32K = 0
}

export enum PNGCoderInfoChunkIHDRFilterMethod {
    ADAPTIVE_FILTERING_5BFT = 0
}

export enum PNGCoderInfoChunkIHDRInterlaceMethod {
    NO_INTERLACE = 0,
    ADAM7_INTERLACE = 1
}
