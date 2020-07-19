var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
export var help = {
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
            return "ERROR: 'help' expected 0 or 1 args, but got " + args.length;
        var actionNameLc = args[0].toLowerCase();
        var action = actions.find(function (actn) { return actn.name === actionNameLc; });
        if (!action)
            return "No such action '" + actionNameLc + "'";
        return action.name + "  " + action.summary;
    }
};
//# sourceMappingURL=help.js.map