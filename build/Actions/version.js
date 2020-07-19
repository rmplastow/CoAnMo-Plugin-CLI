export var version = {
    name: "version",
    summary: "Shows the name and version",
    synopsis: "Shows the \"name\" and \"version\" fields,\nfrom the CoAnMo\u2019s \u2018package.json\u2019 file",
    fn: function (args, context) {
        var name = context.name, version = context.version;
        if (args.length !== 0)
            return "ERROR: 'version' expected 0 args, but got " + args.length;
        return name + " " + version;
    }
};
//# sourceMappingURL=version.js.map