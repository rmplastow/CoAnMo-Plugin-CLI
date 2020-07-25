import { ActionI, ActionContextI } from "../CoAnMoPluginCli";

export enum Hue {
  red = "red",
  orange = "orange",
  yellow = "yellow",
  green = "green",
  cyan = "cyan",
  blue = "blue",
  magenta = "magenta",
  grey = "grey"
}

// See ‘/* The default hue-shift is blue */’ in ‘src/CoAnMoPluginCli.css’.
export const defaultHue = Hue.blue;

export function stringToHue(hueString: string): Hue | void {
  switch (hueString) {
    case "red":
      return Hue.red;
    case "orange":
      return Hue.orange;
    case "yellow":
      return Hue.yellow;
    case "green":
      return Hue.green;
    case "cyan":
      return Hue.cyan;
    case "blue":
      return Hue.blue;
    case "magenta":
      return Hue.magenta;
    case "grey":
      return Hue.grey;
    default:
      return undefined;
  }
}

export function getCurrentHue(doc: Document): Hue {
  const hueClass = doc.body.className
    .split(/\s+/)
    .find(className => className.slice(0, 4) === "hue-");
  if (!hueClass) return defaultHue; // `undefined` defaults to blue, if not found
  const hue = stringToHue(hueClass.slice(4));
  if (!hue) return defaultHue; // 'hue-nope' defaults to blue
  return hue;
}

export function stringToHueMeaning(hueString: string): string | void {
  switch (hueString) {
    case "red":
      return "Encountered a critical error";
    case "orange":
      return "Encountered an error";
    case "yellow":
      return "Encountered a warning";
    case "green":
      return "Connected to a service";
    case "cyan":
      return "Important information";
    case "blue":
      return "Not connected to a service";
    case "magenta":
      return "Service not responding";
    case "grey":
      return "Initialising or quitted";
    default:
      return undefined;
  }
}

export function renderHueAndMeaning(hueString: string, index: number) {
  const meaning = stringToHueMeaning(hueString) || "";
  return `${`  ${index + 1}. ${hueString} `.padEnd(
    40 - 1 - meaning.length,
    "."
  )} ${meaning}`;
}

export function getHueSynopsis(): string {
  const topHue = Object.keys(Hue)[0];
  const hueTally = Object.keys(Hue).length;
  return [
    "Get the CoAnMo’s current color scheme:",
    "  > hue",
    `Set the color scheme to ${topHue}:`,
    `  > hue ${topHue}`,
    `The ${hueTally} color schemes and their meanings:`,
    ...Object.keys(Hue).map(renderHueAndMeaning)
  ].join("\n");
}

export const hue: ActionI = {
  name: "hue",
  summary: "Gets and sets the color scheme",
  synopsis: getHueSynopsis(),
  fn(args: string[], context: ActionContextI) {
    const { doc } = context;
    const currentHue = getCurrentHue(doc);
    if (args.length === 0) return `${currentHue}`;
    if (args.length !== 1)
      return `ERROR: 'hue' expected 0 or 1 args, but got ${args.length}`;
    const newHue = stringToHue(args[0]);
    if (!newHue)
      return `ERROR: 'hue' got unexpected argument '${args[0]}' — try 'green'`;
    doc.body.classList.remove(`hue-${currentHue}`);
    doc.body.classList.add(`hue-${args[0]}`);
    return `Was ${currentHue}, now ${args[0]}`;
  }
};
