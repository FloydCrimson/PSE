import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from './png.info-chunk.coder';

export class PNGCoderInfoChunktEXt extends PNGCoderInfoChunk {

    public static Type: number = 0x74455874; // Buffer.from([116, 69, 88, 116])

    public static PredefinedKeywords: string[] = ['Title', 'Author', 'Description', 'Copyright', 'Creation Time', 'Software', 'Disclaimer', 'Warning', 'Source', 'Comment'];

    public get KEYWORD(): Buffer {
        return this.DATA.slice(0, this.DATA.indexOf(0));
    };

    public get TEXT(): Buffer {
        return this.DATA.slice(this.DATA.indexOf(0) + 1);
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
        this.DATA.reduce((s, b, i) => {
            if (b === 0) {
                s++;
                if (s === 1) {
                    if (i === 0) {
                        throw new Error('Chunk tEXt keyword must be at least one character.');
                    } else if (i >= 80) {
                        throw new Error('Chunk tEXt keyword must be less than 80 characters long.');
                    }
                } else {
                    throw new Error('Chunk tEXt can have at most one null character.');
                }
            }
            return s;
        }, 0);
    }

    public checkOthers(chunks: PNGCoderInfoChunk[]): void {
        // SUPER
        super.checkOthers(chunks);
    }

    //

    public getKeyword(): string {
        return this.KEYWORD.toString('latin1');
    }

    public getText(): string {
        return this.TEXT.toString('latin1');
    }

}
