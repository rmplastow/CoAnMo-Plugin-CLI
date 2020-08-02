import "./CoAnMoPluginCli.css";
// Re-export some generally useful actions.
export { actions as CoAnMoPluginCliActions } from "./Actions/actions";
export function parseCommand(command) {
    var parts = command.trim().split(/\s+/);
    var matches = parts[0].match(/^\/(.+)\/([igm]*)$/);
    return matches
        ? {
            actionName: parts[1].toLowerCase(),
            args: parts.slice(2),
            filter: RegExp(matches[1], matches[2])
        }
        : {
            actionName: parts[0].toLowerCase(),
            args: parts.slice(1),
            filter: /^.?/ // matches everything
        };
}
var CoAnMoPluginCli = /** @class */ (function () {
    function CoAnMoPluginCli(name, version, stdinSelector, stdoutSelector, doc, meta, storage) {
        var _this = this;
        this.name = name;
        this.version = version;
        this.doc = doc;
        this.meta = meta;
        this.storage = storage;
        this.actions = [];
        this.$stdin = doc.querySelector(stdinSelector);
        this.$stdout = doc.querySelector(stdoutSelector);
        this.log(name + " " + version);
        this.log("" + meta);
        if (this.$stdin)
            this.$stdin.addEventListener("keydown", function (evt) {
                if (_this.$stdin && evt.key === "Enter")
                    _this.run(_this.$stdin.value);
            });
    }
    CoAnMoPluginCli.prototype.addActions = function (actions) {
        var _this = this;
        actions.forEach(function (action) { return _this.actions.push(action); });
    };
    CoAnMoPluginCli.prototype.focusOnInput = function () {
        if (this.$stdin)
            this.$stdin.focus();
    };
    CoAnMoPluginCli.prototype.log = function (message) {
        if (!this.$stdout)
            return message;
        var currentHtml = this.$stdout.innerHTML;
        var newHtml;
        if (currentHtml.trim() === "")
            newHtml = message;
        else
            newHtml = currentHtml + ("\n" + message);
        newHtml = newHtml
            .split("\n")
            .map(function (line) {
            return "> " === line.substr(0, 2) || "ERROR: " === line.substr(0, 7)
                ? "<b>" + line + "</b>"
                : line;
        })
            .join("\n");
        this.$stdout.innerHTML = newHtml;
        this.$stdout.scroll(0, 999999);
        return message;
    };
    CoAnMoPluginCli.prototype.run = function (command) {
        if (!this.$stdin)
            return;
        this.$stdin.value = "";
        var _a = parseCommand(command), actionName = _a.actionName, args = _a.args, filter = _a.filter;
        if (actionName === "")
            return this.log("> ");
        if (!filter.test(this.meta))
            return;
        var action = this.actions.find(function (actn) { return actn.name === actionName; });
        if (!action)
            return this.log("ERROR: No such action '" + actionName + "' - try 'help'");
        this.log("> " + actionName + " " + args.join(" "));
        return this.log(action.fn(args, {
            $stdout: this.$stdout,
            actions: this.actions,
            config: {},
            doc: this.doc,
            meta: this.meta,
            name: this.name,
            version: this.version
        }));
    };
    return CoAnMoPluginCli;
}());
export { CoAnMoPluginCli };
//# sourceMappingURL=CoAnMoPluginCli.js.map