import { Manager, Tenant } from "@/types/prismaTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export const api = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
		prepareHeaders: async (headers) => {
			const session = await fetchAuthSession();
			const idToken = session?.tokens ?? {};

			if (idToken) {
				headers.set("Authorization", `Bearer ${idToken}`);
			}
			return headers;
		},
	}),
	reducerPath: "api",
	tagTypes: [],
	endpoints: (build) => ({
		getAuthUser: build.query<User, void>({
			queryFn: async (_, _queryApi, _extraOpt, fetchBaseQ) => {
				try {
					const session = await fetchAuthSession();
					const user = await getCurrentUser();
					const { idToken } = session.tokens ?? {};
					const userRole = idToken?.payload["custom:role"] as string;

					const endpoint =
						userRole === "manager"
							? `/managers/${user.userId}`
							: `/tenants/${user.userId}`;

					let userDetailsRes = await fetchBaseQ(endpoint);

					// TODO: not user exists

					return {
						data: {
							cognitoInfo: { ...user },
							userInfo: userDetailsRes.data as Tenant | Manager,
							userRole,
						},
					};
				} catch (e: any) {
					return { error: e.message || "Error fetching user data" };
				}
			},
		}),
	}),
});

export const {} = api;
