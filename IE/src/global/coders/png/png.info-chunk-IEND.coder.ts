import { PNGCoderInfoChunk } from "./png.info-chunk.coder";

export const PNGCoderInfoChunkIENDType = Buffer.from([73, 69, 78, 68]);

export class PNGCoderInfoChunkIEND extends PNGCoderInfoChunk {

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
        // POSITION
        if (chunks.indexOf(this) !== chunks.length - 1) {
            throw new Error("Chunk IEND is not the last.");
        }
    }

}
