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

export class CoAnMoPluginCliV1 {
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
    this.log("CoAnMoPluginCliV1()");

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
    const [actionName, ...args] = command.trim().split(/\s+/);
    const actionNameLc = actionName.toLowerCase(); // because, iPad keyboard
    if (actionName === "") {
      this.$stdin.value = "";
      return this.log(">");
    }
    const action = this.actions.find(actn => actn.name === actionNameLc);
    if (!action)
      return this.log(`No such action '${actionNameLc}' - try 'help'`);
    this.log(`> ${actionNameLc} ${args.join(' ')}`);
    this.$stdin.value = "";
    this.log(
      action.fn(args, {
        actions: this.actions,
        name: this.name,
        version: this.version
      })
    );
  }
}
