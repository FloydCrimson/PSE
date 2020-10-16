export class BBuffer {

    // tableMask[i][0] = (1 << (i & 7)) - 1;
    // tableMask[i][1] = 0xff - tableMask[i][0];

    private readonly maskTable = [
        [0x00, 0xff], // 00000000, 11111111
        [0x01, 0xfe], // 00000001, 11111110
        [0x03, 0xfc], // 00000011, 11111100
        [0x07, 0xf8], // 00000111, 11111000
        [0x0f, 0xf0], // 00001111, 11110000
        [0x1f, 0xe0], // 00011111, 11100000
        [0x3f, 0xc0], // 00111111, 11000000
        [0x7f, 0x80]  // 01111111, 10000000
    ];

    private _offset: number = 0;
    public get offset(): number {
        return this._offset;
    }

    public get length(): number {
        return this.buffer.length << 3;
    }

    constructor(
        public readonly buffer: Buffer
    ) { }

    public readBits(length: number): Buffer {
        const buffer = this.readBitsAt(this._offset, length);
        this._offset += length;
        return buffer;
    }

    public readBitsAt(offset: number, length: number): Buffer {
        const offsetByte = offset >>> 3; // = Math.floor(offset / 8);
        const offsetBit = offset & 7; // = offset % 8;
        const lengthByte = length >>> 3; // = Math.floor(length / 8);
        const lengthBit = length & 7; // = length % 8;
        const [maskIL, maskIB] = this.maskTable[offsetBit];
        const [maskLL, maskLB] = this.maskTable[lengthBit];
        const buffer = Buffer.of(...new Array<number>(lengthByte + ((lengthBit === 0) ? 0 : 1)));
        if (maskIL === 0) {
            this.buffer.copy(buffer, 0, offsetByte, offsetByte + buffer.length);
        } else {
            for (let p = 0; p < buffer.length; p++) {
                buffer[p] = ((this.buffer[offsetByte + p] & maskIB) >>> offsetBit) | ((this.buffer[offsetByte + p + 1] & maskIL) << (8 - offsetBit));
            }
        }
        if (maskLL !== 0) {
            buffer[buffer.length - 1] = buffer[buffer.length - 1] & maskLL;
        }
        return buffer;
    }

}
