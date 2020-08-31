import { ActionContextI } from "../CoAnMoPluginCli";
import { indefiniteArticleType, store } from "./store";
const { fn } = store;

// Mocks and spies.

const mockContext: ActionContextI = {
  $stdout: null,
  actions: [],
  doc: {} as Document,
  log: () => "Mock-Log",
  meta: "MockMeta",
  name: "Mock-Store",
  setStore(newStore: { [key: string]: boolean | number | string }) {
    setStoreSpy = newStore;
    return;
  },
  store: { mockStore: 123 },
  version: "1.2.3"
};

let setStoreSpy: { [key: string]: boolean | number | string } | null = null;

// Private functions.

describe("indefiniteArticleType", () => {
  test("boolean, number and string literals", () => {
    expect(indefiniteArticleType(true)).toBe("a boolean");
    expect(indefiniteArticleType(false)).toBe("a boolean");
    expect(indefiniteArticleType(123)).toBe("a number");
    expect(indefiniteArticleType(-Infinity)).toBe("a number");
    expect(indefiniteArticleType(NaN)).toBe("a number");
    expect(indefiniteArticleType("")).toBe("a string");
    expect(indefiniteArticleType("foo\nbar")).toBe("a string");
  });
  test("null and undefined", () => {
    expect(indefiniteArticleType(null)).toBe("null");
    expect(indefiniteArticleType(undefined)).toBe("undefined");
    expect(indefiniteArticleType(void 0)).toBe("undefined");
  });
  test("array and object literals", () => {
    expect(indefiniteArticleType([])).toBe("an array");
    expect(indefiniteArticleType([1, 2, 3])).toBe("an array");
    expect(indefiniteArticleType({})).toBe("an object");
    expect(indefiniteArticleType({ a: 1 })).toBe("an object");
  });
  test("built in objects and RegExp literals", () => {
    expect(indefiniteArticleType(Math)).toBe("an object");
    expect(indefiniteArticleType(new Error())).toBe("an object");
    expect(indefiniteArticleType(new Boolean(true))).toBe("an object"); // eslint-disable-line
    expect(indefiniteArticleType(/abc/i)).toBe("an object");
  });
  test("symbols and functions", () => {
    expect(indefiniteArticleType(Symbol())).toBe("a symbol");
    expect(indefiniteArticleType(Symbol("foo"))).toBe("a symbol");
    expect(indefiniteArticleType(Symbol.iterator)).toBe("a symbol");
    expect(indefiniteArticleType(function() {})).toBe("a function");
    expect(indefiniteArticleType((_: 1) => _)).toBe("a function");
  });
});

// Public functions.

describe("store.fn()", () => {
  it("returns the mock object, stringified, when passed no arguments", () => {
    expect(fn([], mockContext)).toBe('{\n  "mockStore": 123\n}');
  });
  it("returns an error if not passed a stringified object", () => {
    const err1 = "ERROR: 'store' expects a JSON object, not";
    expect(fn(["[1,2,3]"], mockContext)).toBe(`${err1} an array`);
    expect(fn(["true"], mockContext)).toBe(`${err1} a boolean`);
    expect(fn(["123"], mockContext)).toBe(`${err1} a number`);
    expect(fn(["null"], mockContext)).toBe(`${err1} null`);
    const err2 = "ERROR: Cannot parse 'CoAnMoPluginCli.store':";
    expect(fn(["/abc/g"], mockContext)).toContain(err2);
    expect(fn(["undefined"], mockContext)).toContain(err2);
    expect(fn(["Math"], mockContext)).toContain(err2);
  });
  it("returns an error if passed an invalid stringified object", () => {
    const err2 = "ERROR: Cannot parse 'CoAnMoPluginCli.store':";
    expect(fn(["{nope:1}"], mockContext)).toContain(err2);
    expect(fn(['{"nope:2}'], mockContext)).toContain(err2);
    expect(fn(['{"nope":Math}'], mockContext)).toContain(err2);
    expect(fn(['{"nope":"no}'], mockContext)).toContain(err2);
    expect(fn(['{"nope":[1}'], mockContext)).toContain(err2);
  });
  it("returns an error if a value is not a boolean, number or string", () => {
    const err3 =
      "ERROR: 'store' expects all values to be booleans, numbers and strings:\n  ";
    expect(fn(['{"nope":null}'], mockContext)).toContain(
      `${err3}'nope' is null`
    );
    expect(fn(['{"foo":1,"no":[]}'], mockContext)).toContain(
      `${err3}'no' is an array`
    );
    expect(fn(['{"obj":{},"foo":1e2,"no":[]}'], mockContext)).toContain(
      `${err3}'obj' is an object\n  'no' is an array`
    );
  });
  it("returns an error if a value is not a boolean, number or string", () => {
    const err3 =
      "ERROR: 'store' expects all values to be booleans, numbers and strings:\n  ";
    expect(fn(['{"nope":null}'], mockContext)).toContain(
      `${err3}'nope' is null`
    );
    expect(fn(['{"foo":1,"no":[]}'], mockContext)).toContain(
      `${err3}'no' is an array`
    );
    expect(setStoreSpy).toEqual(null);
    expect(fn(['{"obj":{},"foo":1e2,"no":[]}'], mockContext)).toContain(
      `${err3}'obj' is an object\n  'no' is an array`
    );
    expect(setStoreSpy).toEqual(null); // was not called
  });
  it("calls setStore() and returns a success message if the command is valid", () => {
    const ok1 = "stored an object containing";
    expect(setStoreSpy).toEqual(null);
    expect(fn(['{"foo":1}'], mockContext)).toContain(`${ok1} 1 value`);
    expect(setStoreSpy).toEqual({ foo: 1 });
    expect(fn(['{ "a":"a A", "b":true }'], mockContext)).toContain(
      `${ok1} 2 values`
    );
    expect(setStoreSpy).toEqual({ a: "a A", b: true });
    expect(fn(["{}"], mockContext)).toContain(`${ok1} 0 values`);
    expect(setStoreSpy).toEqual({});
  });
});
