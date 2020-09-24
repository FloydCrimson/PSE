import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from './png.info-chunk.coder';

import { PNGCoderInfoChunkIDAT } from './png.info-chunk-IDAT.coder';
import { PNGCoderInfoChunkIHDR, PNGCoderInfoChunkIHDRColorType } from './png.info-chunk-IHDR.coder';
import { PNGCoderInfoChunkPLTE } from './png.info-chunk-PLTE.coder';

export class PNGCoderInfoChunkbKGD extends PNGCoderInfoChunk {

    public static Type: number = 0x624b4744; // Buffer.from([98, 75, 71, 68])

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
        const ChunkIHDR = chunks.find((chunk) => chunk.getType() === PNGCoderInfoChunkIHDR.Type) as PNGCoderInfoChunkIHDR;
        if (ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.PALETTE_INDEX) {
            if (this.getLength() !== 1) {
                throw new Error('Chunk kbKGD with chunk IHDR color type 3 must be of length 1.');
            }
        } else if (ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.GRAYSCALE || ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.GRAYSCALE_ALPHA) {
            if (this.getLength() !== 2) {
                throw new Error('Chunk kbKGD with chunk IHDR color type 0 or 4 must be of length 2.');
            }
            if (this.DATA.readUInt16BE(0) >= 1 << ChunkIHDR.getBitDepth()) {
                throw new Error('Chunk kbKGD with chunk IHDR color type 0 or 4 must not exceed the range that can be represented with chunk IHDR bit depth.');
            }
        } else if (ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.TRUECOLOR || ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.TRUECOLOR_ALPHA) {
            if (this.getLength() !== 6) {
                throw new Error('Chunk kbKGD with chunk IHDR color type 2 or 6 must be of length 6.');
            }
            if (this.DATA.readUInt16BE(0) >= 1 << ChunkIHDR.getBitDepth() || this.DATA.readUInt16BE(2) >= 1 << ChunkIHDR.getBitDepth() || this.DATA.readUInt16BE(4) >= 1 << ChunkIHDR.getBitDepth()) {
                throw new Error('Chunk kbKGD with chunk IHDR color type 2 or 6 must not exceed the range that can be represented with chunk IHDR bit depth.');
            }
        } else {
            throw new Error('Chunk kbKGD unrecognized color type.');
        }
        // POSITION
        const ChunkPLTEIndex = chunks.findIndex((chunk) => chunk.getType() === PNGCoderInfoChunkPLTE.Type)
        if (ChunkPLTEIndex >= 0 && chunks.indexOf(this) < ChunkPLTEIndex) {
            throw new Error('Chunk kbKGD must follow chunk PLTE.');
        }
        if (chunks.indexOf(this) > chunks.findIndex((chunk) => chunk.getType() === PNGCoderInfoChunkIDAT.Type)) {
            throw new Error('Chunk kbKGD must precede he first chunk IDAT.');
        }
    }

    //

    public getBackgroundColor(colorType: PNGCoderInfoChunkIHDRColorType): PNGCoderInfoChunkbKGDBackgroundColor[keyof PNGCoderInfoChunkbKGDBackgroundColor] {
        switch (colorType) {
            case PNGCoderInfoChunkIHDRColorType.GRAYSCALE:
                return { Gray: this.DATA.readUInt16BE(0) } as PNGCoderInfoChunkbKGDBackgroundColor[0];
            case PNGCoderInfoChunkIHDRColorType.TRUECOLOR:
                return { Red: this.DATA.readUInt16BE(0), Green: this.DATA.readUInt16BE(2), Blue: this.DATA.readUInt16BE(4) } as PNGCoderInfoChunkbKGDBackgroundColor[2];
            case PNGCoderInfoChunkIHDRColorType.PALETTE_INDEX:
                return { PaletteIndex: this.DATA.readUInt8(0) } as PNGCoderInfoChunkbKGDBackgroundColor[3];
            case PNGCoderInfoChunkIHDRColorType.GRAYSCALE_ALPHA:
                return { Gray: this.DATA.readUInt16BE(0) } as PNGCoderInfoChunkbKGDBackgroundColor[4];
            case PNGCoderInfoChunkIHDRColorType.TRUECOLOR_ALPHA:
                return { Red: this.DATA.readUInt16BE(0), Green: this.DATA.readUInt16BE(2), Blue: this.DATA.readUInt16BE(4) } as PNGCoderInfoChunkbKGDBackgroundColor[6];
        }
        throw new Error('Chunk kbKGD unrecognized color type.');
    }

}

export interface PNGCoderInfoChunkbKGDBackgroundColor {
    0: { Gray: number; }; // PNGCoderInfoChunkIHDRColorType.GRAYSCALE
    2: { Red: number; Green: number; Blue: number; }; // PNGCoderInfoChunkIHDRColorType.TRUECOLOR
    3: { PaletteIndex: number; }; // PNGCoderInfoChunkIHDRColorType.PALETTE_INDEX
    4: { Gray: number; }; // PNGCoderInfoChunkIHDRColorType.GRAYSCALE_ALPHA
    6: { Red: number; Green: number; Blue: number; }; // PNGCoderInfoChunkIHDRColorType.TRUECOLOR_ALPHA
}