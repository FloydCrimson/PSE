import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from './png.info-chunk.coder';

import { PNGCoderInfoChunkIDAT } from './png.info-chunk-IDAT.coder';
import { PNGCoderInfoChunkIHDR, PNGCoderInfoChunkIHDRColorType } from './png.info-chunk-IHDR.coder';

export class PNGCoderInfoChunkPLTE extends PNGCoderInfoChunk {

    public static Type: number = 0x504c5445; // Buffer.from([80, 76, 84, 69])

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
        if (this.getLength() % 3 !== 0) {
            throw new Error('Chunk PLTE length must be divisible by 3.');
        }
        // PRESENCE
        const ChunkIHDR = this.chunks.find((chunk) => chunk.getType() === PNGCoderInfoChunkIHDR.Type) as PNGCoderInfoChunkIHDR;
        if (ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.GRAYSCALE || ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.GRAYSCALE_ALPHA) {
            throw new Error('Chunk PLTE must not appear for chunk IHDR color type 0 and 4. Found: ' + ChunkIHDR.getColorType());
        }
        // SIZE
        if (this.getLength() / 3 > 1 << ChunkIHDR.getBitDepth()) {
            throw new Error('Chunk PLTE entries length must not exceed the range that can be represented with chunk IHDR bit depth.');
        }
        // POSITION
        if (this.chunks.indexOf(this) > this.chunks.findIndex((chunk) => chunk.getType() === PNGCoderInfoChunkIDAT.Type)) {
            throw new Error('Chunk PLTE must precede the first chunk IDAT.');
        }
        if (this.chunks.filter((chunk) => chunk.getType() === PNGCoderInfoChunkPLTE.Type).length > 1) {
            throw new Error('Chunk PLTE must not appear more than once.');
        }
    }

    public toString(): string {
        const messages = [super.toString()];
        // ENTRIES
        messages.push('Entries:\t\t\t' + Object.entries(this.getEntries()).map(([key, value]) => key + '=' + value).join('   '));
        //
        return messages.join('\n');
    }

    //

    public getEntries(): { Entries: PNGCoderInfoChunkPLTEEntry[]; } {
        const entries: PNGCoderInfoChunkPLTEEntry[] = [];
        for (let p = 0; p < this.DATA.length; p += 3) {
            entries.push({
                Red: this.DATA.readUInt8(p),
                Green: this.DATA.readUInt8(p + 1),
                Blue: this.DATA.readUInt8(p + 2)
            });
        }
        return { Entries: entries };
    };

}

export type PNGCoderInfoChunkPLTEEntry = {
    Red: number;
    Green: number;
    Blue: number;
}
