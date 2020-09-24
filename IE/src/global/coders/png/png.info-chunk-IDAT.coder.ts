import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from "./png.info-chunk.coder";

export class PNGCoderInfoChunkIDAT extends PNGCoderInfoChunk {

    public static Type: number = 0x49444154; // Buffer.from([73, 68, 65, 84])

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
        // CONSECUTIVE
        const index = chunks.findIndex((chunk) => chunk.getType() === PNGCoderInfoChunkIDAT.Type);
        if (chunks[index] === this) {
            let same = true;
            for (let i = index + 1; i < chunks.length; i++) {
                const equal = chunks[i].getType() === PNGCoderInfoChunkIDAT.Type;
                if (!same && equal) {
                    throw new Error("Chunk IHDR must be consecutive with other chunks IHDR.");
                }
                same = same && equal;
            }
        }
    }

}
