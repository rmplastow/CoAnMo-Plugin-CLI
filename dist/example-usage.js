"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var CoAnMoPluginCliV1_1 = require("./CoAnMoPluginCliV1");
var cli = new CoAnMoPluginCliV1_1.CoAnMoPluginCliV1("ExampleCoAnMo", "1.2.3", ".CoAnMoPluginCliV1.stdin", ".CoAnMoPluginCliV1.stdout", document);
cli.addActions([
    {
        name: "help",
        summary: "Shows a help message",
        fn: function (args, meta) {
            var actions = meta.actions, name = meta.name, version = meta.version;
            var longest = actions.reduce(function (longest, action) {
                if (longest === void 0) { longest = 0; }
                return Math.max(longest, action.name.length);
            }, 0);
            if (args.length === 0)
                return __spreadArrays([
                    name + " " + version + " Actions:"
                ], actions.map(function (action) {
                    return "" + action.name.padEnd(longest + 2, " ") + action.summary;
                })).join("\n");
            if (args.length !== 1)
                return "'help' got " + args.length + " args, expected 0 or 1 " + args.join();
            var actionNameLc = args[0].toLowerCase();
            var action = actions.find(function (actn) { return actn.name === actionNameLc; });
            if (!action)
                return "No such action '" + actionNameLc + "'";
            return action.name + "  " + action.summary;
        }
    },
    {
        name: "version",
        summary: "Shows the CoAnMo’s version",
        fn: function (args, meta) {
            var name = meta.name, version = meta.version;
            return name + " " + version;
        }
    }
]);
cli.focusOnInput();
//# sourceMappingURL=example-usage.js.map