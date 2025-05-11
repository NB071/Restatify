import { SettingsFormData, settingsSchema } from "@/lib/schemas";
import React from "react";
import { ZodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "./ui/form";

const SettingsForm = ({
	initialData,
	onSubmit,
	userType,
}: SettingsFormProps) => {
	const [editMode, setEditMode] = React.useState(false);
	const form = useForm<SettingsFormData>({
		resolver: ZodResolver(settingsSchema),
		defaultValues: initialData,
	});

	const toggleEditMode = () => {
		setEditMode((prev) => !prev);
		if (editMode) {
			form.reset(initialData);
		}
	};

	const handleSubmit = async (data: SettingsFormData) => {
		await onSubmit(data);
		setEditMode(false);
	};

	return (
		<section className="pt-8 pb-5 px-8">
			<section className="mb-5">
				<h1 className="text-xl font-semibold">
					{`${
						userType.charAt(0).toUpperCase() + userType.slice(1)
					} Settings`}
				</h1>
				<p className="text-sm text-gray-500 mt-1">
					Manage your account preferences and personal information
				</p>
			</section>
			<section className="bg-white rounded-xl p-6">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					></form>
				</Form>
			</section>
		</section>
	);
};

export default SettingsForm;
