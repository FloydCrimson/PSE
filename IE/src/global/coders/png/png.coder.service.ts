import { CRC32 } from '../../helpers/crc32';

export class PNGCoderService {

    public readonly crc32 = new CRC32(0xedb88320);

}
