import "./CoAnMoPluginCli.css";
// Re-export some generally useful actions.
export { actions as CoAnMoPluginCliActions } from "./Actions/actions";
var CoAnMoPluginCli = /** @class */ (function () {
    function CoAnMoPluginCli(name, version, stdinSelector, stdoutSelector, doc) {
        var _this = this;
        this.name = name;
        this.version = version;
        this.doc = doc;
        this.actions = [];
        this.$stdin = doc.querySelector(stdinSelector);
        this.$stdout = doc.querySelector(stdoutSelector);
        this.log(name + " " + version);
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
        var _a = command.trim().split(/\s+/), actionName = _a[0], args = _a.slice(1);
        var actionNameLc = actionName.toLowerCase(); // because, iPad keyboard
        if (actionName === "")
            return this.log("> ");
        var action = this.actions.find(function (actn) { return actn.name === actionNameLc; });
        if (!action)
            return this.log("ERROR: No such action '" + actionNameLc + "' - try 'help'");
        this.log("> " + actionNameLc + " " + args.join(" "));
        return this.log(action.fn(args, {
            $stdout: this.$stdout,
            actions: this.actions,
            doc: this.doc,
            name: this.name,
            version: this.version
        }));
    };
    return CoAnMoPluginCli;
}());
export { CoAnMoPluginCli };
//# sourceMappingURL=CoAnMoPluginCli.js.map