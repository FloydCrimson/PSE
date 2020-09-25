// https://tools.ietf.org/html/rfc2083

import * as fs from 'fs';

import { ImageCoderImplementation } from '../../common/implementations/image-coder.implementation';

import { PNGCoderService } from './png.coder.service';
import { PNGCoderInfo } from './png.info.coder';
import { PNGCoderInfoChunk } from './png.info-chunk.coder';
import { PNGCoderInfoChunkbKGD } from './png.info-chunk-bKGD.coder';
import { PNGCoderInfoChunkcHRM } from './png.info-chunk-cHRM.coder';
import { PNGCoderInfoChunkgAMA } from './png.info-chunk-gAMA.coder';
import { PNGCoderInfoChunkhIST } from './png.info-chunk-hIST.coder';
import { PNGCoderInfoChunkIDAT } from './png.info-chunk-IDAT.coder';
import { PNGCoderInfoChunkIHDR } from './png.info-chunk-IHDR.coder';
import { PNGCoderInfoChunkpHYs } from './png.info-chunk-pHYs.coder';
import { PNGCoderInfoChunkIEND } from './png.info-chunk-IEND.coder';
import { PNGCoderInfoChunkPLTE } from './png.info-chunk-PLTE.coder';
import { PNGCoderInfoChunksBIT } from './png.info-chunk-sBIT.coder';
import { PNGCoderInfoChunktEXt } from './png.info-chunk-tEXt.coder';
import { PNGCoderInfoChunktIME } from './png.info-chunk-tIME.coder';

export class PNGCoder implements ImageCoderImplementation<PNGCoderInfo> {

    private service = new PNGCoderService();

    // DECODER

    public async decoder(file: string): Promise<{ info: PNGCoderInfo; binary: Uint8Array; }> {
        const buffer = fs.readFileSync(file);
        let data: { info: PNGCoderInfo; binary: Uint8Array; } = { info: {} as PNGCoderInfo, binary: new Uint8Array() };
        let position: number = 0;
        position = this.checkSignature(position, buffer, data);
        position = this.getChunks(position, buffer, data);
        position = this.checkAll(position, buffer, data);
        return data;
    }

    //

    private checkSignature(position: number, buffer: Buffer, data: { info: PNGCoderInfo; binary: Uint8Array; }): number {
        const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]); // (ASCII C notation)   \211 P N G \r \n \032 \n
        if (buffer.compare(SIGNATURE, 0, SIGNATURE.length, position, position + SIGNATURE.length) !== 0) {
            throw new Error('Signature check failed.');
        }
        return position + SIGNATURE.length;
    }

    private getChunks(position: number, buffer: Buffer, data: { info: PNGCoderInfo; binary: Uint8Array; }): number {
        data.info.chunks = [];
        while (true) {
            const length = buffer.readUInt32BE(position);
            const chunk = this.getChunk(buffer.slice(position, position + 12 + length));
            chunk.checkSelf();
            position += 12 + length;
            data.info.chunks.push(chunk);
            if (data.info.chunks.length === 1) {
                if (data.info.chunks[0].getType() !== PNGCoderInfoChunkIHDR.Type) {
                    throw new Error('Chunk start-of-file marker IHDR not first.');
                }
            }
            if (data.info.chunks.length > 1) {
                if (data.info.chunks[data.info.chunks.length - 1].getType() === PNGCoderInfoChunkIEND.Type) {
                    break;
                }
            }
            if (position >= buffer.length) {
                throw new Error('Chunk end-of-file marker IEND not found.');
            }
        }
        data.info.chunks.forEach((chunk) => chunk.checkOthers(data.info.chunks));
        return position;
    }

    private getChunk(buffer: Buffer): PNGCoderInfoChunk {
        const type = buffer.readUInt32BE(4);
        switch (type) {
            case PNGCoderInfoChunkbKGD.Type: return new PNGCoderInfoChunkbKGD(this.service, buffer);
            case PNGCoderInfoChunkcHRM.Type: return new PNGCoderInfoChunkcHRM(this.service, buffer);
            case PNGCoderInfoChunkgAMA.Type: return new PNGCoderInfoChunkgAMA(this.service, buffer);
            case PNGCoderInfoChunkhIST.Type: return new PNGCoderInfoChunkhIST(this.service, buffer);
            case PNGCoderInfoChunkIDAT.Type: return new PNGCoderInfoChunkIDAT(this.service, buffer);
            case PNGCoderInfoChunkIHDR.Type: return new PNGCoderInfoChunkIHDR(this.service, buffer);
            case PNGCoderInfoChunkpHYs.Type: return new PNGCoderInfoChunkpHYs(this.service, buffer);
            case PNGCoderInfoChunkIEND.Type: return new PNGCoderInfoChunkIEND(this.service, buffer);
            case PNGCoderInfoChunkPLTE.Type: return new PNGCoderInfoChunkPLTE(this.service, buffer);
            case PNGCoderInfoChunksBIT.Type: return new PNGCoderInfoChunksBIT(this.service, buffer);
            case PNGCoderInfoChunktEXt.Type: return new PNGCoderInfoChunktEXt(this.service, buffer);
            case PNGCoderInfoChunktIME.Type: return new PNGCoderInfoChunktIME(this.service, buffer);
        }
        return new PNGCoderInfoChunk(this.service, buffer);
    }

    private checkAll(position: number, buffer: Buffer, data: { info: PNGCoderInfo; binary: Uint8Array; }): number {
        // INTEGRITY
        if (data.info.chunks.length === 0) {
            throw new Error('Chunks not found.');
        }
        if (data.info.chunks[0].getType() !== PNGCoderInfoChunkIHDR.Type) {
            throw new Error('Chunk IHDR mandatory not found.');
        }
        if (data.info.chunks[data.info.chunks.length - 1].getType() !== PNGCoderInfoChunkIEND.Type) {
            throw new Error('Chunk IEND mandatory not found.');
        }
        if (data.info.chunks.find((chunk) => chunk.getType() === PNGCoderInfoChunkIDAT.Type) === undefined) {
            throw new Error('Chunk IDAT mandatory not found.');
        }
        // BIT
        data.info.chunks.forEach((chunk) => {
            if (chunk.getAncillaryBit() === false && chunk.constructor === PNGCoderInfoChunk) {
                console.warn('Chunk critical and unknown found.', chunk);
            }
            if (chunk.getReservedBit() === true) {
                console.warn('Chunk reserved found.', chunk);
            }
        });
        //
        return position;
    }

    // ENCODER

    public encoder(data: { info: PNGCoderInfo; binary: Uint8Array; }): Promise<string> {
        throw new Error('Method not implemented.');
    }

}
