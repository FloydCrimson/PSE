import { BBuffer } from "./bbuffer";

export class Huffman {

    private table: ([number, { [code: number]: number }])[];

    constructor(
        private readonly lengths: number[],
        private readonly bits: number
    ) {
        this.initialize();
    }

    private initialize(): void {
        // Count the number of codes for each code length
        const counts = new Array(1 << this.bits).fill(0);
        for (let i = 0; i < this.lengths.length; i++) {
            counts[this.lengths[i]]++;
        }
        counts[0] = 0;
        // Find the numerical value of the smallest code for each code length
        const offsets = new Array(counts.length + 1).fill(0);
        let offset = 0;
        for (let i = 1; i <= counts.length; i++) {
            offsets[i] = offset = (offset + counts[i - 1]) << 1;
        }
        // Assign numerical values to all codes, using consecutive values for all
        // codes of the same length with the base values determined at step 2. Codes 
        // that are never used (which have a bit length of zero) must not be assigned a value
        const symbols = new Array(this.lengths.length).fill(0);
        for (let i = 0; i < symbols.length; i++) {
            if (this.lengths[i] !== 0) {
                symbols[i] = offsets[this.lengths[i]]++;
            }
        }
        // Create a table to efficiently retrieve the symbols when calling getSymbol
        // table: ([length, { [code]: symbol }])[]
        const aggregate = this.lengths.map((l, s) => [l, symbols[s], s]).filter(([l, ,]) => l > 0).sort(([l1, ,], [l2, ,]) => l1 - l2);
        this.table = aggregate.reduce<([number, { [code: number]: number }])[]>((t, [l, c, s]) => {
            if (t.length === 0 || t[t.length - 1][0] !== l) {
                t.push([l, {}]);
            }
            t[t.length - 1][1][c] = s;
            return t;
        }, []);
        // Turn lengths into diffs to facilitate the reading of the codes in getSymbol
        // table: ([diff, { [code]: symbol }])[]
        for (let i = this.table.length - 1; i > 0; i--) {
            this.table[i][0] -= this.table[i - 1][0];
        }
    }

    public getSymbol(bbuffer: BBuffer): number {
        let code = 0;
        for (let i = 0; i < this.table.length; i++) {
            const [diff, symbols] = this.table[i];
            code = (code << diff) | bbuffer.readBits(diff).readUIntBE(0, ((diff - 1) >>> 3) + 1); // bbuffer.readBits(diff).readUInt8(0); // TODO: Check if diff <= 8 always
            if (code in symbols) {
                return symbols[code];
            }
        }
        throw new Error('Huffman code not found.');
    }

}
