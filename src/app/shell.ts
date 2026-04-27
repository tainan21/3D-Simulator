import type { AppRoute, AppShellBindings, SurfaceHandle } from "./contracts";
import { SURFACE_LOADERS, SURFACE_META, SURFACE_META_BY_ROUTE } from "./routes";
import { AppRouter } from "./router";
import { createAppStores } from "./state";
import { createPresetConfig, PerformanceRegistry } from "./performance";

export class AppShell {
  private readonly root: HTMLElement;
  private readonly router = new AppRouter();
  private readonly stores = createAppStores();
  private readonly performance = new PerformanceRegistry();
  private currentHandle?: SurfaceHandle;
  private currentRoute: AppRoute = "/hub";
  private mounted = false;
  private shell?: AppShellBindings;
  private detachRouter?: () => void;
  private detachPerformance?: () => void;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  mount(): void {
    if (this.mounted) return;
    this.mounted = true;
    this.root.innerHTML = this.shellHtml();
    this.shell = {
      root: this.root.querySelector<HTMLElement>("[data-app-shell='root']") ?? this.root,
      nav: this.root.querySelector<HTMLElement>("[data-app-shell='nav']") ?? this.root,
      host: this.root.querySelector<HTMLElement>("[data-app-shell='host']") ?? this.root,
      status: this.root.querySelector<HTMLElement>("[data-app-shell='status']") ?? this.root
    };
    this.shell.nav.addEventListener("click", this.onNavClick);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    this.detachRouter = this.router.attach();
    this.router.subscribe((route) => {
      void this.mountRoute(route);
    });
    this.detachPerformance = this.performance.subscribe((snapshot) => {
      if (!this.shell) return;
      this.shell.status.textContent = `${snapshot.activeSurface} | ${snapshot.fps.toFixed(0)} fps | ${snapshot.frameMs.toFixed(2)} ms | canvas ${snapshot.activeCanvases} | loops ${snapshot.activeLoops}`;
    });
    void this.mountRoute(this.router.getRoute());
  }

  private async mountRoute(route: AppRoute): Promise<void> {
    this.currentRoute = route;
    const meta = SURFACE_META_BY_ROUTE.get(route) ?? SURFACE_META[0];
    this.updateNav(meta.route);
    this.currentHandle?.dispose();
    this.currentHandle = undefined;
    const loader = SURFACE_LOADERS.get(route) ?? SURFACE_LOADERS.get("/" as AppRoute);
    const module = loader ? await loader() : undefined;
    if (!module || !this.shell) return;
    const presetConfig = () => createPresetConfig(this.stores.settingsStore.getState().preset, this.stores.settingsStore.getState().isMobile);
    this.currentHandle = await module.mount(this.shell.host, {
      route,
      surfaceId: meta.id,
      stores: this.stores,
      performance: this.performance,
      shell: this.shell,
      navigate: (nextRoute, options) => this.router.navigate(nextRoute, options),
      getPresetConfig: presetConfig
    });
    this.performance.update({ activeSurface: meta.id });
  }

  private updateNav(activeRoute: AppRoute): void {
    this.root.querySelectorAll<HTMLElement>("[data-route]").forEach((entry) => {
      entry.classList.toggle("active", entry.dataset.route === activeRoute);
    });
  }

  private shellHtml(): string {
    return `
      <div class="app-shell-frame" data-app-shell="root">
        <header class="shell-frame-bar">
          <div class="shell-frame-brand">
            <strong>Rogue Geometric Shell</strong>
            <span>Kernel canonico | boot leve | superficies independentes</span>
          </div>
          <nav class="shell-frame-nav" data-app-shell="nav">
            ${SURFACE_META.map((meta) => `<a href="${meta.route}" data-route="${meta.route}" title="${meta.description}">${meta.shortTitle}</a>`).join("")}
          </nav>
          <div class="shell-frame-status" data-app-shell="status"></div>
        </header>
        <main class="shell-frame-main" data-app-shell="host"></main>
      </div>
    `;
  }

  private readonly onNavClick = (event: MouseEvent): void => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-route]");
    if (!target) return;
    event.preventDefault();
    this.router.navigate(target.dataset.route as AppRoute);
  };

  private readonly onVisibilityChange = (): void => {
    if (!this.currentHandle) return;
    if (document.visibilityState === "hidden") {
      this.currentHandle.pause?.();
      return;
    }
    this.currentHandle.resume?.();
  };
}
