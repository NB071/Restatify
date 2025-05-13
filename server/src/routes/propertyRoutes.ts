import express from "express";
import {
	getProperties,
	createProperty,
	getProperty,
} from "../controllers/propertyControllers";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware";
import { ROLES } from "../constants";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router
	.route("/")
	.get(getProperties)
	.post(
		authMiddleware([ROLES.MANAGER]),
		upload.array("photos"),
		createProperty
	);
router.get("/:id", getProperty);

export default router;
