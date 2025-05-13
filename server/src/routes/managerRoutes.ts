import express from "express";
import {
	getManager,
	createManager,
	updateManager,
	getManagerProperties,
} from "../controllers/managerControllers";

const router = express.Router();

router.route("/:cognitoId").get(getManager).put(updateManager);
router.get("/:cognitoId/properties", getManagerProperties);
router.post("/", createManager);

export default router;
