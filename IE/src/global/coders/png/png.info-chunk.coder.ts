import { PNGCoderService } from './png.coder.service';

export class PNGCoderInfoChunk {

    public get LENGTH(): Buffer {
        return this.buffer.slice(0, 4);
    };

    public get TYPE(): Buffer {
        return this.buffer.slice(4, 8);
    };

    public get DATA(): Buffer {
        const size = this.length;
        return this.buffer.slice(8, 8 + size);
    };

    public get CRC(): Buffer {
        const size = this.length;
        return this.buffer.slice(8 + size, 12 + size);
    };

    //

    public get length(): number {
        return this.LENGTH.readUInt32BE(0);
    };

    public get name(): string {
        return this.TYPE.toString();
    };

    public get ancillary_bit(): boolean {
        const bit = 1 << 5;
        return (this.TYPE[0] & bit) === bit;
    };

    public get private_bit(): boolean {
        const bit = 1 << 5;
        return (this.TYPE[1] & bit) === bit;
    };

    public get reserved_bit(): boolean {
        const bit = 1 << 5;
        return (this.TYPE[2] & bit) === bit;
    };

    public get safe_to_copy_bit(): boolean {
        const bit = 1 << 5;
        return (this.TYPE[3] & bit) === bit;
    };

    constructor(
        protected readonly service: PNGCoderService,
        protected readonly buffer: Buffer
    ) { }

    public checkSelf(): void {
        // CRC
        const crc_generated = (this.service.crc32.crc(Buffer.concat([this.TYPE, this.DATA]), 0xffffffff) ^ 0xffffffff) >>> 0;
        const crc_read = this.CRC.readUInt32BE(0);
        if (crc_generated !== crc_read) {
            throw new Error("Chunk CRC check failed.");
        }
    }

    public checkOthers(chunks: PNGCoderInfoChunk[]): void {

    }

}
