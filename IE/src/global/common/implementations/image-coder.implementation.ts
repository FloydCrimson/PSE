export interface ImageCoderImplementation<I extends ImageCoderInfoImplementation> {
    decoder(file: string): Promise<{ info: I; binary: Uint8Array; }>;
    encoder(data: { info: I; binary: Uint8Array; }): Promise<string>;
}

export interface ImageCoderInfoImplementation {
    width: number;
    height: number;
    size: number;
}
