import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfoChunk } from './png.info-chunk.coder';

export class PNGCoderInfoChunkzTXt extends PNGCoderInfoChunk {

    public static Type: number = 0x74455874; // Buffer.from([116, 69, 88, 116])

    public static PredefinedKeywords: string[] = ['Title', 'Author', 'Description', 'Copyright', 'Creation Time', 'Software', 'Disclaimer', 'Warning', 'Source', 'Comment'];

    public get KEYWORD(): Buffer {
        const NullSeparatorIndex = this.DATA.indexOf(0);
        return this.DATA.slice(0, NullSeparatorIndex);
    };

    public get COMPRESSION_METHOD(): Buffer {
        const NullSeparatorIndex = this.DATA.indexOf(0);
        return this.DATA.slice(NullSeparatorIndex + 1, NullSeparatorIndex + 2);
    };

    public get COMPRESSED_TEXT(): Buffer {
        const NullSeparatorIndex = this.DATA.indexOf(0);
        return this.DATA.slice(NullSeparatorIndex + 2);
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
            throw new Error('Chunk zTXt must have a null separator byte.');
        } else if (NullSeparatorIndex === 0) {
            throw new Error('Chunk zTXt keyword must be at least one character.');
        } else if (NullSeparatorIndex >= 80) {
            throw new Error('Chunk zTXt keyword must be less than 80 characters long.');
        } else if (NullSeparatorIndex + 1 === this.DATA.length) {
            throw new Error('Chunk zTXt must have a compression method byte.');
        } else if (this.DATA.indexOf(0, NullSeparatorIndex + 2) >= 0) {
            throw new Error('Chunk zTXt can have at most one null character.');
        }
        // COMPRESSION METHOD
        if (this.getCompressionMethod() !== PNGCoderInfoChunkzTXtCompressionMethod.FLATE_32KSW) {
            throw new Error('Chunk zTXt compression method unknown. Found: ' + this.getCompressionMethod());
        }
    }

    public checkOthers(chunks: PNGCoderInfoChunk[]): void {
        // SUPER
        super.checkOthers(chunks);
    }

    public toString(): string {
        const messages = [super.toString()];
        // KEYWORD
        messages.push('Keyword:\t\t\t' + this.getKeyword());
        // COMPRESSION METHOD
        messages.push('Compression Method:\t\t' + this.getCompressionMethod());
        // TEXT
        messages.push('Text:\t\t\t\t' + this.getText());
        //
        return messages.join('\n');
    }

    //

    public getKeyword(): string {
        return this.KEYWORD.toString('latin1');
    }

    public getCompressionMethod(): PNGCoderInfoChunkzTXtCompressionMethod {
        return this.COMPRESSION_METHOD.readUInt8(0);
    };

    public getText(): string {
        throw new Error('Method not implemented.'); // TODO: wait for deflate/inflate implementation
    }

}

export enum PNGCoderInfoChunkzTXtCompressionMethod {
    FLATE_32KSW = 0
}
