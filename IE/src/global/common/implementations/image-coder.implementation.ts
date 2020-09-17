export interface ImageCoderImplementation<I extends ImageCoderInfoImplementation> {
    decoder(file: string): Promise<{ info: I; binary: Uint8Array; }>;
    encoder(data: { info: I; binary: Uint8Array; }): Promise<string>;
}

export interface ImageCoderInfoImplementation {
    name: string;
    extension: string;
    size: number;
    width: number;
    height: number;
}
