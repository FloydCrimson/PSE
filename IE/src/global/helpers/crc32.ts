export class CRC32 {

    private table = new Array<number>(256);

    constructor(
        private readonly polynomial: number
    ) {
        this.initialize();
    }

    private initialize(): void {
        // TABLE
        for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 0; k < 8; k++) {
                if ((c & 1) === 1) {
                    c = this.polynomial ^ (c >>> 1);
                } else {
                    c = c >>> 1;
                }
            }
            this.table[n] = c >>> 0;
        }
    }

    public crc(buffer: Buffer, crc: number): number {
        let c = crc;
        for (let n = 0; n < buffer.length; n++) {
            c = this.table[(c ^ buffer[n]) & 0xff] ^ (c >>> 8);
        }
        return c >>> 0;
    }

}
