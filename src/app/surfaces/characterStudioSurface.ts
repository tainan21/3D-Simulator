import type { AppSurfaceModule } from "../contracts";
import { CharacterStudioController } from "../controllers/characterStudioController";

const surfaceModule: AppSurfaceModule = {
  mount(host, context) {
    const controller = new CharacterStudioController(host, context);
    return controller.mount();
  }
};

export default surfaceModule;
