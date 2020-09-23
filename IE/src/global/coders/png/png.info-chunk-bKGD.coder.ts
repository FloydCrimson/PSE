import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from "./png.info-chunk.coder";

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
        const ChunkIHDR = chunks.find((chunk) => chunk.type === PNGCoderInfoChunkIHDR.Type) as PNGCoderInfoChunkIHDR;
        if (ChunkIHDR.color_type === PNGCoderInfoChunkIHDRColorType.PALETTE_INDEX) {
            if (this.length !== 1) {
                throw new Error("Chunk kbKGD with chunk IHDR color type 3 must be of length 1.");
            }
        } else if (ChunkIHDR.color_type === PNGCoderInfoChunkIHDRColorType.GRAYSCALE || ChunkIHDR.color_type === PNGCoderInfoChunkIHDRColorType.GRAYSCALE_ALPHA) {
            if (this.length !== 2) {
                throw new Error("Chunk kbKGD with chunk IHDR color type 0 or 4 must be of length 2.");
            }
            if (this.DATA.readUInt16BE(0) >= 1 << ChunkIHDR.bit_depth) {
                throw new Error("Chunk kbKGD with chunk IHDR color type 0 or 4 must not exceed the range that can be represented with chunk IHDR bit depth.");
            }
        } else if (ChunkIHDR.color_type === PNGCoderInfoChunkIHDRColorType.TRUECOLOR || ChunkIHDR.color_type === PNGCoderInfoChunkIHDRColorType.TRUECOLOR_ALPHA) {
            if (this.length !== 6) {
                throw new Error("Chunk kbKGD with chunk IHDR color type 2 or 6 must be of length 6.");
            }
            if (this.DATA.readUInt16BE(0) >= 1 << ChunkIHDR.bit_depth || this.DATA.readUInt16BE(2) >= 1 << ChunkIHDR.bit_depth || this.DATA.readUInt16BE(4) >= 1 << ChunkIHDR.bit_depth) {
                throw new Error("Chunk kbKGD with chunk IHDR color type 2 or 6 must not exceed the range that can be represented with chunk IHDR bit depth.");
            }
        }
        // POSITION
        if (chunks.indexOf(this) < chunks.findIndex((chunk) => chunk.type === PNGCoderInfoChunkPLTE.Type)) {
            throw new Error("Chunk kbKGD must follow chunk PLTE.");
        }
        if (chunks.indexOf(this) > chunks.findIndex((chunk) => chunk.type === PNGCoderInfoChunkIDAT.Type)) {
            throw new Error("Chunk kbKGD must precede he first chunk IDAT.");
        }
    }

}
