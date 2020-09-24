import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from './png.info-chunk.coder';

import { PNGCoderInfoChunkIDAT } from './png.info-chunk-IDAT.coder';
import { PNGCoderInfoChunkPLTE } from './png.info-chunk-PLTE.coder';

export class PNGCoderInfoChunkgAMA extends PNGCoderInfoChunk {

    public static Type: number = 0x67414d41; // Buffer.from([103, 65, 77, 65])

    public get IMAGE_GAMMA(): Buffer {
        return this.DATA.slice(0, 4);
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
        // LENGTH
        if (this.getLength() !== 4) {
            throw new Error('Chunk gAMA must be of length 32. Found: ' + this.getLength());
        }
    }

    public checkOthers(chunks: PNGCoderInfoChunk[]): void {
        // SUPER
        super.checkOthers(chunks);
        // POSITION
        const ChunkPLTEIndex = chunks.findIndex((chunk) => chunk.getType() === PNGCoderInfoChunkPLTE.Type)
        if (ChunkPLTEIndex >= 0 && chunks.indexOf(this) > ChunkPLTEIndex) {
            throw new Error('Chunk gAMA must precede chunk PLTE.');
        }
        if (chunks.indexOf(this) > chunks.findIndex((chunk) => chunk.getType() === PNGCoderInfoChunkIDAT.Type)) {
            throw new Error('Chunk gAMA must precede the first chunk IDAT.');
        }
    }

    //

    public getImageGamma(): number {
        return this.IMAGE_GAMMA.readUInt32BE(0) / 100000;
    };

}