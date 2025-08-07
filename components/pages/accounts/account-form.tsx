"use client";

import { useState, useEffect, FormEvent } from "react";
import { Input, Button, addToast, Select, SelectItem, Switch } from "@heroui/react";
import CustomForm from "@/components/shared/forms/custom-form";
import { useFetch } from "@/hooks/useFetch";
import API_ROUTE from "@/configs/api";
import { TAccount, TNewAccount, TUpdateAccount } from "@/types/account";
import { IAPIResponse } from "@/types/global";
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
			formId={"accountForm"}
			onSubmit={handleSubmit}
			className={"flex flex-col gap-4"}
			submitButtonText={"Create Account"}
			isLoading={submitting}
			disableSubmitButton={submitting}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Input
					label="Email"
					placeholder="Enter email address"
					type="email"
					value={formData.email}
					onValueChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
					isRequired
					variant="bordered"
				/>

				<Input
					label="Username"
					placeholder="Enter username"
					value={formData.username}
					onValueChange={(value) => setFormData((prev) => ({ ...prev, username: value }))}
					isRequired
					variant="bordered"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Input
					label={"Password"}
					placeholder={"Enter password"}
					type="password"
					value={formData.password}
					onValueChange={(value) => setFormData((prev) => ({ ...prev, password: value }))}
					isRequired
					variant="bordered"
				/>

				<Select
					label="Role"
					placeholder="Select user role"
					selectedKeys={[formData.role.toString()]}
					onSelectionChange={(keys) => {
						const selectedKey = Array.from(keys)[0] as string;
						setFormData((prev) => ({ ...prev, role: parseInt(selectedKey) }));
					}}
					variant="bordered"
					isRequired
				>
					{roleOptions.map((option) => (
						<SelectItem key={option.key}>{option.label}</SelectItem>
					))}
				</Select>
			</div>
		</CustomForm>
	);
}
