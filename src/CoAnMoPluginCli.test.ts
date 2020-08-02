import {
  ActionContextI,
  CoAnMoPluginCli,
  parseCommand,
  ParsedCommandI
} from "./CoAnMoPluginCli";

// Mocks and spies.

let eventNameSpy: string | null = null;
let callbackSpy: ((evt: Event) => void) | null = null;
let focusSpy = false;
let scrollXSpy: number | null = null;
let scrollYSpy: number | null = null;
let argsSpy: string[] = [];
let contextSpy: ActionContextI = {} as ActionContextI;

const mockInputEl = {
  addEventListener(eventName: string, callback: (evt: Event) => void): void {
    eventNameSpy = eventName;
    callbackSpy = callback;
  },
  focus(): void {
    focusSpy = true;
  },
  value: ""
} as HTMLInputElement;

const mockOutputEl = {
  innerHTML: "",
  scroll(x: number, y: number) {
    scrollXSpy = x;
    scrollYSpy = y;
  }
} as HTMLPreElement;

const mockDoc = {
  querySelector(selector: string): HTMLElement | null {
    switch (selector) {
      case ".mock-input-el":
        return mockInputEl;
      case ".mock-output-el":
        return mockOutputEl;
      default:
        return null;
    }
  }
} as Document;

const mockStorage = {} as Storage;

const mockAction = {
  name: "mockaction",
  summary: "Summary of the mock action",
  synopsis: "Synopsis of the mock action",
  fn: (args: string[], context: ActionContextI) => {
    argsSpy = args;
    contextSpy = context;
    return "mock result";
  }
};

// Private functions.

describe("parseCommand()", () => {
  it("returns an empty ParsedCommandI if the command argument is an empty string", () => {
    expect(parseCommand("")).toEqual({
      actionName: "",
      args: [],
      filter: /^.?/
    } as ParsedCommandI);
  });
  it("parses the command as expected if no filter is present", () => {
    expect(parseCommand("mockaction foo bar")).toEqual({
      actionName: "mockaction",
      args: ["foo", "bar"],
      filter: /^.?/
    } as ParsedCommandI);
  });
  it("parses the command as expected if a filter is present", () => {
    expect(parseCommand("/metastring/i mockaction foo bar")).toEqual({
      actionName: "mockaction",
      args: ["foo", "bar"],
      filter: /metastring/i
    } as ParsedCommandI);
  });
});

// Constructor.

describe("constructor()", () => {
  const noSuchEls = new CoAnMoPluginCli(
    "test-name", // name
    "test-version", // version
    ".no-such-element", // stdinSelector
    ".no-such-element", // stdoutSelector
    mockDoc, // doc
    "test-meta", // meta
    mockStorage // storage
  );

  test("a CoAnMoPluginCli instance has expected private properties", () => {
    expect(noSuchEls["meta"]).toBe("test-meta"); // stackoverflow.com/a/35991491
    expect(noSuchEls["name"]).toBe("test-name");
    expect(noSuchEls["version"]).toBe("test-version");
    expect(noSuchEls["doc"]).toBe(mockDoc);
    expect(noSuchEls["actions"]).toEqual([]);
    expect(noSuchEls["$stdin"]).toBe(null);
    expect(noSuchEls["$stdout"]).toBe(null);
  });

  test("the `stdinSelector` argument works as expected", () => {
    const hasIn = new CoAnMoPluginCli(
      "test-name",
      "test-version",
      ".mock-input-el",
      ".no-such-element",
      mockDoc,
      "test-meta",
      mockStorage
    );
    expect(hasIn["$stdin"]).toBe(mockInputEl);
    expect(eventNameSpy).toBe("keydown");
    expect(typeof callbackSpy).toBe("function");
  });

  test("the `stdoutSelector` argument works as expected", () => {
    const hasOut = new CoAnMoPluginCli(
      "test-name",
      "test-version",
      ".no-such-element",
      ".mock-output-el",
      mockDoc,
      "test-meta",
      mockStorage
    );
    expect(hasOut["$stdout"]).toBe(mockOutputEl);
    expect(hasOut["$stdout"] && hasOut["$stdout"].innerHTML).toBe(
      "test-name test-version\ntest-meta"
    );
    expect(scrollXSpy).toBe(0);
    expect(scrollYSpy).toBe(999999);
  });

  beforeEach(() => {
    mockOutputEl.innerHTML = "";
    eventNameSpy = null;
    callbackSpy = null;
    focusSpy = false;
    scrollXSpy = null;
    scrollYSpy = null;
  });
});

// Public methods.

describe("addActions()", () => {
  test("adding actions increases the length of the `actions` array", () => {
    const minimal = new CoAnMoPluginCli(
      "",
      "",
      "",
      "",
      mockDoc,
      "",
      mockStorage
    );
    expect(minimal["actions"].length).toBe(0);
    minimal.addActions([]);
    expect(minimal["actions"].length).toBe(0);
    minimal.addActions([mockAction]);
    expect(minimal["actions"].length).toBe(1);
    minimal.addActions([mockAction, mockAction]);
    expect(minimal["actions"].length).toBe(3);
    expect(minimal["actions"][1]).toBe(mockAction);
  });

  test("an added action can be run", () => {
    const hasInOut = new CoAnMoPluginCli(
      "test-name",
      "test-version",
      ".mock-input-el",
      ".mock-output-el",
      mockDoc,
      "test-meta",
      mockStorage
    );
    expect(hasInOut.run("mockaction")).toBe(
      "ERROR: No such action 'mockaction' - try 'help'"
    );
    hasInOut.addActions([mockAction]);
    expect(hasInOut.run("mockaction")).toBe("mock result");
  });
});

describe("focusOnInput()", () => {
  test("calling focusOnInput() calls the input element’s focus() method", () => {
    const hasIn = new CoAnMoPluginCli(
      "",
      "",
      ".mock-input-el",
      "",
      mockDoc,
      "",
      mockStorage
    );
    hasIn.focusOnInput();
    expect(focusSpy).toBe(true);
  });

  beforeEach(() => {
    focusSpy = false;
  });
});

describe("log()", () => {
  it("returns the message with no output element", () => {
    const hasIn = new CoAnMoPluginCli(
      "",
      "",
      ".mock-input-el",
      "",
      mockDoc,
      "",
      mockStorage
    );
    expect(hasIn.log("will not be logged")).toBe("will not be logged");
    expect(mockOutputEl.innerHTML).toBe("");
  });

  test("typically, the input argument becomes a new output innerHTML line", () => {
    const hasOut = new CoAnMoPluginCli(
      "n",
      "v",
      "",
      ".mock-output-el",
      mockDoc,
      "m",
      mockStorage
    );
    expect(mockOutputEl.innerHTML).toBe("n v\nm");
    expect(hasOut.log("first line")).toBe("first line");
    expect(mockOutputEl.innerHTML).toBe("n v\nm\nfirst line");
    expect(hasOut.log("second line")).toBe("second line");
    expect(mockOutputEl.innerHTML).toBe("n v\nm\nfirst line\nsecond line");
  });

  test("if the innerHTML only contained whitespace, it is deleted", () => {
    const hasOut = new CoAnMoPluginCli(
      "",
      "",
      "",
      ".mock-output-el",
      mockDoc,
      "",
      mockStorage
    );
    expect(mockOutputEl.innerHTML).toBe("");
    expect(hasOut.log("first line")).toBe("first line");
    expect(mockOutputEl.innerHTML).toBe("first line");
    mockOutputEl.innerHTML = "   \t\t  \n\n\t \n   ";
    expect(mockOutputEl.innerHTML).toBe("   \t\t  \n\n\t \n   ");
    expect(hasOut.log("first line again")).toBe("first line again");
    expect(mockOutputEl.innerHTML).toBe("first line again");
  });

  test("lines which start '> ' or 'ERROR: ' are made bold", () => {
    const hasOut = new CoAnMoPluginCli(
      "",
      "",
      "",
      ".mock-output-el",
      mockDoc,
      "",
      mockStorage
    );
    expect(hasOut.log("> some command")).toBe("> some command");
    expect(mockOutputEl.innerHTML).toBe("<b>> some command</b>");
    mockOutputEl.innerHTML = "foo 1.2.3\n> foobar\n\nERROR:   extra spaces";
    expect(hasOut.log("ERROR: ")).toBe("ERROR: ");
    expect(mockOutputEl.innerHTML).toBe(
      "foo 1.2.3\n" +
        "<b>> foobar</b>\n" +
        "\n" +
        "<b>ERROR:   extra spaces</b>\n" +
        "<b>ERROR: </b>"
    );
  });

  test("lines which nearly start '>' or 'ERROR: ' are not made bold", () => {
    const hasOut = new CoAnMoPluginCli(
      "",
      "",
      "",
      ".mock-output-el",
      mockDoc,
      "",
      mockStorage
    );
    mockOutputEl.innerHTML =
      "foo 1.2.3\n" +
      "<b>> already bold</b>\n" +
      "<b>ERROR: already bold</b>\n" +
      "<b>Rich</b> format line\n" +
      ">missing space\n" +
      " > leading space\n" +
      "&gt; entity\n" +
      "ERROR:missing space\n" +
      " ERROR: leading space\n" +
      "ERROR; mistyped colon\n" +
      "Error: caps case\n" +
      "error: lowercase";
    expect(hasOut.log("> ERROR: combo!")).toBe("> ERROR: combo!");
    expect(mockOutputEl.innerHTML).toBe(
      "foo 1.2.3\n" +
        "<b>> already bold</b>\n" +
        "<b>ERROR: already bold</b>\n" +
        "<b>Rich</b> format line\n" +
        ">missing space\n" +
        " > leading space\n" +
        "&gt; entity\n" +
        "ERROR:missing space\n" +
        " ERROR: leading space\n" +
        "ERROR; mistyped colon\n" +
        "Error: caps case\n" +
        "error: lowercase\n" +
        "<b>> ERROR: combo!</b>"
    );
  });

  test("The output element’s scroll() method is called as expected", () => {
    expect(scrollXSpy).toBe(null); // from Jest’s beforeEach()
    expect(scrollYSpy).toBe(null);
    const hasOut = new CoAnMoPluginCli(
      "n",
      "v",
      "",
      ".mock-output-el",
      mockDoc,
      "m",
      mockStorage
    );
    expect(scrollXSpy).toBe(0); // the constructor logs "n v"
    expect(scrollYSpy).toBe(999999);
    scrollXSpy = null;
    scrollYSpy = null;
    expect(scrollXSpy).toBe(null); // we just manually reset the spies
    expect(scrollYSpy).toBe(null);
    expect(hasOut.log("ok\n> 123")).toBe("ok\n> 123");
    expect(scrollXSpy).toBe(0); // log() has called the output element’s scroll()
    expect(scrollYSpy).toBe(999999);
    expect(mockOutputEl.innerHTML).toBe("n v\nm\nok\n<b>> 123</b>");
  });

  beforeEach(() => {
    mockOutputEl.innerHTML = "";
    scrollXSpy = null;
    scrollYSpy = null;
  });
});

describe("run()", () => {
  it("returns the command with no input element", () => {
    const hasOut = new CoAnMoPluginCli(
      "",
      "",
      "",
      ".mock-output-el",
      mockDoc,
      "",
      mockStorage
    );
    expect(hasOut.run("will never be run")).toBe(undefined);
  });

  it("returns and logs '> ' when the command is entirely whitespace", () => {
    const hasInOut = new CoAnMoPluginCli(
      "n",
      "v",
      ".mock-input-el",
      ".mock-output-el",
      mockDoc,
      "m",
      mockStorage
    );
    expect(mockOutputEl.innerHTML).toBe("n v\nm");
    expect(hasInOut.run("")).toBe("> ");
    expect(hasInOut.run(" ")).toBe("> ");
    expect(hasInOut.run("\n\n\t\n")).toBe("> ");
    expect(hasInOut.run("   \n \n\t   \n    ")).toBe("> ");
    expect(mockOutputEl.innerHTML).toBe(`n v\nm${"\n<b>> </b>".repeat(4)}`);
  });

  it("clears the input element’s value", () => {
    const hasIn = new CoAnMoPluginCli(
      "",
      "",
      ".mock-input-el",
      "",
      mockDoc,
      "",
      mockStorage
    );
    mockInputEl.value = "user’s text";
    expect(hasIn.run("nosuch command")).toBe(
      "ERROR: No such action 'nosuch' - try 'help'"
    );
    expect(mockInputEl.value).toBe("");
  });

  it("returns and logs an error when the action is not recognised", () => {
    const hasInOut = new CoAnMoPluginCli(
      "foo",
      "v1",
      ".mock-input-el",
      ".mock-output-el",
      mockDoc,
      "meta",
      mockStorage
    );
    hasInOut.addActions([mockAction]);
    expect(mockOutputEl.innerHTML).toBe("foo v1\nmeta");
    expect(hasInOut.run("  x  123")).toBe(
      "ERROR: No such action 'x' - try 'help'"
    );
    expect(hasInOut.run("mockaction!")).toBe(
      "ERROR: No such action 'mockaction!' - try 'help'"
    );
    expect(mockOutputEl.innerHTML).toBe(
      "foo v1\nmeta\n" +
        "<b>ERROR: No such action 'x' - try 'help'</b>\n" +
        "<b>ERROR: No such action 'mockaction!' - try 'help'</b>"
    );
  });

  it("runs the command when the action is recognised", () => {
    const hasInOut = new CoAnMoPluginCli(
      "N",
      "V",
      ".mock-input-el",
      ".mock-output-el",
      mockDoc,
      "M",
      mockStorage
    );
    hasInOut.addActions([mockAction]);
    expect(mockOutputEl.innerHTML).toBe("N V\nM");
    expect(argsSpy).toEqual([]);
    expect(contextSpy).toEqual({});
    expect(hasInOut.run("  mockaction 123    456")).toBe("mock result");
    expect(argsSpy).toEqual(["123", "456"]);
    expect(contextSpy.$stdout).toBe(mockOutputEl);
    expect(contextSpy.actions).toEqual([mockAction]);
    expect(contextSpy.config).toEqual({});
    expect(contextSpy.doc).toBe(mockDoc);
    expect(contextSpy.name).toBe("N");
    expect(contextSpy.version).toBe("V");
    expect(contextSpy.meta).toBe("M");
    expect(hasInOut.run("MOCKACTION    Arg1 ARG2   ")).toBe("mock result");
    expect(argsSpy).toEqual(["Arg1", "ARG2"]);
    expect(mockOutputEl.innerHTML).toBe(
      "N V\nM\n" +
        "<b>> mockaction 123 456</b>\n" +
        "mock result\n" +
        "<b>> mockaction Arg1 ARG2</b>\n" +
        "mock result"
    );
  });

  it("runs the command when the filter matches the `meta` string", () => {
    const hasInOut = new CoAnMoPluginCli(
      "N",
      "V",
      ".mock-input-el",
      ".mock-output-el",
      mockDoc,
      "MetaString",
      mockStorage
    );
    hasInOut.addActions([mockAction]);
    expect(mockOutputEl.innerHTML).toBe("N V\nMetaString");
    expect(argsSpy).toEqual([]);
    expect(contextSpy).toEqual({});
    expect(hasInOut.run("/metastring/i mockaction foo bar")).toBe(
      "mock result"
    );
    expect(argsSpy).toEqual(["foo", "bar"]);
    expect(contextSpy.$stdout).toBe(mockOutputEl);
    expect(contextSpy.actions).toEqual([mockAction]);
    expect(contextSpy.config).toEqual({});
    expect(contextSpy.doc).toBe(mockDoc);
    expect(contextSpy.name).toBe("N");
    expect(contextSpy.version).toBe("V");
    expect(contextSpy.meta).toBe("MetaString");
    expect(hasInOut.run("/^MetaStr/ mockaction 123")).toBe("mock result");
    expect(argsSpy).toEqual(["123"]);
    expect(mockOutputEl.innerHTML).toBe(
      "N V\nMetaString\n" +
        "<b>> mockaction foo bar</b>\n" +
        "mock result\n" +
        "<b>> mockaction 123</b>\n" +
        "mock result"
    );
  });

  it("ignores the command when the filter does not match the `meta` string", () => {
    const hasInOut = new CoAnMoPluginCli(
      "N",
      "V",
      ".mock-input-el",
      ".mock-output-el",
      mockDoc,
      "MetaString",
      mockStorage
    );
    hasInOut.addActions([mockAction]);
    expect(mockOutputEl.innerHTML).toBe("N V\nMetaString");
    expect(argsSpy).toEqual([]);
    expect(contextSpy).toEqual({});
    expect(hasInOut.run("/metastring/ mockaction foo bar")).toBe(undefined);
    expect(argsSpy).toEqual([]);
    expect(contextSpy).toEqual({});
    expect(hasInOut.run("/metastring-nah/i mockaction foo bar")).toBe(
      undefined
    );
    expect(argsSpy).toEqual([]);
    expect(contextSpy).toEqual({});
    expect(mockOutputEl.innerHTML).toBe("N V\nMetaString");
  });

  beforeEach(() => {
    mockOutputEl.innerHTML = "";
    mockInputEl.value = "";
    argsSpy = [];
    contextSpy = {} as ActionContextI;
  });
});
