export interface Action {
  name: string;
  fn: () => string;
}

export class CoAnMoPluginCliV1 {
  private $stdin: HTMLInputElement | null;
  private $stdout: HTMLElement | null;
  private actions: Action[] = [];

  constructor(
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

  addActions(actions: Action[]) {
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
    const [actionName, ...args] = command.split(" ").map(part => part.trim());
    const action = this.actions.find(actn => actn.name === actionName);
    if (!action) return this.log(`> No such action '${actionName}'`);
    this.log(`> ${this.$stdin.value}`);
    this.$stdin.value = "";
    this.log(action.fn());
  }
}
