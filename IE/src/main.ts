import { PNGCoder } from "./global/coders/png/png.coder";

const coder = new PNGCoder();
coder.decoder('C:/Users/Floyd/Desktop/Immagine.png').then((result) => {
    console.log(result);
}, (error) => console.error(error)).catch((error) => console.error(error));
