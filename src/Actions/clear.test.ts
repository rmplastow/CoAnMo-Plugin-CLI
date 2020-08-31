import { ActionContextI } from "../CoAnMoPluginCli";
import { clear } from "./clear";
const { fn } = clear;

const mockContext: ActionContextI = {
  $stdout: {
    innerHTML: "Some previous content"
  } as HTMLElement,
  actions: [],
  doc: {} as Document,
  log: () => "Mock-Log",
  meta: "Mock-Meta",
  name: "Mock-Clear",
  setStore() {
    return;
  },
  store: {},
  version: "1.2.3"
};

describe("clear.fn()", () => {
  it("returns an empty string when passed no arguments", () => {
    expect(fn([], mockContext)).toBe("");
  });
  it("changes `$stdout.innerHTML` to an empty string when passed no arguments", () => {
    expect(mockContext.$stdout && mockContext.$stdout.innerHTML).toBe(
      "Some previous content"
    );
    fn([], mockContext);
    expect(mockContext.$stdout && mockContext.$stdout.innerHTML).toBe("");
  });
  it("returns an error when passed one argument", () => {
    expect(fn(["oops", "oops", "oops"], mockContext)).toBe(
      "ERROR: 'clear' expected 0 args, but got 3"
    );
  });
  beforeEach(() => {
    mockContext.$stdout = {
      innerHTML: "Some previous content"
    } as HTMLElement;
  });
});
