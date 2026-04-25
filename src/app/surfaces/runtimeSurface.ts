import type { AppSurfaceModule } from "../contracts";
import { RuntimeSurfaceController } from "../controllers/runtimeController";

const surfaceModule: AppSurfaceModule = {
  mount(host, context) {
    const controller = new RuntimeSurfaceController(host, context);
    return controller.mount();
  }
};

export default surfaceModule;
