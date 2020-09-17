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
    }

}
