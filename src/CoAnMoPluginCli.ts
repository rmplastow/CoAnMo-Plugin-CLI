import "./CoAnMoPluginCli.css";

export interface ActionMetaI {
  actions: ActionI[];
  name: string;
  version: string;
}

export interface ActionI {
  name: string;
  summary: string;
  fn: (args: string[], meta: ActionMetaI) => string;
}

export class CoAnMoPluginCli {
  private $stdin: HTMLInputElement | null;
  private $stdout: HTMLElement | null;
  private actions: ActionI[] = [];

  constructor(
    private name: string,
    private version: string,
    stdinSelector: string,
    stdoutSelector: string,
    doc: HTMLDocument
  ) {
    this.$stdin = doc.querySelector(stdinSelector);
    this.$stdout = doc.querySelector(stdoutSelector);
    this.log(`${name} ${version}`);

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

  log(message: string) {
    if (!this.$stdout) return;
    this.$stdout.innerHTML += `\n${message}`;
    this.$stdout.scroll(0, 999999);
  }

  run(command: string) {
    if (!this.$stdin) return;
    this.$stdin.value = "";
    const [actionName, ...args] = command.trim().split(/\s+/);
    const actionNameLc = actionName.toLowerCase(); // because, iPad keyboard
    if (actionName === "") return this.log(">");
    const action = this.actions.find(actn => actn.name === actionNameLc);
    if (!action)
      return this.log(`ERROR: No such action '${actionNameLc}' - try 'help'`);
    this.log(`> ${actionNameLc} ${args.join(' ')}`);
    this.log(
      action.fn(args, {
        actions: this.actions,
        name: this.name,
        version: this.version
      })
    );
  }
}
