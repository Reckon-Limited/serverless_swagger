import { Serverless } from './serverless';
declare class ServerlessSwaggerPlugin {
    private provider;
    private serverless;
    private commands;
    private hooks;
    private swagger;
    constructor(serverless: Serverless, options: any);
    generate: () => void;
    run: () => void;
    log: (msg: string) => void;
    load(): any;
    loadServerless(): any;
    writeServerless(obj: any): void;
    readonly swaggerFile: string;
    readonly serverlessFile: string;
    readonly outputPath: string;
    hasSwaggerFile(): boolean;
}
export = ServerlessSwaggerPlugin;
