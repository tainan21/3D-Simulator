import type { AppSurfaceModule } from "../contracts";
import { CharacterForgeController } from "../controllers/characterForgeController";

const surfaceModule: AppSurfaceModule = {
  mount(host, context) {
    const controller = new CharacterForgeController(host, context);
    return controller.mount();
  }
};

export default surfaceModule;
