import "./CoAnMoPluginCli.css";
export { actions as CoAnMoPluginCliActions } from "./Actions/actions";
export interface ActionContextI {
    $stdout: HTMLElement | null;
    actions: ActionI[];
    config: {
        [key: string]: string;
    };
    doc: Document;
    meta: string;
    name: string;
    version: string;
}
export interface ActionI {
    name: string;
    summary: string;
    synopsis: string;
    fn: (args: string[], context: ActionContextI) => string;
}
export interface ParsedCommandI {
    actionName: string;
    args: string[];
    filter: RegExp;
}
export declare function parseCommand(command: string): ParsedCommandI;
export declare class CoAnMoPluginCli {
    private name;
    private version;
    private doc;
    private meta;
    private storage;
    private $stdin;
    private $stdout;
    private actions;
    constructor(name: string, version: string, stdinSelector: string, stdoutSelector: string, doc: HTMLDocument, meta: string, storage: Storage);
    addActions(actions: ActionI[]): void;
    focusOnInput(): void;
    log(message: string): string;
    run(command: string): string | void;
}
