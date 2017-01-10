export declare class Mapper {
    private swagger;
    private functions;
    private path;
    private log;
    constructor(swagger: any, functions: any, path: string, log: {
        (msg: string): void;
    });
    generate(): {
        [key: string]: any;
    };
    map(): void;
    generateEvent(url: string, method: string): {
        http: {
            method: string;
            path: string;
        };
    };
    generateHandler(name: string): string;
    functionName(url: string, method: string): string;
    functionHandler(name: string): string;
}
