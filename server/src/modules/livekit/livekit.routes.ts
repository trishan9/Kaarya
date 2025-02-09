import { Router } from "express";

import * as livekitControllers from "./livekit.controller";

const livekitRouter = Router();

livekitRouter.get("/", livekitControllers.getToken);

export { livekitRouter };
