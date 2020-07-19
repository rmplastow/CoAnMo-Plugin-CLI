export var clear = {
    name: "clear",
    summary: "Deletes the stdout log",
    synopsis: "Deletes everything in the on-screen stdout panel.\nDoes not delete history, or remotely stored logs.",
    fn: function (args, context) {
        var $stdout = context.$stdout;
        if (args.length !== 0)
            return "ERROR: 'clear' expected 0 args, but got " + args.length;
        if ($stdout)
            $stdout.innerHTML = '';
        return '';
    }
};
//# sourceMappingURL=clear.js.map