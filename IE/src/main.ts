import * as path from 'path';

import { PNGCoder } from './global/coders/png/png.coder';

const coder = new PNGCoder();
coder.decoder(path.resolve(__dirname, '../src/assets/PNG/Immagine1.png')).then((result) => {
    console.log(result);
}, (error) => console.error(error)).catch((error) => console.error(error));
