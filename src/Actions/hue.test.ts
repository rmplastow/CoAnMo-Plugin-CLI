import { ActionContextI } from "../CoAnMoPluginCli";
import {
  defaultHue,
  getCurrentHue,
  getHueSynopsis,
  hue,
  Hue,
  renderHueAndMeaning,
  stringToHue
} from "./hue";
const { fn } = hue;

// Mocks and spies.

const mockDoc = {
  body: {
    className: "",
    classList: {
      add(name: string): void {
        addSpy = name;
      },
      remove(name: string): void {
        removeSpy = name;
      }
    }
  }
} as Document;

const mockContext: ActionContextI = {
  $stdout: null,
  actions: [],
  doc: mockDoc,
  meta: "Mock-Meta",
  name: "Mock-Hue",
  setStore() {
    return;
  },
  store: {},
  version: "1.2.3"
};

let addSpy: string | null = null;
let removeSpy: string | null = null;

// Private values and functions.

describe("defaultHue", () => {
  it("is 'blue'", () => {
    expect(defaultHue).toBe("blue");
  });
});

describe("getCurrentHue()", () => {
  test("with an empty className it returns the default hue", () => {
    expect(getCurrentHue(mockDoc)).toBe(defaultHue);
  });
  test("with an unrecognised hue className it returns the default hue", () => {
    const mockDocInvalidHue = {
      body: {
        ...mockDoc.body,
        className: "hue-nope"
      }
    } as Document;
    expect(getCurrentHue(mockDocInvalidHue)).toBe(defaultHue);
  });
  test("with a recognised hue className it returns the correct hue", () => {
    const mockDocInvalidHue = {
      body: {
        ...mockDoc.body,
        className: "other classnames hue-magenta another"
      }
    } as Document;
    expect(getCurrentHue(mockDocInvalidHue)).toBe("magenta");
  });
});

describe("getHueSynopsis()", () => {
  it("returns a string", () => {
    expect(typeof getHueSynopsis()).toBe("string");
  });
  it("returns 13 lines", () => {
    expect(getHueSynopsis().split("\n").length).toBe(13);
  });
  it("contains the text ‘The 8 color schemes’", () => {
    expect(getHueSynopsis()).toContain("The 8 color schemes");
  });
});

describe("renderHueAndMeaning()", () => {
  it("returns the expected string, if passed 'cyan'", () => {
    expect(renderHueAndMeaning("cyan", 44)).toBe(
      "  45. cyan ....... Important information"
    );
  });
  it("returns the expected string, if not passed a recognised hue", () => {
    expect(renderHueAndMeaning("this can be any string", 123)).toBe(
      "  124. this can be any string ......... "
    );
  });
});

describe("stringToHue()", () => {
  it("returns `Hue.cyan`, if passed 'cyan'", () => {
    expect(stringToHue("cyan")).toBe(Hue.cyan);
  });
  it("returns `Hue.red`, if passed 'red'", () => {
    expect(stringToHue("red")).toBe(Hue.red);
  });
  it("returns `undefined` if passed an unrecognised hue", () => {
    expect(stringToHue("nope")).toBe(undefined);
  });
});

// Public functions.

describe("hue.fn()", () => {
  it("returns the expected string when passed no arguments", () => {
    expect(fn([], mockContext)).toBe(defaultHue);
  });
  it("returns as expected when passed 'green', and uses classList’s add() and remove()", () => {
    expect(fn(["green"], mockContext)).toBe(`Was ${defaultHue}, now green`);
    expect(removeSpy).toBe(`hue-${defaultHue}`);
    expect(addSpy).toBe("hue-green");
  });
  it("returns an error when passed 'purple'", () => {
    expect(fn(["purple"], mockContext)).toBe(
      "ERROR: 'hue' got unexpected argument 'purple' — try 'green'"
    );
  });
  it("returns an error when passed two arguments", () => {
    expect(fn(["oops", "foobar"], mockContext)).toBe(
      "ERROR: 'hue' expected 0 or 1 args, but got 2"
    );
  });
  beforeEach(() => {
    addSpy = null;
    removeSpy = null;
  });
});
