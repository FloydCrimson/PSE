import * as path from 'path';

import { PNGCoder } from './global/coders/png/png.coder';

const coder = new PNGCoder();
coder.decoder(path.resolve(__dirname, '../src/assets/PNG/Immagine1.png')).then((result) => {
    console.log('Chunks\n\n' + result.info.chunks.map((chunk) => chunk.toString()).join('\n\n'));
    console.log(result);
}, (error) => console.error(error)).catch((error) => console.error(error));
