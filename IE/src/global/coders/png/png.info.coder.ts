import { ImageCoderInfoImplementation } from '../../common/implementations/image-coder.implementation';

import { PNGCoderInfoChunk } from './png.info-chunk.coder';

export interface PNGCoderInfo extends ImageCoderInfoImplementation {
    chunks: PNGCoderInfoChunk[];
}
