import "./CoAnMoPluginCli.css";

// Re-export some generally useful actions.
export { actions as CoAnMoPluginCliActions } from './Actions/actions'

export interface ActionContextI {
  $stdout: HTMLElement | null;
  actions: ActionI[];
  doc: Document;
  name: string;
  version: string;
}

export interface ActionI {
  name: string;
  summary: string;
  synopsis: string;
  fn: (args: string[], context: ActionContextI) => string;
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
    private doc: HTMLDocument
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
    const currentHtml = this.$stdout.innerHTML;
    let newHtml;
    if (currentHtml.trim() === '')
      newHtml = message;
    else
      newHtml = currentHtml + `\n${message}`;
    newHtml = newHtml.split('\n').map( (line:string): string => {
      return (
        '>' === line.substr(0, 1) || 'ERROR: ' === line.substr(0, 7)
      ) ? `<b>${line}</b>` : line;
    }).join('\n')
    this.$stdout.innerHTML = newHtml;
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
        $stdout: this.$stdout,
        actions: this.actions,
        doc: this.doc,
        name: this.name,
        version: this.version
      })
    );
  }
}
