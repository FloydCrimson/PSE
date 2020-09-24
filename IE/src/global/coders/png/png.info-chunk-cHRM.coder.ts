import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from './png.info-chunk.coder';

import { PNGCoderInfoChunkIDAT } from './png.info-chunk-IDAT.coder';
import { PNGCoderInfoChunkPLTE } from './png.info-chunk-PLTE.coder';

export class PNGCoderInfoChunkcHRM extends PNGCoderInfoChunk {

    public static Type: number = 0x6348524d; // Buffer.from([99, 72, 82, 77])

    public get WHITE_POINT_X(): Buffer {
        return this.DATA.slice(0, 4);
    };

    public get WHITE_POINT_Y(): Buffer {
        return this.DATA.slice(4, 8);
    };

    public get RED_X(): Buffer {
        return this.DATA.slice(8, 12);
    };

    public get RED_Y(): Buffer {
        return this.DATA.slice(12, 16);
    };

    public get GREEN_X(): Buffer {
        return this.DATA.slice(16, 20);
    };

    public get GREEN_Y(): Buffer {
        return this.DATA.slice(20, 24);
    };

    public get BLUE_X(): Buffer {
        return this.DATA.slice(24, 28);
    };

    public get BLUE_Y(): Buffer {
        return this.DATA.slice(28, 32);
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
        if (this.getLength() !== 32) {
            throw new Error('Chunk cHRM must be of length 32. Found: ' + this.getLength());
        }
    }

    public checkOthers(chunks: PNGCoderInfoChunk[]): void {
        // SUPER
        super.checkOthers(chunks);
        // POSITION
        const ChunkPLTEIndex = chunks.findIndex((chunk) => chunk.getType() === PNGCoderInfoChunkPLTE.Type)
        if (ChunkPLTEIndex >= 0 && chunks.indexOf(this) > ChunkPLTEIndex) {
            throw new Error('Chunk cHRM must precede chunk PLTE.');
        }
        if (chunks.indexOf(this) > chunks.findIndex((chunk) => chunk.getType() === PNGCoderInfoChunkIDAT.Type)) {
            throw new Error('Chunk cHRM must precede he first chunk IDAT.');
        }
    }

    //

    public getWhitePointX(): number {
        return this.WHITE_POINT_X.readInt32BE(0) / 100000;
    }

    public getWhitePointY(): number {
        return this.WHITE_POINT_Y.readInt32BE(0) / 100000;
    }

    public getRedX(): number {
        return this.RED_X.readInt32BE(0) / 100000;
    }

    public getRedY(): number {
        return this.RED_Y.readInt32BE(0) / 100000;
    }

    public getGreenX(): number {
        return this.GREEN_X.readInt32BE(0) / 100000;
    }

    public getGreenY(): number {
        return this.GREEN_Y.readInt32BE(0) / 100000;
    }

    public getBlueX(): number {
        return this.BLUE_X.readInt32BE(0) / 100000;
    }

    public getBlueY(): number {
        return this.BLUE_Y.readInt32BE(0) / 100000;
    }

}
