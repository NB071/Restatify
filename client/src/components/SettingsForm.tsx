import { SettingsFormData, settingsSchema } from "@/lib/schemas";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "./ui/form";
import { CustomFormField } from "./FormField";
import { Button } from "./ui/button";

const SettingsForm = ({
	initialData,
	onSubmit,
	userType,
}: SettingsFormProps) => {
	const [editMode, setEditMode] = React.useState(false);
	const form = useForm<SettingsFormData>({
		resolver: zodResolver(settingsSchema),
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
					>
						<CustomFormField
							name="name"
							label="Name"
							disabled={!editMode}
							placeholder="Enter your name"
						/>
						<CustomFormField
							type="email"
							name="email"
							label="Email"
							disabled={!editMode}
							placeholder="Enter your email"
						/>
						<CustomFormField
							name="phoneNumber"
							label="Phone Number"
							disabled={!editMode}
							placeholder="Enter your phone number"
						/>

						<div className="pt-4 flex justify-between">
							<Button
								type="button"
								onClick={toggleEditMode}
								className="bg-secondary-500 text-white hover:bg-secondary-600 duration-300"
							>
								{editMode ? "Cancel" : "Edit"}
							</Button>
							{editMode && (
								<Button
									type="submit"
									onClick={toggleEditMode}
									className="bg-primary-700 text-white hover:bg-primary-800 duration-300"
								>
									Save Changes
								</Button>
							)}
						</div>
					</form>
				</Form>
			</section>
		</section>
	);
};

export default SettingsForm;
