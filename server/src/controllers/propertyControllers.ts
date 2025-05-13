import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";
import { HTTP_STATUS, MESSAGES } from "../constants";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Location } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
const s3Client = new S3Client({
	region: process.env.AWS_REGION!,
});

export const getProperties = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const {
			favoriteIds,
			priceMin,
			priceMax,
			beds,
			baths,
			propertyType,
			squareFeetMin,
			squareFeetMax,
			amenities,
			availableFrom,
			latitude,
			longitude,
		} = req.query;

		// ===== build filters =====
		let whereConditions: Prisma.Sql[] = [];

		if (favoriteIds) {
			const favoriteIdsArray = (favoriteIds as string)
				.split(",")
				.map((id) => Number(id.trim()));
			whereConditions.push(
				Prisma.sql`p.id IN (${Prisma.join(favoriteIdsArray)})`
			);
		}

		if (priceMin) {
			whereConditions.push(
				Prisma.sql`p."pricePerMonth" >= ${Number(priceMin)}`
			);
		}

		if (priceMax) {
			whereConditions.push(
				Prisma.sql`p."pricePerMonth" <= ${Number(priceMax)}`
			);
		}

		if (squareFeetMin) {
			whereConditions.push(
				Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`
			);
		}

		if (squareFeetMax) {
			whereConditions.push(
				Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`
			);
		}

		if (beds && beds !== "any") {
			whereConditions.push(Prisma.sql`p.beds >= ${Number(beds)}`);
		}

		if (baths && baths !== "any") {
			whereConditions.push(Prisma.sql`p.baths >= ${Number(baths)}`);
		}

		if (propertyType && propertyType !== "any") {
			whereConditions.push(
				Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"`
			);
		}

		if (amenities && amenities !== "any") {
			const amenitiesArray = (amenities as string)
				.split(",")
				.map((amenity) => amenity.trim());
			whereConditions.push(Prisma.sql`p.amenities @> ${amenitiesArray}`);
		}

		if (availableFrom && availableFrom !== "any") {
			const availFromDate =
				typeof availableFrom === "string" ? availableFrom : null;
			if (availFromDate) {
				const date = new Date(availFromDate);
				if (!isNaN(date.getTime())) {
					whereConditions.push(
						Prisma.sql`EXISTS (
                            SELECT 1 FROM "Lease" l 
                            WHERE l."propertyId" = p.id 
                            AND l."startDate" <= ${date.toISOString()}
                            )`
					);
				}
			}
		}

		// ===== location filtering via postgis =====
		if (latitude && longitude) {
			const lat = parseFloat(latitude as string);
			const lng = parseFloat(longitude as string);
			const radiusInKilometers = 1000;
			const deg = radiusInKilometers / 111.32;

			whereConditions.push(
				Prisma.sql`ST_DWithin(
                    l.coordinates::geometry,
                    ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
                    ${deg}
                )`
			);
		}

		// ===== assemble complete query =====
		const completeQuery = Prisma.sql`
            SELECT p.*,
            json_build_object(
                'id', l.id,
                'address', l.address,
                'city', l.city,
                'state', l.state,
                'country', l.country,
                'postalCode', l."postalCode",
                'coordinates', json_build_object(
                    'longitude', ST_X(l."coordinates"::geometry),
                    'latitude', ST_Y(l."coordinates"::geometry)
                )
            ) AS location,
            FROM "Property" p
            JOIN "Location" l ON p."locationId" = l.id
            ${
				whereConditions.length > 0
					? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
					: Prisma.empty
			}
        `;
		// ===== execute/return query =====
		const properties = await prisma.$queryRaw(completeQuery);
		res.status(HTTP_STATUS.OK).json(properties);
	} catch (error: any) {
		res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			message: MESSAGES.PROPERTY.ERR_RETRIEVING_PROPERTIES.concat(
				" : ",
				error.message
			),
		});
	}
};

export const getProperty = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const property = await prisma.property.findUnique({
			where: {
				id: Number(id),
			},
			include: {
				location: true,
			},
		});

		if (property) {
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

			const propertyWithCoordinates = {
				...property,
				location: {
					...property.location,
					coordinates: {
						longitude,
						latitude,
					},
				},
			};
			res.status(HTTP_STATUS.OK).json(propertyWithCoordinates);
		}
	} catch (error: any) {
		res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			message: MESSAGES.PROPERTY.ERR_RETRIEVING_PROPERTY.concat(
				" : ",
				error.message
			),
		});
	}
};

export const createProperty = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const files = req.files as Express.Multer.File[];
		const {
			address,
			city,
			state,
			country,
			postalCode,
			managerCognitoId,
			...propertyData
		} = req.body;

		const photoUrls = await Promise.all(
			files.map(async (file) => {
				const uploadParams = {
					Bucket: process.env.S3_BUCKET_NAME!,
					Key: `properties/${Date.now()}-${file.originalname}`,
					Body: file.buffer,
					ContentType: file.mimetype,
				};

				const uploadResult = await new Upload({
					client: s3Client,
					params: uploadParams,
				}).done();

				return uploadResult.Location;
			})
		);

		const geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
			{
				street: address,
				city,
				country,
				postalcode: postalCode,
				format: "json",
				limit: "1",
			}
		).toString()}`;

		// convert to lat/lng via nominatim api
		const geocodingRes = await axios.get(geocodingUrl, {
			headers: {
				"User-Agent": "Rstatify App",
			},
		});

		const [latitude, longitude] =
			geocodingRes.data[0]?.lat && geocodingRes.data[0]?.lon
				? [
						parseFloat(geocodingRes.data[0].lat),
						parseFloat(geocodingRes.data[0].lon),
				  ]
				: [0, 0];

		// build location query
		const [location] = await prisma.$queryRaw<Location[]>`
      		INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
      		VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))
      		RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;`;

		// build property query
		const newProperty = await prisma.property.create({
			data: {
				...propertyData,
				photoUrls,
				locationId: location.id,
				managerCognitoId,
				amenities:
					typeof propertyData.amenities === "string"
						? propertyData.amenities.split(",")
						: [],
				highlights:
					typeof propertyData.highlights === "string"
						? propertyData.highlights.split(",")
						: [],
				isPetAllowed: propertyData.isPetAllowed === "true",
				isParkingIncluded: propertyData.isParkingIncluded === "true",
				pricePerMonth: parseFloat(propertyData.pricePerMonth),
				securityDeposit: parseFloat(propertyData.securityDeposit),
				applicationFee: parseFloat(propertyData.applicationFee),
				beds: parseInt(propertyData.beds),
				baths: parseFloat(propertyData.baths),
				squareFeet: parseInt(propertyData.squareFeet),
			},
			include: {
				location: true,
				manager: true,
			},
		});

		res.status(HTTP_STATUS.CREATED).json(newProperty);
	} catch (error: any) {
		res.status(HTTP_STATUS.CREATED).json({
			message: MESSAGES.PROPERTY.ERR_CREATING_PROPERTY.concat(
				" : ",
				error.message
			),
		});
	}
};
