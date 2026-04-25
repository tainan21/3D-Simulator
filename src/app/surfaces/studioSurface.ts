import type { AppSurfaceModule } from "../contracts";
import { StudioSurfaceController } from "../controllers/studioController";

const surfaceModule: AppSurfaceModule = {
  mount(host, context) {
    const controller = new StudioSurfaceController(host, context);
    return controller.mount();
  }
};

export default surfaceModule;
