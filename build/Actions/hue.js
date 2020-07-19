var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
export var Hue;
(function (Hue) {
    Hue["red"] = "red";
    Hue["orange"] = "orange";
    Hue["yellow"] = "yellow";
    Hue["green"] = "green";
    Hue["cyan"] = "cyan";
    Hue["blue"] = "blue";
    Hue["magenta"] = "magenta";
    Hue["grey"] = "grey";
})(Hue || (Hue = {}));
export function stringToHue(string) {
    switch (string) {
        case "red":
            return Hue.red;
        case "orange":
            return Hue.orange;
        case "yellow":
            return Hue.yellow;
        case "green":
            return Hue.green;
        case "cyan":
            return Hue.cyan;
        case "blue":
            return Hue.blue;
        case "magenta":
            return Hue.magenta;
        case "grey":
            return Hue.grey;
        default:
            return undefined;
    }
}
export function getCurrentHue(doc) {
    var hueClass = doc.body.className
        .split(/\s+/)
        .find(function (className) { return className.slice(0, 4) === "hue-"; });
    if (!hueClass)
        return Hue.blue; // `undefined` defaults to blue, if not found
    var hue = stringToHue(hueClass.slice(4));
    if (!hue)
        return Hue.blue; // 'hue-nope' defaults to blue
    return hue;
}
export var hue = {
    name: "hue",
    summary: "Gets and sets the color scheme",
    synopsis: __spreadArrays([
        "Get the CoAnMo’s current color scheme:",
        "  > hue",
        "Set the color scheme to " + Object.keys(Hue)[0] + ":",
        "  > hue " + Object.keys(Hue)[0],
        "There are " + Object.keys(Hue).length + " color schemes:"
    ], Object.keys(Hue).map(function (hue, index) { return "  " + (index + 1) + ". " + hue; })).join("\n"),
    fn: function (args, context) {
        var doc = context.doc;
        var currentHue = getCurrentHue(doc);
        if (args.length === 0)
            return "" + currentHue;
        if (args.length !== 1)
            return "ERROR: 'hue' expected 0 or 1 args, but got " + args.length;
        var newHue = stringToHue(args[0]);
        if (!newHue)
            return "ERROR: 'hue' got unexpected argument '" + args[0] + "' \u2014 try 'green'";
        doc.body.classList.remove("hue-" + currentHue);
        doc.body.classList.add("hue-" + args[0]);
        return "Was " + currentHue + ", now " + args[0];
    }
};
//# sourceMappingURL=hue.js.map