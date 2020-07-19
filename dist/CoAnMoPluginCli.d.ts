import "./CoAnMoPluginCli.css";
export interface ActionMetaI {
    actions: ActionI[];
    name: string;
    version: string;
}
export interface ActionI {
    name: string;
    summary: string;
    fn: (args: string[], meta: ActionMetaI) => string;
}
export declare class CoAnMoPluginCli {
    private name;
    private version;
    private $stdin;
    private $stdout;
    private actions;
    constructor(name: string, version: string, stdinSelector: string, stdoutSelector: string, doc: HTMLDocument);
    addActions(actions: ActionI[]): void;
    focusOnInput(): void;
    log(message: string): void;
    run(command: string): void;
}
