// https://tools.ietf.org/html/rfc2083

import * as fs from 'fs';

import { ImageCoderImplementation } from "../../common/implementations/image-coder.implementation";

import { PNGCoderInfo } from './png.info.coder';
import { PNGCoderInfoChunk } from './png.info-chunk.coder';
import { PNGCoderInfoChunkIDAT, PNGCoderInfoChunkIDATType } from './png.info-chunk-IDAT.coder';
import { PNGCoderInfoChunkIHDR, PNGCoderInfoChunkIHDRType } from './png.info-chunk-IHDR.coder';
import { PNGCoderInfoChunkIEND, PNGCoderInfoChunkIENDType } from './png.info-chunk-IEND.coder';
import { PNGCoderInfoChunkPLTE, PNGCoderInfoChunkPLTEType } from './png.info-chunk-PLTE.coder';

export class PNGCoder implements ImageCoderImplementation<PNGCoderInfo> {

    // DECODER

    public async decoder(file: string): Promise<{ info: PNGCoderInfo; binary: Uint8Array; }> {
        const buffer = fs.readFileSync(file);
        let data: { info: PNGCoderInfo; binary: Uint8Array; } = { info: {} as PNGCoderInfo, binary: new Uint8Array() };
        let position: number = 0;
        position = this.checkSignature(position, buffer, data);
        position = this.getChunks(position, buffer, data);
        return data;
    }

    //

    private checkSignature(position: number, buffer: Buffer, data: { info: PNGCoderInfo; binary: Uint8Array; }): number {
        const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]); // (ASCII C notation)   \211 P N G \r \n \032 \n
        if (buffer.compare(SIGNATURE, 0, SIGNATURE.length, position, position + SIGNATURE.length) !== 0) {
            throw new Error("Signature check failed.");
        }
        return position + SIGNATURE.length;
    }

    private getChunks(position: number, buffer: Buffer, data: { info: PNGCoderInfo; binary: Uint8Array; }): number {
        data.info.chunks = [];
        while (true) {
            const length = buffer[position] * 256 * 256 * 256 + buffer[position + 1] * 256 * 256 + buffer[position + 2] * 256 + buffer[position + 3];
            const chunk = this.getChunk(buffer.slice(position, position + 12 + length));
            chunk.checkSelf();
            position += 12 + length;
            data.info.chunks.push(chunk);
            if (chunk.reserved_bit === true) {
                console.warn("Chunk with reserved bit found.", chunk);
            }
            if (data.info.chunks.length === 1) {
                if (data.info.chunks[0].TYPE.compare(PNGCoderInfoChunkIHDRType) !== 0) {
                    throw new Error("Chunk start-of-file marker 'IHDR' not first.");
                }
            }
            if (data.info.chunks.length > 1) {
                if (data.info.chunks[data.info.chunks.length - 1].TYPE.compare(PNGCoderInfoChunkIENDType) === 0) {
                    break;
                }
            }
            if (position >= buffer.length) {
                throw new Error("Chunk end-of-file marker 'IEND' not found.");
            }
        }
        data.info.chunks.forEach((chunk) => chunk.checkOthers(data.info.chunks));
        return position;
    }

    private getChunk(buffer: Buffer): PNGCoderInfoChunk {
        const TYPE = buffer.slice(4, 8);
        if (TYPE.compare(PNGCoderInfoChunkIDATType) === 0) return new PNGCoderInfoChunkIDAT(buffer);
        if (TYPE.compare(PNGCoderInfoChunkIHDRType) === 0) return new PNGCoderInfoChunkIHDR(buffer);
        if (TYPE.compare(PNGCoderInfoChunkIENDType) === 0) return new PNGCoderInfoChunkIEND(buffer);
        if (TYPE.compare(PNGCoderInfoChunkPLTEType) === 0) return new PNGCoderInfoChunkPLTE(buffer);
        return new PNGCoderInfoChunk(buffer);
    }

    // ENCODER

    public encoder(data: { info: PNGCoderInfo; binary: Uint8Array; }): Promise<string> {
        throw new Error("Method not implemented.");
    }

}
