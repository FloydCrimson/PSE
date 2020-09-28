import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from './png.info-chunk.coder';

import { PNGCoderInfoChunkIDAT } from './png.info-chunk-IDAT.coder';
import { PNGCoderInfoChunkIHDR, PNGCoderInfoChunkIHDRColorType } from './png.info-chunk-IHDR.coder';
import { PNGCoderInfoChunkPLTE } from './png.info-chunk-PLTE.coder';

export class PNGCoderInfoChunksBIT extends PNGCoderInfoChunk {

    public static Type: number = 0x73424954; // Buffer.from([115, 66, 73, 84])

    constructor(
        protected readonly service: PNGCoderService,
        protected readonly buffer: Buffer
    ) {
        super(service, buffer);
    }

    public checkSelf(): void {
        // SUPER
        super.checkSelf();
    }

    public checkOthers(chunks: PNGCoderInfoChunk[]): void {
        // SUPER
        super.checkOthers(chunks);
        // SIZE
        const ChunkIHDR = this.chunks.find((chunk) => chunk.getType() === PNGCoderInfoChunkIHDR.Type) as PNGCoderInfoChunkIHDR;
        if (ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.GRAYSCALE) {
            if (this.getLength() !== 1) {
                throw new Error('Chunk sBIT with chunk IHDR color type 0 must be of length 1.');
            }
        } else if (ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.TRUECOLOR || ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.PALETTE_INDEX) {
            if (this.getLength() !== 3) {
                throw new Error('Chunk sBIT with chunk IHDR color type 2 or 3 must be of length 3.');
            }
        } else if (ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.GRAYSCALE_ALPHA) {
            if (this.getLength() !== 2) {
                throw new Error('Chunk sBIT with chunk IHDR color type 4 must be of length 2.');
            }
        } else if (ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.TRUECOLOR_ALPHA) {
            if (this.getLength() !== 4) {
                throw new Error('Chunk sBIT with chunk IHDR color type 6 must be of length 4.');
            }
        }
        // DIMENSION
        const SignificantBits = this.getSignificantBits(ChunkIHDR.getColorType());
        if (Object.values(SignificantBits).find((value) => value === 0 || value > ChunkIHDR.getSampleDepth()) !== undefined) {
            throw new Error('Chunk sBIT significant bits must be greater than zero and less than or equal to chunk IHDR sample depth.');
        }
        // POSITION
        const ChunkPLTEIndex = this.chunks.findIndex((chunk) => chunk.getType() === PNGCoderInfoChunkPLTE.Type)
        if (ChunkPLTEIndex >= 0 && this.chunks.indexOf(this) > ChunkPLTEIndex) {
            throw new Error('Chunk sBIT must precede chunk PLTE.');
        }
        if (this.chunks.indexOf(this) > this.chunks.findIndex((chunk) => chunk.getType() === PNGCoderInfoChunkIDAT.Type)) {
            throw new Error('Chunk sBIT must precede the first chunk IDAT.');
        }
        if (this.chunks.filter((chunk) => chunk.getType() === PNGCoderInfoChunksBIT.Type).length > 1) {
            throw new Error('Chunk sBIT must not appear more than once.');
        }
    }

    public toString(): string {
        const messages = [super.toString()];
        // SIGNIFICANT BITS
        const ChunkIHDR = this.chunks.find((chunk) => chunk.getType() === PNGCoderInfoChunkIHDR.Type) as PNGCoderInfoChunkIHDR;
        const SignificantBits = this.getSignificantBits(ChunkIHDR.getColorType());
        messages.push('Significant Bits:\t\t' + Object.entries(SignificantBits).map(([key, value]) => key + '=' + value).join('   '));
        //
        return messages.join('\n');
    }

    //

    public getSignificantBits(colorType: PNGCoderInfoChunkIHDRColorType): PNGCoderInfoChunksBITSignificantBits[keyof PNGCoderInfoChunksBITSignificantBits] {
        switch (colorType) {
            case PNGCoderInfoChunkIHDRColorType.GRAYSCALE:
                return { Gray: this.DATA.readUInt8(0) } as PNGCoderInfoChunksBITSignificantBits[0];
            case PNGCoderInfoChunkIHDRColorType.TRUECOLOR:
                return { Red: this.DATA.readUInt8(0), Green: this.DATA.readUInt8(1), Blue: this.DATA.readUInt8(2) } as PNGCoderInfoChunksBITSignificantBits[2];
            case PNGCoderInfoChunkIHDRColorType.PALETTE_INDEX:
                return { Red: this.DATA.readUInt8(0), Green: this.DATA.readUInt8(1), Blue: this.DATA.readUInt8(2) } as PNGCoderInfoChunksBITSignificantBits[3];
            case PNGCoderInfoChunkIHDRColorType.GRAYSCALE_ALPHA:
                return { Gray: this.DATA.readUInt8(0), Alpha: this.DATA.readUInt8(1) } as PNGCoderInfoChunksBITSignificantBits[4];
            case PNGCoderInfoChunkIHDRColorType.TRUECOLOR_ALPHA:
                return { Red: this.DATA.readUInt8(0), Green: this.DATA.readUInt8(1), Blue: this.DATA.readUInt8(2), Alpha: this.DATA.readUInt8(3) } as PNGCoderInfoChunksBITSignificantBits[6];
        }
        throw new Error('Chunk sBIT unrecognized color type.');
    }

}

export interface PNGCoderInfoChunksBITSignificantBits {
    0: { Gray: number; }; // PNGCoderInfoChunkIHDRColorType.GRAYSCALE
    2: { Red: number; Green: number; Blue: number; }; // PNGCoderInfoChunkIHDRColorType.TRUECOLOR
    3: { Red: number; Green: number; Blue: number; }; // PNGCoderInfoChunkIHDRColorType.PALETTE_INDEX
    4: { Gray: number; Alpha: number; }; // PNGCoderInfoChunkIHDRColorType.GRAYSCALE_ALPHA
    6: { Red: number; Green: number; Blue: number; Alpha: number; }; // PNGCoderInfoChunkIHDRColorType.TRUECOLOR_ALPHA
}
