import "./CoAnMoPluginCli.css";

// Re-export some generally useful actions.
export { actions as CoAnMoPluginCliActions } from "./Actions/actions";

export interface ActionContextI {
  $stdout: HTMLElement | null;
  actions: ActionI[];
  doc: Document;
  meta: string;
  name: string;
  setStore: (newStore: { [key: string]: string }) => void;
  store: { [key: string]: string };
  version: string;
}

export interface ActionI {
  name: string;
  summary: string;
  synopsis: string;
  fn: (args: string[], context: ActionContextI) => string;
}

export interface ParsedCommandI {
  actionName: string;
  args: string[];
  filter: RegExp;
}

export function parseCommand(command: string): ParsedCommandI {
  const parts = command.trim().split(/\s+/);
  const matches = parts[0].match(/^\/(.+)\/([igm]*)$/);
  return matches
    ? {
        actionName: parts[1].toLowerCase(), // because, iPad keyboard
        args: parts.slice(2),
        filter: RegExp(matches[1], matches[2])
      }
    : {
        actionName: parts[0].toLowerCase(),
        args: parts.slice(1),
        filter: /^.?/ // matches everything
      };
}

export class CoAnMoPluginCli {
  private $stdin: HTMLInputElement | null;
  private $stdout: HTMLElement | null;
  private actions: ActionI[] = [];
  private store: { [key: string]: string } = {};

  constructor(
    private name: string,
    private version: string,
    stdinSelector: string,
    stdoutSelector: string,
    private doc: HTMLDocument,
    private meta: string,
    private storage: Storage
  ) {
    this.$stdin = doc.querySelector(stdinSelector);
    this.$stdout = doc.querySelector(stdoutSelector);
    this.log(`${name} ${version}`);
    this.log(`${meta}`);

    const storeRaw = this.storage.getItem("CoAnMoPluginCli.store");
    if (storeRaw) {
      let store;
      try {
        store = JSON.parse(storeRaw);
        if (typeof store !== "object" || store === null)
          this.log(`ERROR: 'CoAnMoPluginCli.store' is not an object`);
        // @TODO check that all values are strings
      } catch (err) {
        this.log(`ERROR: Cannot parse 'CoAnMoPluginCli.store':\n  ${err}`);
      }
      this.store = store;
    }

    if (this.$stdin)
      this.$stdin.addEventListener("keydown", (evt: KeyboardEvent) => {
        if (this.$stdin && evt.key === "Enter") this.run(this.$stdin.value);
      });
  }

  addActions(actions: ActionI[]) {
    actions.forEach(action => this.actions.push(action));
  }

  focusOnInput() {
    if (this.$stdin) this.$stdin.focus();
  }

  log(message: string): string {
    if (!this.$stdout) return message;
    const currentHtml = this.$stdout.innerHTML;
    let newHtml;
    if (currentHtml.trim() === "") newHtml = message;
    else newHtml = currentHtml + `\n${message}`;
    newHtml = newHtml
      .split("\n")
      .map(
        (line: string): string => {
          return "> " === line.substr(0, 2) || "ERROR: " === line.substr(0, 7)
            ? `<b>${line}</b>`
            : line;
        }
      )
      .join("\n");
    this.$stdout.innerHTML = newHtml;
    this.$stdout.scroll(0, 999999);
    return message;
  }

  run(command: string): string | void {
    if (!this.$stdin) return;
    this.$stdin.value = "";
    const { actionName, args, filter } = parseCommand(command);
    if (actionName === "") return this.log("> ");
    if (!filter.test(this.meta)) return;
    const action = this.actions.find(actn => actn.name === actionName);
    if (!action)
      return this.log(`ERROR: No such action '${actionName}' - try 'help'`);
    this.log(`> ${actionName} ${args.join(" ")}`);
    return this.log(
      action.fn(args, {
        $stdout: this.$stdout,
        actions: this.actions,
        doc: this.doc,
        meta: this.meta,
        name: this.name,
        setStore: (newStore: { [key: string]: string }) => {
          this.storage.setItem(
            "CoAnMoPluginCli.store",
            JSON.stringify(newStore)
          );
          this.store = newStore;
        },
        store: this.store,
        version: this.version
      })
    );
  }
}
