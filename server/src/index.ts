import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import chalk from "chalk";
import boxen from "boxen";
import { authMiddleware } from "./middleware/authMiddleware";

// ROUTE IMPORTS
import tenantRoutes from "./routes/tenantRoutes";
import managerRoutes from "./routes/managerRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import { ROLES } from "./constants";

// CONFIGS
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("common"));
app.use(cors());

// ROUTES
app.get("/", (req, res) => {
	res.send("This is home route");
});

app.use("/properties", propertyRoutes);
app.use("/tenants", authMiddleware([ROLES.TENANT]), tenantRoutes);
app.use("/managers", authMiddleware([ROLES.MANAGER]), managerRoutes);

// SERVER
const port = process.env.PORT || 3002;

const message =
	chalk.green.bold(`🚀 Server is live at:`) +
	"\n" +
	chalk.cyan(`👉 http://localhost:${port}`);

app.listen(port, () => {
	console.log(
		boxen(message, {
			padding: 1,
			margin: 1,
			borderStyle: "round",
			borderColor: "green",
		})
	);
});
