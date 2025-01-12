import { Router } from "express";

import * as membersController from "./member.controller";

const memberRouter = Router();

memberRouter.delete("/:memberId", membersController.deleteMember);
memberRouter.patch("/:memberId", membersController.updateMemberRole);

export { memberRouter };
