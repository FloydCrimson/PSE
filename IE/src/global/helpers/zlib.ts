import { Deflate } from "./deflate";

export class ZLib {

    public get CMF(): Buffer {
        return this.buffer.slice(this.position, this.position + 1);
    };

    public get FLG(): Buffer {
        return this.buffer.slice(this.position + 1, this.position + 2);
    };

    public get DICTID(): Buffer {
        return this.buffer.slice(this.position + 2, this.position + 6);
    };

    constructor(
        private readonly buffer: Buffer,
        private readonly position: number
    ) { }

    public start(): void {
        const CM = this.getCompressionMethod();
        const CINFO = this.getCompressionInfo();
        const FCHECK = this.getCheckBits();
        const FDICT = this.getPresetDictionary();
        const FLEVEL = this.getCompressionLevel();
        if (this.buffer.readUInt16BE(this.position) % 31 !== 0) {
            throw new Error('ZLIB FCHECK invalid. Found: ' + FCHECK);
        }
        if (CM === ZLibCM.DEFLATE) {
            if (CINFO <= 7) {
                const deflate = new Deflate(this.buffer.slice(FDICT === ZLibFDICT.NO_DICTIONARY ? (this.position + 2) : (this.position + 6)));
                deflate.start();
            } else {
                throw new Error('ZLIB CINFO found not supported. Found: ' + CINFO);
            }
        } else {
            throw new Error('ZLIB CM found not supported. Found: ' + CM);
        }
    }

    public toString(): string {
        return '';
    }

    //

    public getCompressionMethod(): ZLibCM {
        return (this.CMF.readUInt8(0) & 0xF) >>> 0; // 00001111
    }

    public getCompressionInfo(): ZLibCINFO {
        return (this.CMF.readUInt8(0) & 0xF0) >>> 4; // 11110000
    }

    public getCheckBits(): number {
        return (this.FLG.readUInt8(0) & 0x1F) >>> 0; // 00011111
    }

    public getPresetDictionary(): ZLibFDICT {
        return (this.FLG.readUInt8(0) & 0x20) >>> 5; // 00100000
    }

    public getCompressionLevel(): ZLibFLEVEL {
        return (this.FLG.readUInt8(0) & 0xC0) >>> 6; // 11000000
    }

}

export enum ZLibCM {
    DEFLATE = 8,
    RESERVED = 15
}

export enum ZLibCINFO {
    WS32K = 7
}

export enum ZLibFDICT {
    NO_DICTIONARY = 0,
    DICTIONARY = 1
}

export enum ZLibFLEVEL {
    FASTEST = 0,
    FAST = 1,
    DEFAULT = 2,
    SLOWEST = 3
}
