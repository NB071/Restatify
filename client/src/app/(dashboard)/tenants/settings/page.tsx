"use client";

import SettingsForm from "@/components/SettingsForm";
import {
	useGetAuthUserQuery,
	useUpdateTenantSettingsMutation,
} from "@/state/api";
import React from "react";

const TenantSettings = () => {
	const { data: authUser, isLoading: isAuthLoading } = useGetAuthUserQuery();
	const [updateTenant] = useUpdateTenantSettingsMutation();

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

	const handleSubmit = async (data: typeof initialData) => {
		await updateTenant({
			cognitoId: authUser?.cognitoInfo?.userId,
			...data,
		});
	};

	return (
		<SettingsForm
			initialData={initialData}
			onSubmit={handleSubmit}
			userType="tenant"
		/>
	);
};

export default TenantSettings;
