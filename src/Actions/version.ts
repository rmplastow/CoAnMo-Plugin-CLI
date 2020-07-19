import { ActionI, ActionMetaI } from "../CoAnMoPluginCli";

export const version: ActionI = {
  name: "version",
  summary: "Shows the name and version",
  synopsis: `Shows the "name" and "version" fields,
from the CoAnMo’s ‘package.json’ file`,
  fn(args: string[], meta: ActionMetaI) {
    const { name, version } = meta;
    if (args.length !== 0)
      return `ERROR: 'version' expected 0 args, but got ${args.length}`;
    return `${name} ${version}`;
  }
};
