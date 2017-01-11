export interface HttpEvent {
    http: {
        method: string;
        path: string;
    };
}
export interface Definition {
    handler: string;
    events: Array<HttpEvent>;
}
export declare function bindLog(fn: {
    (msg: string): void;
}): void;
export declare function definition(handler: string, url: string, method: string): Definition;
export declare function handler(namespace: string, name: string): string;
export declare function httpEvent(url: string, method: string): HttpEvent;
export declare function name(url: string, method: string): string;
export declare function src(name: string): string;
export declare function writeHandler(path: string, name: string): void;
export declare function generate(swaggerPaths: any, namespace: string, outputPath: string): {
    [fn: string]: Definition;
};
export declare function mapDefinitionEvent(definition: Definition, event: HttpEvent): Definition;
export declare function map(swaggerPaths: any, functions: any): any;
