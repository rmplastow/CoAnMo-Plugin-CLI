export var version = {
    name: "version",
    summary: "Shows the name and version",
    fn: function (args, meta) {
        var name = meta.name, version = meta.version;
        if (args.length !== 0)
            return "ERROR: 'version' expected 0 args, but got " + args.length;
        return name + " " + version;
    }
};
//# sourceMappingURL=version.js.map