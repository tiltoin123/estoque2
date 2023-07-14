import express from "express";
import isAuth from "../middleware/isAuth";

import * as TemplatesController from "../controllers/TemplateController";

const templateRoutes = express.Router();

templateRoutes.get("/templates", isAuth, TemplatesController.index);

templateRoutes.get(
    "/templates/:templateId",
    isAuth,
    TemplatesController.show
);

export default templateRoutes;
