import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from './png.info-chunk.coder';

import { PNGCoderInfoChunkIDAT } from './png.info-chunk-IDAT.coder';

export class PNGCoderInfoChunkpHYs extends PNGCoderInfoChunk {

    public static Type: number = 0x70485973; // Buffer.from([112, 72, 89, 115])

    public get PIXELS_PER_UNIT_X_AXIS(): Buffer {
        return this.DATA.slice(0, 4);
    };

    public get PIXELS_PER_UNIT_Y_AXIS(): Buffer {
        return this.DATA.slice(4, 8);
    };

    public get UNIT_SPECIFIER(): Buffer {
        return this.DATA.slice(8, 9);
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
        if (this.getLength() !== 9) {
            throw new Error('Chunk pHYs must be of length 9. Found: ' + this.getLength());
        }
    }

    public checkOthers(chunks: PNGCoderInfoChunk[]): void {
        // SUPER
        super.checkOthers(chunks);
        // POSITION
        if (this.chunks.indexOf(this) > this.chunks.findIndex((chunk) => chunk.getType() === PNGCoderInfoChunkIDAT.Type)) {
            throw new Error('Chunk pHYs must precede the first chunk IDAT.');
        }
        if (this.chunks.filter((chunk) => chunk.getType() === PNGCoderInfoChunkpHYs.Type).length > 1) {
            throw new Error('Chunk pHYs must not appear more than once.');
        }
    }

    public toString(): string {
        const messages = [super.toString()];
        return messages.join('\n');
    }

    //

    public getPixelsPerUnitXAxis(): number {
        return this.PIXELS_PER_UNIT_X_AXIS.readUInt32BE(0);
    }

    public getPixelsPerUnitYAxis(): number {
        return this.PIXELS_PER_UNIT_Y_AXIS.readUInt32BE(0);
    }

    public getUnitSpecifier(): PNGCoderInfoChunkpHYsUnitSpecifier {
        return this.UNIT_SPECIFIER.readUInt8(0);
    }

}

export enum PNGCoderInfoChunkpHYsUnitSpecifier {
    UNKNOWN = 0,
    METER = 1
}
