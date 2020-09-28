import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from './png.info-chunk.coder';

export class PNGCoderInfoChunktEXt extends PNGCoderInfoChunk {

    public static Type: number = 0x74455874; // Buffer.from([116, 69, 88, 116])

    public static PredefinedKeywords: string[] = ['Title', 'Author', 'Description', 'Copyright', 'Creation Time', 'Software', 'Disclaimer', 'Warning', 'Source', 'Comment'];

    public get KEYWORD(): Buffer {
        const NullSeparatorIndex = this.DATA.indexOf(0);
        return this.DATA.slice(0, NullSeparatorIndex);
    };

    public get TEXT(): Buffer {
        const NullSeparatorIndex = this.DATA.indexOf(0);
        return this.DATA.slice(NullSeparatorIndex + 1);
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
        const NullSeparatorIndex = this.DATA.indexOf(0);
        if (NullSeparatorIndex < 0) {
            throw new Error('Chunk tEXt must have a null separator byte.');
        } else if (NullSeparatorIndex === 0) {
            throw new Error('Chunk tEXt keyword must be at least one character.');
        } else if (NullSeparatorIndex >= 80) {
            throw new Error('Chunk tEXt keyword must be less than 80 characters long.');
        } else if (this.DATA.indexOf(0, NullSeparatorIndex + 1) >= 0) {
            throw new Error('Chunk tEXt can have at most one null character.');
        }
    }

    public checkOthers(chunks: PNGCoderInfoChunk[]): void {
        // SUPER
        super.checkOthers(chunks);
    }

    public toString(): string {
        const messages = [super.toString()];
        return messages.join('\n');
    }

    //

    public getKeyword(): string {
        return this.KEYWORD.toString('latin1');
    }

    public getText(): string {
        return this.TEXT.toString('latin1');
    }

}
