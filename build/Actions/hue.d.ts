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
export declare function stringToHue(string: string): Hue | void;
export declare function getCurrentHue(doc: Document): Hue;
export declare const hue: ActionI;
