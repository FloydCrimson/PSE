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
        const buffer = this.LENGTH;
        return buffer[0] * 256 * 256 * 256 + buffer[1] * 256 * 256 + buffer[2] * 256 + buffer[3];
    };

    public get name(): string {
        return this.TYPE.toString();
    };

    public get ancillary_bit(): boolean {
        const position = 0;
        const check = 1 << 5;
        return (this.TYPE[position] & check) === check;
    };

    public get private_bit(): boolean {
        const position = 1;
        const check = 1 << 5;
        return (this.TYPE[position] & check) === check;
    };

    public get reserved_bit(): boolean {
        const position = 2;
        const check = 1 << 5;
        return (this.TYPE[position] & check) === check;
    };

    public get safe_to_copy_bit(): boolean {
        const position = 3;
        const check = 1 << 5;
        return (this.TYPE[position] & check) === check;
    };

    constructor(
        protected readonly buffer: Buffer
    ) { }

    public checkSelf(): void {
        // TODO: CRC check
    }

    public checkOthers(chunks: PNGCoderInfoChunk[]): void {

    }

}
