import "./CoAnMoPluginCli.css";
export { actions as CoAnMoPluginCliActions } from './Actions/actions';
export interface ActionMetaI {
    actions: ActionI[];
    name: string;
    version: string;
}
export interface ActionI {
    name: string;
    summary: string;
    fn: (args: string[], meta: ActionMetaI, doc: Document) => string;
}
export declare class CoAnMoPluginCli {
    private name;
    private version;
    private doc;
    private $stdin;
    private $stdout;
    private actions;
    constructor(name: string, version: string, stdinSelector: string, stdoutSelector: string, doc: HTMLDocument);
    addActions(actions: ActionI[]): void;
    focusOnInput(): void;
    log(message: string): void;
    run(command: string): void;
}
