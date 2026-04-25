import type { AppSurfaceModule } from "../contracts";
import { PhasesSurfaceController } from "../controllers/phasesController";

const surfaceModule: AppSurfaceModule = {
  mount(host, context) {
    const controller = new PhasesSurfaceController(host, context);
    return controller.mount();
  }
};

export default surfaceModule;
