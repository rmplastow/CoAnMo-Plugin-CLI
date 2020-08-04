var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
export function indefiniteArticleType(value) {
    if (Array.isArray(value))
        return "an array";
    if (value === null)
        return "null"; // not 'a null'
    if (value === undefined)
        return "undefined"; // not 'an undefined'
    var type = typeof value;
    return "a" + ("aeiou".includes(type.slice(0, 1)) ? "n" : "") + " " + type;
}
export var store = {
    name: "store",
    summary: "Manages the `store` object",
    synopsis: "@TODO write 'store' synopsis",
    fn: function (args, context) {
        var setStore = context.setStore, store = context.store;
        if (args.length === 0)
            return JSON.stringify(store, null, "  ");
        var newStore;
        try {
            newStore = JSON.parse(args.join(" "));
            var iaType = indefiniteArticleType(newStore);
            if (iaType !== "an object")
                return "ERROR: 'store' expects a JSON object, not " + iaType;
            var errors = Object.keys(newStore).reduce(function (errors, key) {
                var iaType = indefiniteArticleType(newStore[key]);
                return ["a boolean", "a number", "a string"].includes(iaType)
                    ? errors
                    : __spreadArrays(errors, ["'" + key + "' is " + iaType]);
            }, []);
            if (errors.length)
                return ("ERROR: 'store' expects all values to be booleans, numbers and strings:\n" +
                    ("  " + errors.join("\n  ")));
        }
        catch (err) {
            return "ERROR: Cannot parse 'CoAnMoPluginCli.store':\n  " + err;
        }
        setStore(newStore);
        var keyTally = Object.keys(newStore).length;
        return "stored an object containing " + keyTally + " value" + (keyTally === 1 ? "" : "s");
    }
};
// store { "arr":[456], "boo":true, "nul":null, "num":123, "obj":{}, "str":"456" }
//# sourceMappingURL=store.js.map