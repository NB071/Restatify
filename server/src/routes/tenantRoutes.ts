import express from "express";
import {
	getTenant,
	createTenant,
	updateTenant,
} from "../controllers/tenantControllers";

const router = express.Router();

router.route("/:cognitoId").get(getTenant).put(updateTenant);
router.post("/", createTenant);

export default router;
