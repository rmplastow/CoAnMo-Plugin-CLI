var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
export function renderNameAndSummary(action, length) {
    return (action.name + " ").padEnd(length - 1 - action.summary.length, ".") + " " + action.summary;
}
export var help = {
    name: "help",
    summary: "Shows information about actions",
    synopsis: "For a list of available actions:\n  > help\nTo show an action\u2019s synopsis:\n  > help &lt;action>",
    fn: function (args, context) {
        var actions = context.actions;
        if (args.length === 0)
            return __spreadArrays(actions
                .sort(function (a, b) { return a.name > b.name ? 1 : -1; })
                .map(function (action) { return renderNameAndSummary(action, 40); }), [
                "Use `help &lt;action>` to show an action\u2019s synopsis, eg `help " + actions[actions.length - 1].name + "`"
            ]).join("\n");
        if (args.length !== 1)
            return "ERROR: 'help' expected 0 or 1 args, but got " + args.length;
        var actionNameLc = args[0].toLowerCase();
        var action = actions.find(function (actn) { return actn.name === actionNameLc; });
        if (!action)
            return "ERROR: No such action '" + actionNameLc + "'";
        return action.synopsis;
    }
};
//# sourceMappingURL=help.js.map