"use client";

import { useGetAuthUserQuery } from "@/state/api";
import React from "react";

const TenantSettings = () => {
	const { data: authUser, isLoading: isAuthLoading } = useGetAuthUserQuery();

	if (isAuthLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="loader"> Loading...</div>
			</div>
		);
	}

	const initialData = {
		name: authUser?.userInfo.name,
		email: authUser?.userInfo.email,
		phoneNumber: authUser?.userInfo.phoneNumber,
	};

	return <div>TenantSettings</div>;
};

export default TenantSettings;
