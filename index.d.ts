import { Serverless } from './serverless';
declare class ServerlessSwaggerPlugin {
    private provider;
    private serverless;
    private commands;
    private hooks;
    constructor(serverless: Serverless, options: any);
    run: () => void;
    log: (msg: string) => void;
    load(): any;
    readonly swaggerFile: string;
    hasSwaggerFile(): boolean;
}
export = ServerlessSwaggerPlugin;
