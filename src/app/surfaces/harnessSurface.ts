import type { AppSurfaceModule } from "../contracts";
import { HarnessSurfaceController } from "../controllers/harnessController";

const surfaceModule: AppSurfaceModule = {
  mount(host, context) {
    const controller = new HarnessSurfaceController(host, context);
    return controller.mount();
  }
};

export default surfaceModule;
