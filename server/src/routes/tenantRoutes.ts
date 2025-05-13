import express from "express";
import {
	getTenant,
	createTenant,
	updateTenant,
	getCurrentResidences,
} from "../controllers/tenantControllers";

const router = express.Router();

router.route("/:cognitoId").get(getTenant).put(updateTenant);
router.post("/", createTenant);
router.get("/:cognitoId/currect-residences", getCurrentResidences);

export default router;
