import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from './png.info-chunk.coder';

import { PNGCoderInfoChunkIDAT } from './png.info-chunk-IDAT.coder';
import { PNGCoderInfoChunkPLTE } from './png.info-chunk-PLTE.coder';

export class PNGCoderInfoChunkhIST extends PNGCoderInfoChunk {

    public static Type: number = 0x68495354; // Buffer.from([104, 73, 83, 84])

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
        if ((this.getLength() & 1) === 1) {
            throw new Error('Chunk hIST length must be divisible by 2.');
        }
    }

    public checkOthers(chunks: PNGCoderInfoChunk[]): void {
        // SUPER
        super.checkOthers(chunks);
        // POSITION
        const ChunkPLTEIndex = chunks.findIndex((chunk) => chunk.getType() === PNGCoderInfoChunkPLTE.Type)
        if (ChunkPLTEIndex < 0) {
            throw new Error('Chunk hIST needs chunk PLTE.');
        }
        if (chunks.indexOf(this) < ChunkPLTEIndex) {
            throw new Error('Chunk hIST must follow chunk PLTE.');
        }
        if (chunks.indexOf(this) > chunks.findIndex((chunk) => chunk.getType() === PNGCoderInfoChunkIDAT.Type)) {
            throw new Error('Chunk hIST must precede the first chunk IDAT.');
        }
        if (chunks.filter((chunk) => chunk.getType() === PNGCoderInfoChunkhIST.Type).length > 1) {
            throw new Error('Chunk hIST must not appear more than once.');
        }
        // WITH PLTE
        const ChunkPLTE = chunks[ChunkPLTEIndex];
        if (this.getLength() / 2 !== ChunkPLTE.getLength() / 3) {
            throw new Error('Chunk hIST must have exactly one entry for each entry in chunk PLTE.');
        }
    }

    public toString(): string {
        const messages = [super.toString()];
        return messages.join('\n');
    }

    //

    public getEntries(): number[] {
        const entries: number[] = [];
        for (let p = 0; p < this.DATA.length; p += 2) {
            entries.push(this.DATA.readUInt16BE(0));
        }
        return entries;
    };

}
