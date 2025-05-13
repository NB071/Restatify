import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { HTTP_STATUS, MESSAGES } from "../constants";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export const getManager = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { cognitoId } = req.params;
		const manager = await prisma.manager.findUnique({
			where: {
				cognitoId,
			},
		});

		if (manager) {
			res.status(HTTP_STATUS.OK).json(manager);
		} else {
			res.status(HTTP_STATUS.NOT_FOUND).json({
				message: MESSAGES.MANAGER.MANAGER_NOT_FOUND,
			});
		}
	} catch (error: any) {
		res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			message: MESSAGES.MANAGER.ERR_RETRIEVING_MANAGER.concat(
				" : ",
				error.message
			),
		});
	}
};

export const createManager = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { cognitoId, name, email, phoneNumber } = req.body;

		const newManager = await prisma.manager.create({
			data: {
				cognitoId,
				name,
				email,
				phoneNumber,
			},
		});

		res.status(HTTP_STATUS.CREATED).json(newManager);
	} catch (error: any) {
		res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			message: MESSAGES.MANAGER.ERR_CREATING_MANAGER.concat(
				" : ",
				error.message
			),
		});
	}
};

export const updateManager = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { cognitoId } = req.params;
		const { name, email, phoneNumber } = req.body;

		const updatedManager = await prisma.manager.update({
			where: {
				cognitoId,
			},
			data: {
				name,
				email,
				phoneNumber,
			},
		});

		res.status(HTTP_STATUS.OK).json(updatedManager);
	} catch (error: any) {
		res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			message: MESSAGES.MANAGER.ERR_UPDATING_MANAGER.concat(
				" : ",
				error.message
			),
		});
	}
};

export const getManagerProperties = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { cognitoId } = req.params;
		const manager = await prisma.manager.findUnique({
			where: {
				cognitoId,
			},
		});

		if (!manager) {
			res.status(HTTP_STATUS.NOT_FOUND).json({
				message: MESSAGES.MANAGER.MANAGER_NOT_FOUND,
			});
			return;
		}

		const properties = await prisma.property.findMany({
			where: {
				managerCognitoId: cognitoId,
			},
			include: { location: true },
		});

		const propertiesWithLocation = await Promise.all(
			properties.map(async (property) => {
				const coordinates: { coordinates: string }[] =
					await prisma.$queryRaw`
					SELECT ST_asText(coordinates) AS coordinates 
					FROM "Location"
					WHERE id = ${property.location.id}
				`;

				const geoJSON: any = wktToGeoJSON(
					coordinates[0]?.coordinates || ""
				);
				const longitude = geoJSON.coordinates[0];
				const latitude = geoJSON.coordinates[1];

				return {
					...property,
					location: {
						...property.location,
						coordinates: {
							longitude,
							latitude,
						},
					},
				};
			})
		);

		res.status(HTTP_STATUS.OK).json(propertiesWithLocation);
	} catch (error: any) {
		res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			message: MESSAGES.MANAGER.ERR_RETRIEVING_MANAGER_PROPERTIES.concat(
				" : ",
				error.message
			),
		});
	}
};
