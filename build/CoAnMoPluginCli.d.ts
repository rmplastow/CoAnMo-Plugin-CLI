import "./CoAnMoPluginCli.css";
export { actions as CoAnMoPluginCliActions } from './Actions/actions';
export interface ActionContextI {
    $stdout: HTMLElement | null;
    actions: ActionI[];
    doc: Document;
    name: string;
    version: string;
}
export interface ActionI {
    name: string;
    summary: string;
    synopsis: string;
    fn: (args: string[], context: ActionContextI) => string;
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
