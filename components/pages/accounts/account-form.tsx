"use client";

import { useState, useEffect } from "react";
import { Input, addToast, Select, SelectItem } from "@heroui/react";

import CustomForm from "@/components/shared/forms/custom-form";
import { useFetch } from "hieutndev-toolkit";
import API_ROUTE from "@/configs/api";
import { TNewAccount } from "@/types/account";
import { MAP_MESSAGE } from "@/configs/response-message";

export interface AccountFormProps {
	onSuccess?: () => void;
}

export default function AccountForm({onSuccess }: AccountFormProps) {
	const [formData, setFormData] = useState<TNewAccount>({
		email: "",
		username: "",
		password: "",
		role: 0,
		from_admin: 1,
	});

	const {
		data: submitResult,
		error: submitError,
		loading: submitting,
		fetch: submitAccount,
	} = useFetch(
		API_ROUTE.ACCOUNT.SIGN_UP,
		{
			method: "POST",
			skip: true,
		}
	);

	useEffect(() => {
		if (submitResult) {
			addToast({
				title: "Success",
				description: MAP_MESSAGE[submitResult.message],
			});
			onSuccess?.();
		}

		if (submitError) {
			const parsedError = JSON.parse(submitError);

			addToast({
				title: "Error",
				description: MAP_MESSAGE[parsedError.message],
			});
		}
	}, [submitResult, submitError]);

	const handleSubmit = async () => {

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(formData.email)) {
			addToast({
				title: "Validation Error",
				description: "Please enter a valid email address",
			});

			return;
		}

		submitAccount({
			body: {
				email: formData.email,
				username: formData.username,
				password: formData.password,
				role: formData.role,
			},
		});
	};

	const roleOptions = [
		{ key: 0, label: "User" },
		{ key: 1, label: "Admin" },
	];

	return (
		<CustomForm
			className={"flex flex-col gap-4"}
			disableSubmitButton={submitting}
			formId={"accountForm"}
			isLoading={submitting}
			submitButtonText={"Create Account"}
			onSubmit={handleSubmit}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Input
					isRequired
					label="Email"
					labelPlacement={"outside"}
					placeholder="Enter email address"
					type="email"
					value={formData.email}
					variant="bordered"
					onValueChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
				/>

				<Input
					isRequired
					label="Username"
					labelPlacement={"outside"}
					placeholder="Enter username"
					value={formData.username}
					variant="bordered"
					onValueChange={(value) => setFormData((prev) => ({ ...prev, username: value }))}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Input
					isRequired
					label={"Password"}
					labelPlacement={"outside"}
					placeholder={"Enter password"}
					type="password"
					value={formData.password}
					variant="bordered"
					onValueChange={(value) => setFormData((prev) => ({ ...prev, password: value }))}
				/>

				<Select
					isRequired
					label="Role"
					labelPlacement={"outside"}
					placeholder="Select user role"
					selectedKeys={[formData.role.toString()]}
					variant="bordered"
					onSelectionChange={(keys) => {
						const selectedKey = Array.from(keys)[0] as string;

						setFormData((prev) => ({ ...prev, role: parseInt(selectedKey) }));
					}}
				>
					{roleOptions.map((option) => (
						<SelectItem key={option.key}>{option.label}</SelectItem>
					))}
				</Select>
			</div>
		</CustomForm>
	);
}
