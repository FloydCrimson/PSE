export class CRC {

    private bit: number = 0;
    private divisors = new Array<Buffer>(8);
    private masks = new Array<number>(8);

    constructor(
        private divisor: Buffer
    ) {
        this.initialize();
    }

    private initialize(): void {
        // CHECK
        for (let ia = 0; ia < this.divisor.length; ia++) {
            if (this.divisor[ia] !== 0) {
                let byte = this.divisor[ia];
                let count = 0;
                while (byte !== 0) {
                    byte = byte >>> 1;
                    count++;
                }
                this.bit = ((this.divisor.length - ia - 1) << 3) + count;
                this.divisor = this.divisor.slice(ia);
                break;
            }
        }
        if (this.bit === 0) {
            throw new Error('Invalid divisor. Divisor must be greater than 0.');
        }
        // DIVISORS
        const offset = (this.bit & 7) || 8;
        for (let ib = 0; ib < (8 - offset); ib++) {
            const buffer = Buffer.concat([this.divisor, Buffer.from([0])]);
            const o = offset;
            for (let ia = 0; ia < buffer.length - 1; ia++) {
                buffer[ia] = (buffer[ia] << (8 - ib - o)) | (buffer[ia + 1] >>> (ib + o));
            }
            this.divisors[ib] = Buffer.from(buffer);
        }
        this.divisors[8 - offset] = Buffer.concat([this.divisor, Buffer.from([0])]);
        for (let ib = 8 - offset + 1; ib < 8; ib++) {
            const buffer = Buffer.concat([this.divisor, Buffer.from([0])]);
            const o = offset & 7;
            for (let ia = buffer.length - 1; ia >= 1; ia--) {
                buffer[ia] = (buffer[ia - 1] << (8 - ib + o)) | (buffer[ia] >>> (ib - o));
            }
            buffer[0] = buffer[0] >>> (ib - o);
            this.divisors[ib] = Buffer.from(buffer);
        }
        // MASKS
        for (let ib = 0; ib < 8; ib++) {
            this.masks[ib] = 1 << (7 - ib);
        }
        console.log('divisors');
        for (const entry of this.divisors.entries()) {
            console.log(entry[0], [...entry[1]].map((byte) => byte.toString(2).padStart(8, '0')).join(''));
        }
        console.log('masks');
        for (const entry of this.masks.entries()) {
            console.log(entry[0], entry[1].toString(2).padStart(8, '0'));
        }
    }

    public getRemainder(dividend: Buffer): Buffer {
        dividend = Buffer.concat([dividend, Buffer.from(new Array(this.divisor.length).fill(255))]);
        const length = dividend.length - this.divisor.length;
        for (let ia1 = 0; ia1 < length; ia1++) {
            if (dividend[ia1] !== 0) {
                for (let ib = 0; ib < 8; ib++) {
                    const mask = this.masks[ib];
                    if ((dividend[ia1] & mask) === mask) {
                        const divisor = this.divisors[ib];
                        for (let ia2 = 0; ia2 < divisor.length; ia2++) {
                            dividend[ia1 + ia2] = dividend[ia1 + ia2] ^ divisor[ia2];
                        }
                    }
                }
            }
        }
        const remainder = dividend.slice(length, dividend.length);
        for (let ia = 0; ia < remainder.length; ia++) {
            remainder[ia] = remainder[ia] ^ 255;
        }
        return remainder;
    }

}
