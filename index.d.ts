import { Serverless } from './serverless';
import { Definition } from './generator';
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
    loadSwagger(): any;
    readonly swaggerFile: string;
    readonly serverlessFile: string;
    readonly namespace: any;
    readonly outputPath: string;
    hasSwaggerFile(): boolean;
    writeSlsFunctions(definitions: {
        [fn: string]: Definition;
    }): void;
    loadSls(): any;
}
export = ServerlessSwaggerPlugin;
