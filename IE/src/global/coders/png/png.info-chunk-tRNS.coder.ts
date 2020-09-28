import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from './png.info-chunk.coder';

import { PNGCoderInfoChunkIDAT } from './png.info-chunk-IDAT.coder';
import { PNGCoderInfoChunkIHDR, PNGCoderInfoChunkIHDRColorType } from './png.info-chunk-IHDR.coder';
import { PNGCoderInfoChunkPLTE } from './png.info-chunk-PLTE.coder';

export class PNGCoderInfoChunktRNS extends PNGCoderInfoChunk {

    public static Type: number = 0x74524e53; // Buffer.from([116, 82, 78, 83])

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
        // PROHIBITED
        const ChunkIHDR = chunks.find((chunk) => chunk.getType() === PNGCoderInfoChunkIHDR.Type) as PNGCoderInfoChunkIHDR;
        if (ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.GRAYSCALE_ALPHA || ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.TRUECOLOR_ALPHA) {
            throw new Error('Chunk tRNS is prohibited for color types 4 and 6.');
        }
        // SIZE
        const ChunkPLTEIndex = chunks.findIndex((chunk) => chunk.getType() === PNGCoderInfoChunkPLTE.Type);
        if (ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.GRAYSCALE) {
            if (this.getLength() !== 2) {
                throw new Error('Chunk tRNS with chunk IHDR color type 0 must be of length 2.');
            }
        } else if (ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.TRUECOLOR) {
            if (this.getLength() !== 6) {
                throw new Error('Chunk tRNS with chunk IHDR color type 2 must be of length 6.');
            }
        } else if (ChunkIHDR.getColorType() === PNGCoderInfoChunkIHDRColorType.PALETTE_INDEX) {
            const ChunkPLTE = chunks[ChunkPLTEIndex];
            if (this.getLength() > ChunkPLTE.getLength() / 3) {
                throw new Error('Chunk tRNS must not contain more entries than chunk PLTE.');
            }
        }
        // DIMENSION
        if (ChunkIHDR.getColorType() !== PNGCoderInfoChunkIHDRColorType.PALETTE_INDEX) {
            const Transparency = this.getTransparency(ChunkIHDR.getColorType());
            if (Object.keys(Transparency).map((k) => Transparency[k]).find((v) => v >= (1 << ChunkIHDR.getBitDepth())) !== undefined) {
                throw new Error('Chunk tRNS must not exceed the range that can be represented with chunk IHDR bit depth.');
            }
        }
        // POSITION
        if (ChunkPLTEIndex >= 0 && chunks.indexOf(this) < ChunkPLTEIndex) {
            throw new Error('Chunk tRNS must follow chunk PLTE.');
        }
        if (chunks.indexOf(this) > chunks.findIndex((chunk) => chunk.getType() === PNGCoderInfoChunkIDAT.Type)) {
            throw new Error('Chunk tRNS must precede the first chunk IDAT.');
        }
        if (chunks.filter((chunk) => chunk.getType() === PNGCoderInfoChunktRNS.Type).length > 1) {
            throw new Error('Chunk tRNS must not appear more than once.');
        }
    }

    public toString(): string {
        const messages = [super.toString()];
        return messages.join('\n');
    }

    //

    public getTransparency(colorType: PNGCoderInfoChunkIHDRColorType): PNGCoderInfoChunktRNSTransparency[keyof PNGCoderInfoChunktRNSTransparency] {
        switch (colorType) {
            case PNGCoderInfoChunkIHDRColorType.GRAYSCALE:
                return { Gray: this.DATA.readUInt16BE(0) } as PNGCoderInfoChunktRNSTransparency[0];
            case PNGCoderInfoChunkIHDRColorType.TRUECOLOR:
                return { Red: this.DATA.readUInt16BE(0), Green: this.DATA.readUInt16BE(2), Blue: this.DATA.readUInt16BE(4) } as PNGCoderInfoChunktRNSTransparency[2];
            case PNGCoderInfoChunkIHDRColorType.PALETTE_INDEX:
                const entries: number[] = [];
                for (let p = 0; p < this.DATA.length; p++) {
                    entries.push(this.DATA.readUInt8(p));
                }
                return { Entries: entries } as PNGCoderInfoChunktRNSTransparency[3];
        }
        throw new Error('Chunk tRNS unrecognized color type.');
    }

}

export interface PNGCoderInfoChunktRNSTransparency {
    0: { Gray: number; }; // PNGCoderInfoChunkIHDRColorType.GRAYSCALE
    2: { Red: number; Green: number; Blue: number; }; // PNGCoderInfoChunkIHDRColorType.TRUECOLOR
    3: { Entries: number[]; }; // PNGCoderInfoChunkIHDRColorType.PALETTE_INDEX
}
