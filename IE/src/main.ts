import * as fs from 'fs';
import * as path from 'path';

import { PNGCoder } from './global/coders/png/png.coder';

const coder = new PNGCoder();
coder.decoder(path.resolve(__dirname, '../src/assets/PNG/Immagine1.png')).then((result) => {
    console.log('Chunks\n\n' + result.info.chunks.map((chunk) => chunk.toString()).join('\n\n'));
}, (error) => console.error(error)).catch((error) => console.error(error));

// Immagine1    IHDR gAMA cHRM pHYs IDAT IEND
// Immagine2    IHDR IDAT tEXt IEND
// Immagine3    IHDR gAMA sRGB PLTE tRNS IDAT IEND

// import { CMP } from './global/helpers/compressor';

// const cmp = new CMP(fs.readFileSync(path.resolve(__dirname, '../src/assets/PNG/Immagine1.png')));
// cmp.compress().then((buffer) => {

// }, (error) => console.error(error)).catch((error) => console.error(error));
