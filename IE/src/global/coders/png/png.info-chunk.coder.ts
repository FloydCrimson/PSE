import { PNGCoderService } from './png.coder.service';

export class PNGCoderInfoChunk {

    public static Type: number = 0x0;

    public get LENGTH(): Buffer {
        return this.buffer.slice(0, 4);
    };

    public get TYPE(): Buffer {
        return this.buffer.slice(4, 8);
    };

    public get DATA(): Buffer {
        const size = this.getLength();
        return this.buffer.slice(8, 8 + size);
    };

    public get CRC(): Buffer {
        const size = this.getLength();
        return this.buffer.slice(8 + size, 12 + size);
    };

    protected chunks: PNGCoderInfoChunk[];

    constructor(
        protected readonly service: PNGCoderService,
        protected readonly buffer: Buffer
    ) { }

    public checkSelf(): void {
        // CRC
        const crc = (this.service.crc32.crc(Buffer.concat([this.TYPE, this.DATA]), 0xffffffff) ^ 0xffffffff) >>> 0;
        if (crc !== this.getCRC()) {
            throw new Error('Chunk CRC check failed. Found: ' + this.getCRC() + '. Calculated: ' + crc);
        }
    }

    public checkOthers(chunks: PNGCoderInfoChunk[]): void {
        // CHUNKS
        this.chunks = chunks;
    }

    public toString(): string {
        const messages = [];
        // NAME
        messages.push('Name:\t\t\t\t' + this.getName());
        // LENGTH
        messages.push('Length:\t\t\t\t' + this.getLength());
        // BIT
        messages.push('Bit:\t\t\t\tCritical=' + !this.getAncillaryBit() + '   Public=' + !this.getPrivateBit() + '   Reserved=' + this.getReservedBit() + '   SafeToCopy=' + this.getSafeToCopyBit());
        //
        return messages.join('\n');
    }

    //

    public getLength(): number {
        return this.LENGTH.readUInt32BE(0);
    };

    public getType(): number {
        return this.TYPE.readUInt32BE(0);
    };

    public getName(): string {
        return this.TYPE.toString('latin1');
    };

    public getCRC(): number {
        return this.CRC.readUInt32BE(0);
    };

    public getAncillaryBit(): boolean {
        const bit = 1 << 5;
        return (this.TYPE.readUInt8(0) & bit) === bit;
    };

    public getPrivateBit(): boolean {
        const bit = 1 << 5;
        return (this.TYPE.readUInt8(1) & bit) === bit;
    };

    public getReservedBit(): boolean {
        const bit = 1 << 5;
        return (this.TYPE.readUInt8(2) & bit) === bit;
    };

    public getSafeToCopyBit(): boolean {
        const bit = 1 << 5;
        return (this.TYPE.readUInt8(3) & bit) === bit;
    };

}
