import { BBuffer } from "./bbuffer";

export class Huffman {

    private symbols: number[];

    constructor(
        private readonly lengths: number[],
        private readonly bits: number
    ) {
        this.initialize();
    }

    private initialize(): void {
        const counts = new Array(1 << this.bits).fill(0);
        for (let i = 0; i < this.lengths.length; i++) {
            counts[this.lengths[i]]++;
        }
        counts[0] = 0;
        const offsets = new Array(counts.length + 1).fill(0);
        let offset = 0;
        for (let i = 1; i <= counts.length; i++) {
            offsets[i] = offset = (offset + counts[i - 1]) << 1;
        }
        this.symbols = new Array(this.lengths.length).fill(0);
        for (let i = 0; i < this.symbols.length; i++) {
            if (this.lengths[i] !== 0) {
                this.symbols[i] = offsets[this.lengths[i]]++;
            }
        }
    }

    public getSymbol(bbuffer: BBuffer): number {
        let code = 0;
        for (let length = 1; bbuffer.offset < bbuffer.length; length++) {
            code = (code << 1) | bbuffer.readBits(1).readUInt8(0);
            for (let symbol = 0; symbol < this.lengths.length; symbol++) {
                if (this.lengths[symbol] === length && this.symbols[symbol] === code) {
                    return symbol;
                }
            }
        }
        throw new Error('Huffman bbuffer end reached.');
    }

}
