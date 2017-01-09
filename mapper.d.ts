export declare class Mapper {
    private swagger;
    private functions;
    private log;
    constructor(swagger: any, functions: any, log: {
        (msg: string): void;
    });
    map(): void;
}
