import { AppShell } from "./shell";

export type GeometricUniverseAppOptions = Readonly<Record<string, never>>;

// Legacy compatibility shim. The application now boots through AppShell.
export class GeometricUniverseApp {
  private readonly shell: AppShell;

  constructor(root: HTMLElement, _options: GeometricUniverseAppOptions = {}) {
    this.shell = new AppShell(root);
  }

  mount(): void {
    this.shell.mount();
  }
}
