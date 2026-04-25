import { normalizeRoute } from "./routes";
import type { AppRoute } from "./contracts";

type RouteListener = (route: AppRoute) => void;

export class AppRouter {
  private readonly listeners = new Set<RouteListener>();

  getRoute(): AppRoute {
    return normalizeRoute(window.location.pathname);
  }

  subscribe(listener: RouteListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  navigate(route: AppRoute, options: { replace?: boolean } = {}): void {
    if (route === this.getRoute()) {
      this.emit(route);
      return;
    }
    if (options.replace) {
      window.history.replaceState({}, "", route);
    } else {
      window.history.pushState({}, "", route);
    }
    this.emit(route);
  }

  attach(): () => void {
    const onPopState = () => this.emit(this.getRoute());
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }

  private emit(route: AppRoute): void {
    this.listeners.forEach((listener) => listener(route));
  }
}
