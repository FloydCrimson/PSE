import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from "./png.info-chunk.coder";

export class PNGCoderInfoChunkIEND extends PNGCoderInfoChunk {

    public static Type: number = 0x49454e44; // Buffer.from([73, 69, 78, 68])

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
        // POSITION
        if (chunks.indexOf(this) !== chunks.length - 1) {
            throw new Error("Chunk IEND is not the last.");
        }
        // LENGTH
        if (this.getLength() > 0) {
            throw new Error("Chunk IEND data must be empty.");
        }
    }

}
