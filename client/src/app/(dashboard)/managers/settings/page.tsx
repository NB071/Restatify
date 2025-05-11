"use client";

import SettingsForm from "@/components/SettingsForm";
import {
	useGetAuthUserQuery,
	useUpdateManagerSettingsMutation,
} from "@/state/api";
import React from "react";

const ManagerSettings = () => {
	const { data: authUser, isLoading: isAuthLoading } = useGetAuthUserQuery();
	const [updateManager] = useUpdateManagerSettingsMutation();

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
		await updateManager({
			cognitoId: authUser?.cognitoInfo?.userId,
			...data,
		});
	};

	return (
		<SettingsForm
			initialData={initialData}
			onSubmit={handleSubmit}
			userType="manager"
		/>
	);
};

export default ManagerSettings;
