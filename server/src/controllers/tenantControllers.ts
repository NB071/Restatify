import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { HTTP_STATUS, MESSAGES } from "../constants";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response): Promise<void> => {
	try {
		const { cognitoId } = req.params;
		const tenant = await prisma.tenant.findUnique({
			where: {
				cognitoId,
			},
			include: {
				favorites: true,
			},
		});

		if (tenant) {
			res.status(HTTP_STATUS.OK).json(tenant);
		} else {
			res.status(HTTP_STATUS.NOT_FOUND).json({
				message: MESSAGES.TENANT.TENANT_NOT_FOUND,
			});
		}
	} catch (error: any) {
		res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			message: MESSAGES.TENANT.ERR_RETRIEVING_TENANT.concat(
				" : ",
				error.message
			),
		});
	}
};

export const createTenant = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { cognitoId, name, email, phoneNumber } = req.body;

		const newTenant = await prisma.tenant.create({
			data: {
				cognitoId,
				name,
				email,
				phoneNumber,
			},
		});

		res.status(HTTP_STATUS.CREATED).json(newTenant);
	} catch (error: any) {
		res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			message: MESSAGES.TENANT.ERR_CREATING_TENANT.concat(
				" : ",
				error.message
			),
		});
	}
};

export const updateTenant = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { cognitoId } = req.params;
		const { name, email, phoneNumber } = req.body;

		const updatedTenant = await prisma.tenant.update({
			where: {
				cognitoId,
			},
			data: {
				name,
				email,
				phoneNumber,
			},
		});

		res.status(HTTP_STATUS.OK).json(updatedTenant);
	} catch (error: any) {
		res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			message: MESSAGES.TENANT.ERR_UPDATING_TENANT.concat(
				" : ",
				error.message
			),
		});
	}
};

export const getCurrentResidences = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { cognitoId } = req.params;
		const tenant = await prisma.tenant.findUnique({
			where: {
				cognitoId,
			},
		});

		if (!tenant) {
			res.status(HTTP_STATUS.NOT_FOUND).json({
				message: MESSAGES.TENANT.TENANT_NOT_FOUND,
			});
			return;
		}

		const properties = await prisma.property.findMany({
			where: {
				tenants: { some: { cognitoId } },
			},
			include: { location: true },
		});

		const residencesWithLocation = await Promise.all(
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

		res.status(HTTP_STATUS.OK).json(residencesWithLocation);
	} catch (error: any) {
		res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			message: MESSAGES.TENANT.ERR_RETRIEVING_TENANT_RESIDENCES.concat(
				" : ",
				error.message
			),
		});
	}
};
