import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from "./png.info-chunk.coder";

import { PNGCoderInfoChunkIDAT } from "./png.info-chunk-IDAT.coder";
import { PNGCoderInfoChunkIHDR, PNGCoderInfoChunkIHDRColorType } from "./png.info-chunk-IHDR.coder";

export class PNGCoderInfoChunkPLTE extends PNGCoderInfoChunk {

    public static Type: number = 0x504c5445; // Buffer.from([80, 76, 84, 69])

    public get entries(): PNGCoderInfoChunkPLTEEntry[] {
        const entries: PNGCoderInfoChunkPLTEEntry[] = [];
        for (let p = 0; p < this.DATA.length; p += 3) {
            entries.push({
                Red: this.DATA[p],
                Green: this.DATA[p + 1],
                Blue: this.DATA[p + 2]
            });
        }
        return entries;
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
    }

    public checkOthers(chunks: PNGCoderInfoChunk[]): void {
        // SUPER
        super.checkOthers(chunks);
        // LENGTH
        if (this.length % 3 !== 0) {
            throw new Error("Chunk PLTE length must be divisible by 3.");
        }
        // PRESENCE
        const ChunkIHDR = chunks.find((chunk) => chunk.type === PNGCoderInfoChunkIHDR.Type) as PNGCoderInfoChunkIHDR;
        if (ChunkIHDR.color_type === PNGCoderInfoChunkIHDRColorType.GRAYSCALE || ChunkIHDR.color_type === PNGCoderInfoChunkIHDRColorType.GRAYSCALE_ALPHA) {
            throw new Error("Chunk PLTE must not appear for chunk IHDR color type 0 and 4.");
        }
        // SIZE
        if (this.length / 3 > 1 << ChunkIHDR.bit_depth) {
            throw new Error("Chunk PLTE entries length must not exceed the range that can be represented with chunk IHDR bit depth.");
        }
        // POSITION
        if (chunks.indexOf(this) > chunks.findIndex((chunk) => chunk.type === PNGCoderInfoChunkIDAT.Type)) {
            throw new Error("Chunk PLTE must precede the first chunk IDAT.");
        }
        // COUNT
        if (chunks.reduce((count, chunk) => chunk.TYPE.readUInt32BE(0) === PNGCoderInfoChunkPLTE.Type ? (count + 1) : count, 0) > 1) {
            throw new Error("Chunk PLTE must not appear more than one time.");
        }
    }

}

export type PNGCoderInfoChunkPLTEEntry = {
    Red: number;
    Green: number;
    Blue: number;
}

// TODO: TO TEST
