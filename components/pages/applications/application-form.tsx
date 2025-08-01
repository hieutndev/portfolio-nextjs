"use client";

import { useState, useEffect } from "react";
import { Input, Button, addToast } from "@heroui/react";
import CustomForm from "@/components/shared/forms/custom-form";
import { useFetch } from "@/hooks/useFetch";
import API_ROUTE from "@/configs/api";
import { TApp, TNewApp, TUpdateApp } from "@/types/application";
import { IAPIResponse } from "@/types/global";
import Image from "next/image";

export interface ApplicationFormProps {
	mode: "create" | "update";
	applicationId?: number;
	onSuccess?: () => void;
}

export default function ApplicationForm({ mode, applicationId, onSuccess }: ApplicationFormProps) {
	const [formData, setFormData] = useState<TNewApp & TUpdateApp>({
		app_name: "",
		app_link: "",
		app_icon: null as FileList | null,
	});

	const [currentAppIcon, setCurrentAppIcon] = useState<string>("");

	const {
		data: submitResult,
		error: submitError,
		loading: submitting,
		fetch: submitApplication,
	} = useFetch(
		mode === "create" ? API_ROUTE.APP.NEW : API_ROUTE.APP.UPDATE_INFO(applicationId ?? -1),
		{
			method: mode === "create" ? "POST" : "PATCH",
			skip: true,
			options: {
				removeContentType: true,
			},
		}
	);

	const {
		data: fetchAppDetailResult,
		error: fetchAppDetailError,
		loading: fetchingAppDetail,
		fetch: fetchAppDetail,
	} = useFetch<IAPIResponse<TApp>>(API_ROUTE.APP.GET_ONE(applicationId ?? -1), {
		skip: true,
	});

	useEffect(() => {
		if (mode === "update" && applicationId) {
			fetchAppDetail();
		}
	}, [mode, applicationId]);

	useEffect(() => {
		if (fetchAppDetailResult) {
			const appData = fetchAppDetailResult.results;
			setFormData((prev) => ({
				app_name: appData?.app_name ?? prev.app_name,
				app_link: appData?.app_link ?? prev.app_link,
				app_icon: null,
			}));
			setCurrentAppIcon(appData?.app_icon ?? "");
		}
	}, [fetchAppDetailResult]);

	useEffect(() => {
		if (submitResult) {
			addToast({ 
				title: "Success", 
				description: mode === "create" ? "Application added successfully" : "Application updated successfully", 
				color: "success" 
			});
			onSuccess?.();
		}
		if (submitError) {
			const parsedError = JSON.parse(submitError);

			if (parsedError.message) {
				addToast({ title: "Error", description: parsedError.message, color: "danger" });
			}
		}
	}, [submitResult, submitError, mode]);

	const handleSubmit = () => {
		const form = new FormData();

		form.append("app_name", formData.app_name);
		form.append("app_link", formData.app_link);
		
		if (formData.app_icon) {
			form.append("app_icon", formData.app_icon[0]);
		}

		// For update mode, add the change icon flag
		if (mode === "update") {
			form.append("is_change_icon", formData.app_icon ? "true" : "false");
		}

		submitApplication({
			body: form,
			options: {
				removeContentType: true,
			},
		});
	};

	const buttonText = mode === "create" ? "Add Application" : "Update Application";
	const loadingText = mode === "create" ? "Adding..." : "Updating...";

	return (
		<CustomForm
			onSubmit={handleSubmit}
			formId={"applicationForm"}
			className={"flex flex-col gap-4"}
			loadingText={loadingText}
			submitButtonText={buttonText}
		>
			<div className="grid grid-cols-1 gap-4">
				<Input
					type="text"
					label="App Name"
					value={formData.app_name}
					onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
					name="app_name"
					placeholder="Enter application name..."
					isRequired
					labelPlacement={"outside"}
					variant={"bordered"}
				/>
				
				<Input
					type="text"
					label="App Link"
					value={formData.app_link}
					onChange={(e) => setFormData({ ...formData, app_link: e.target.value })}
					name="app_link"
					placeholder="Enter application link/URL..."
					isRequired
					labelPlacement={"outside"}
					variant={"bordered"}
				/>

				{mode === "update" && currentAppIcon ? (
					<div className="grid grid-cols-4 gap-4 items-start">
						<div className="col-span-3">
							<Input
								type="file"
								label="App Icon"
								name="app_icon"
								onChange={(e) => {
									setFormData((prev) => ({
										...prev,
										app_icon: e.target.files && e.target.files.length > 0 ? e.target.files : null,
									}));
								}}
								accept="image/*"
								labelPlacement={"outside"}
								variant={"bordered"}
								description="Leave empty to keep current icon"
							/>
						</div>
						<div className="col-span-1 flex flex-col justify-center items-center gap-1">
							<span className="text-sm font-medium text-gray-700">
								Current Icon
							</span>
							<Image
								src={currentAppIcon}
								alt="Current app icon"
								width={50}
								height={50}
								className="rounded-md border"
							/>
						</div>
					</div>
				) : (
					<Input
						type="file"
						label="App Icon"
						name="app_icon"
						onChange={(e) => {
							setFormData((prev) => ({
								...prev,
								app_icon: e.target.files && e.target.files.length > 0 ? e.target.files : null,
							}));
						}}
						accept="image/*"
						labelPlacement={"outside"}
						variant={"bordered"}
						isRequired
					/>
				)}
			</div>
		</CustomForm>
	);
}
