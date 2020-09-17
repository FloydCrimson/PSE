import { PNGCoderInfoChunk } from "./png.info-chunk.coder";

export const PNGCoderInfoChunkIDATType = Buffer.from([73, 68, 65, 84]);

export class PNGCoderInfoChunkIDAT extends PNGCoderInfoChunk {

    constructor(
        protected readonly buffer: Buffer
    ) {
        super(buffer);
    }

    public checkSelf(): void {
        // SUPER
        super.checkSelf();
    }

    public checkOthers(chunks: PNGCoderInfoChunk[]): void {
        // SUPER
        super.checkOthers(chunks);
        // CONSECUTIVE
        const index = chunks.findIndex((chunk) => chunk.TYPE.compare(PNGCoderInfoChunkIDATType) === 0);
        if (chunks[index] === this) {
            let same = true;
            for (let i = index + 1; i < chunks.length; i++) {
                const equal = chunks[i].TYPE.compare(PNGCoderInfoChunkIDATType) === 0;
                if (!same && equal) {
                    throw new Error("Chunk IHDR must be consecutive with other chunks IHDR.");
                }
                same = same && equal;
            }
        }
    }

}
