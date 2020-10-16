// https://tools.ietf.org/html/rfc1951

import { BBuffer } from "./bbuffer";
import { Huffman } from "./huffman";

export class Deflate {

    constructor(
        private readonly buffer: Buffer
    ) { }

    public start(): Buffer {
        const bbuffer = new BBuffer(this.buffer);
        do {
            const BFINAL = bbuffer.readBits(1).readUInt8(0) as DeflateBFINAL;
            const BTYPE = bbuffer.readBits(2).readUInt8(0) as DeflateBTYPE;
            if (BTYPE === DeflateBTYPE.NO_COMPRESSION) {
                const LEN = this.buffer.readUInt16LE(1);
                const NLEN = this.buffer.readUInt16LE(3);
                return this.buffer.slice(5, LEN + 5);
            } else if (BTYPE === DeflateBTYPE.FIXED_HUFFMAN_COMPRESSION) {
                const { HLIT_HUFFMAN, HDIST_HUFFMAN } = this.deflateFixedHuffmanCompression();
            } else if (BTYPE === DeflateBTYPE.DYNAMIC_HUFFMAN_COMPRESSION) {
                const { HLIT_HUFFMAN, HDIST_HUFFMAN } = this.deflateDynamicHuffmanCompression(bbuffer);
            } else {
                this.deflateReserved();
            }
            if (BFINAL === DeflateBFINAL.LAST) {
                break;
            }
            // this.adler32(this.buffer, 1);
        } while (true);
        return null;
    }

    //

    private deflateNoCompression(): Buffer {

        return null;
    }

    private deflateFixedHuffmanCompression(): { HLIT_HUFFMAN: Huffman; HDIST_HUFFMAN: Huffman; } {
        // HLIT_HUFFMAN
        const HLIT_LENGTHS = new Array(288);
        HLIT_LENGTHS.fill(8, 0, 144);
        HLIT_LENGTHS.fill(9, 144, 256);
        HLIT_LENGTHS.fill(7, 256, 280);
        HLIT_LENGTHS.fill(8, 280, 288);
        const HLIT_HUFFMAN = new Huffman(HLIT_LENGTHS, 4);
        // HDIST_HUFFMAN
        const HDIST_LENGTHS = new Array(32);
        HDIST_LENGTHS.fill(5);
        const HDIST_HUFFMAN = new Huffman(HDIST_LENGTHS, 4);
        //
        return { HLIT_HUFFMAN, HDIST_HUFFMAN };
    }

    private deflateDynamicHuffmanCompression(bbuffer: BBuffer): { HLIT_HUFFMAN: Huffman; HDIST_HUFFMAN: Huffman; } {
        const HLIT = bbuffer.readBits(5).readUInt8(0) + 257;
        const HDIST = bbuffer.readBits(5).readUInt8(0) + 1;
        const HCLEN = bbuffer.readBits(4).readUInt8(0) + 4;
        // HCLEN_HUFFMAN
        const HCLEN_LENGTHS_ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        const HCLEN_LENGTHS = new Array(HCLEN_LENGTHS_ORDER.length).fill(0);
        for (let i = 0; i < HCLEN; i++) {
            HCLEN_LENGTHS[HCLEN_LENGTHS_ORDER[i]] = bbuffer.readBits(3).readUInt8(0);
        }
        const HCLEN_HUFFMAN = new Huffman(HCLEN_LENGTHS, 3);
        // HLIT_HUFFMAN & HDIST_HUFFMAN
        const HLIT_HDIST_LENGTHS = new Array(HLIT + HDIST).fill(0);
        for (let i = 0; i < HLIT_HDIST_LENGTHS.length;) {
            const symbol = HCLEN_HUFFMAN.getSymbol(bbuffer);
            if (0 <= symbol && symbol <= 15) {
                HLIT_HDIST_LENGTHS[i++] = symbol;
            } else if (symbol === 16) {
                const length = bbuffer.readBits(2).readUInt8(0) + 3;
                HLIT_HDIST_LENGTHS.fill(HLIT_HDIST_LENGTHS[i - 1], i, i += length);
            } else if (symbol === 17) {
                const length = bbuffer.readBits(3).readUInt8(0) + 3;
                HLIT_HDIST_LENGTHS.fill(0, i, i += length);
            } else if (symbol === 18) {
                const length = bbuffer.readBits(7).readUInt8(0) + 11;
                HLIT_HDIST_LENGTHS.fill(0, i, i += length);
            } else {
                throw new Error('Deflate invalid symbol found.');
            }
        }
        const HLIT_HUFFMAN = new Huffman(HLIT_HDIST_LENGTHS.slice(0, HLIT), 4);
        const HDIST_HUFFMAN = new Huffman(HLIT_HDIST_LENGTHS.slice(HLIT), 4);
        //
        return { HLIT_HUFFMAN, HDIST_HUFFMAN };
    }

    private deflateReserved(): void {
        throw new Error('Deflate BTYPE invalid value found.');
    }

    private adler32(buffer: Buffer, adler: number): number {
        const BASE = 65521; // largest prime smaller than 65536
        let sum1 = adler & 0xffff;
        let sum2 = (adler >>> 16) & 0xffff;
        for (let n = 0; n < buffer.length; n++) {
            sum1 = (sum1 + buffer.readInt8(n)) % BASE;
            sum2 = (sum2 + sum1) % BASE;
        }
        return (sum2 << 16) | sum1;
    }

    public toString(): string {
        return '';
    }

}

export enum DeflateBFINAL {
    NOT_LAST = 0,
    LAST = 1
}

export enum DeflateBTYPE {
    NO_COMPRESSION = 0,
    FIXED_HUFFMAN_COMPRESSION = 1,
    DYNAMIC_HUFFMAN_COMPRESSION = 2,
    RESERVED = 3
}
