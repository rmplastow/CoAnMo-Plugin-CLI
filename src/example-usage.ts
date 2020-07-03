import { CoAnMoPluginCliV1 } from "./CoAnMoPluginCliV1";

const cli = new CoAnMoPluginCliV1(
  ".CoAnMoPluginCliV1.stdin",
  ".CoAnMoPluginCliV1.stdout",
  document
);

cli.addActions([
  {
    name: "help",
    fn() {
      return "Here’s a help message";
    }
  },
  {
    name: "version",
    fn() {
      return "ExampleCoAnMo v0.1.2";
    }
  }
]);

cli.focusOnInput();
