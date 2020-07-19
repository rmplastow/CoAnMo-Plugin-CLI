import "./example-usage.css";
import { name, version } from "../package.json";
import { CoAnMoPluginCli } from "./CoAnMoPluginCli";
import { actions } from "./Actions/actions";

const cli = new CoAnMoPluginCli(name, version, ".stdin", ".stdout", document);

cli.addActions(actions);
cli.focusOnInput();
