import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from './png.info-chunk.coder';

export class PNGCoderInfoChunktIME extends PNGCoderInfoChunk {

    public static Type: number = 0x74494d45; // Buffer.from([116, 73, 77, 69])

    public get YEAR(): Buffer {
        return this.DATA.slice(0, 2);
    };

    public get MONTH(): Buffer {
        return this.DATA.slice(2, 3);
    };

    public get DAY(): Buffer {
        return this.DATA.slice(3, 4);
    };

    public get HOUR(): Buffer {
        return this.DATA.slice(4, 5);
    };

    public get MINUTE(): Buffer {
        return this.DATA.slice(5, 6);
    };

    public get SECOND(): Buffer {
        return this.DATA.slice(6, 7);
    };

    constructor(
        protected readonly service: PNGCoderService,
        protected readonly buffer: Buffer
    ) {
        super(service, buffer);
    }

    public checkSelf(): void {
        // SUPER
        super.checkSelf();
        // LENGTH
        if (this.getLength() !== 7) {
            throw new Error('Chunk tIME must be of length 7. Found: ' + this.getLength());
        }
        // VALUES
        if (this.getMonth() === 0 || this.getMonth() > 12) {
            throw new Error('Chunk tIME month must be between 1 and 12. Found: ' + this.getMonth());
        }
        if (this.getDay() === 0 || this.getDay() > 31) {
            throw new Error('Chunk tIME day must be between 1 and 31. Found: ' + this.getDay());
        }
        if (this.getHour() > 23) {
            throw new Error('Chunk tIME hour must be between 0 and 23. Found: ' + this.getHour());
        }
        if (this.getMinute() > 59) {
            throw new Error('Chunk tIME minute must be between 0 and 59. Found: ' + this.getMinute());
        }
        if (this.getSecond() > 60) {
            throw new Error('Chunk tIME second must be between 0 and 60 (leap second). Found: ' + this.getSecond());
        }
    }

    public checkOthers(chunks: PNGCoderInfoChunk[]): void {
        // SUPER
        super.checkOthers(chunks);
        // POSITION
        if (this.chunks.filter((chunk) => chunk.getType() === PNGCoderInfoChunktIME.Type).length > 1) {
            throw new Error('Chunk tIME must not appear more than once.');
        }
    }

    public toString(): string {
        const messages = [super.toString()];
        // TIME
        messages.push('Time:\t\t' + this.getDate().toUTCString());
        //
        return messages.join('\n');
    }

    //

    public getYear(): number {
        return this.YEAR.readUInt16BE(0);
    }

    public getMonth(): number {
        return this.MONTH.readUInt8(0);
    }

    public getDay(): number {
        return this.DAY.readUInt8(0);
    }

    public getHour(): number {
        return this.HOUR.readUInt8(0);
    }

    public getMinute(): number {
        return this.MINUTE.readUInt8(0);
    }

    public getSecond(): number {
        return this.SECOND.readUInt8(0);
    }

    public getDate(): Date {
        return new Date(this.getYear(), this.getMonth() - 1, this.getDay(), this.getHour(), this.getMinute(), Math.min(this.getSecond(), 59));
    }

}
