import express from "express";
import {
	getManager,
	createManager,
	updateManager,
} from "../controllers/managerControllers";

const router = express.Router();

router.route("/:cognitoId").get(getManager).put(updateManager);
router.post("/", createManager);

export default router;
