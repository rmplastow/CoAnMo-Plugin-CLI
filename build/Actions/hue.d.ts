import { ActionI } from "../CoAnMoPluginCli";
export declare enum Hue {
    red = "red",
    orange = "orange",
    yellow = "yellow",
    green = "green",
    cyan = "cyan",
    blue = "blue",
    magenta = "magenta",
    grey = "grey"
}
export declare const defaultHue = Hue.blue;
export declare function stringToHue(hueString: string): Hue | void;
export declare function getCurrentHue(doc: Document): Hue;
export declare function stringToHueMeaning(hueString: string): string | void;
export declare function renderHueAndMeaning(hueString: string, index: number): string;
export declare function getHueSynopsis(): string;
export declare const hue: ActionI;
