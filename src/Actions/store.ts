import { ActionI, ActionContextI } from "../CoAnMoPluginCli";

export function indefiniteArticleType(value: unknown) {
  if (Array.isArray(value)) return "an array";
  if (value === null) return "null"; // not 'a null'
  if (value === undefined) return "undefined"; // not 'an undefined'
  const type = typeof value;
  return `a${"aeiou".includes(type.slice(0, 1)) ? "n" : ""} ${type}`;
}

export const store: ActionI = {
  name: "store",
  summary: "Manages the `store` object",
  synopsis: [
    "Get the CoAnMo’s current `store` object:",
    "  > store",
    "Replace the current `store` object:",
    `  > store { "b":true, "n":1 ,"str":"!" }`,
    "It can’t be deleted, but you can:",
    `  > store { }`,
    "The `store` object is persisted using",
    "localStorage.setItem(), in the key",
    "'CoAnMoPluginCli.store'. It can be used",
    "to store any kind of settings. For",
    "example, log-in credentials."
  ].join("\n"),
  fn(args: string[], context: ActionContextI) {
    const { setStore, store } = context;
    if (args.length === 0) return JSON.stringify(store, null, "  ");
    let newStore: { [key: string]: boolean | number | string };
    try {
      newStore = JSON.parse(args.join(" "));
      const iaType = indefiniteArticleType(newStore);
      if (iaType !== "an object")
        return `ERROR: 'store' expects a JSON object, not ${iaType}`;
      const errors = Object.keys(newStore).reduce(
        (errors: string[], key: string) => {
          const iaType = indefiniteArticleType(newStore[key]);
          return ["a boolean", "a number", "a string"].includes(iaType)
            ? errors
            : [...errors, `'${key}' is ${iaType}`];
        },
        []
      );
      if (errors.length)
        return (
          "ERROR: 'store' expects all values to be booleans, numbers and strings:\n" +
          `  ${errors.join("\n  ")}`
        );
    } catch (err) {
      return `ERROR: Cannot parse 'CoAnMoPluginCli.store':\n  ${err}`;
    }
    setStore(newStore);
    const keyTally = Object.keys(newStore).length;
    return `stored an object containing ${keyTally} value${
      keyTally === 1 ? "" : "s"
    }`;
  }
};
// store { "arr":[456], "boo":true, "nul":null, "num":123, "obj":{}, "str":"456" }
