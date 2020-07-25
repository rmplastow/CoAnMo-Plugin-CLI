import { ActionContextI } from "../CoAnMoPluginCli";
import { renderNameAndSummary, help } from "./help";
const { fn } = help;

// Mocks.

const mockAction = {
  name: "mockaction",
  summary: "Summary of the mock action",
  synopsis: "Synopsis of the mock action",
  fn: (args: string[], context: ActionContextI) => "mock result"
};

const mockContext: ActionContextI = {
  $stdout: null,
  actions: [mockAction],
  doc: {} as Document,
  name: "Mock-Help",
  version: "1.2.3"
};

// Private functions.

describe("renderHueAndMeaning()", () => {
  it("returns the expected string, if passed a mock action", () => {
    expect(renderNameAndSummary(mockAction, 40)).toBe(
      "mockaction .. Summary of the mock action"
    );
  });
  it("returns an overlong string if the `length` argument is reduced", () => {
    expect(renderNameAndSummary(mockAction, 20)).toBe(
      "mockaction  Summary of the mock action"
    );
  });
  it("returns more dots in the string if the `length` argument is increased", () => {
    expect(renderNameAndSummary(mockAction, 50)).toBe(
      "mockaction ............ Summary of the mock action"
    );
  });
});

// Public functions.

describe("help.fn()", () => {
  it("returns the expected string when passed no arguments", () => {
    expect(fn([], mockContext)).toBe(
      "mockaction .. Summary of the mock action\n" +
        "Use `help &lt;action>` to show an action’s synopsis, eg `help mockaction`"
    );
  });
  it("returns as expected when passed 'mockaction'", () => {
    expect(fn(["mockaction"], mockContext)).toBe(`Synopsis of the mock action`);
  });
  it("returns an error when passed 'NoSuchAction'", () => {
    expect(fn(["NoSuchAction"], mockContext)).toBe(
      "ERROR: No such action 'nosuchaction'" // note, lowercase
    );
  });
  it("returns an error when passed two arguments", () => {
    expect(fn(["oops", "foobar"], mockContext)).toBe(
      "ERROR: 'help' expected 0 or 1 args, but got 2"
    );
  });
});
