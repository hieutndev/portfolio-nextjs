"use client";

import { useState, useEffect } from "react";
import { Input, addToast } from "@heroui/react";
import Image from "next/image";
import { useFetch } from "hieutndev-toolkit";

import CustomForm from "@/components/shared/forms/custom-form";
import API_ROUTE from "@/configs/api";
import { TApp, TNewApp, TUpdateApp } from "@/types/application";
import { IAPIResponse } from "@/types/global";

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
		// loading: submitting,
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
		// error: fetchAppDetailError,
		// loading: fetchingAppDetail,
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
			className={"flex flex-col gap-4"}
			formId={"applicationForm"}
			loadingText={loadingText}
			submitButtonText={buttonText}
			onSubmit={handleSubmit}
		>
			<div className="grid grid-cols-1 gap-4">
				<Input
					isRequired
					label="App Name"
					labelPlacement={"outside"}
					name="app_name"
					placeholder="Enter application name..."
					type="text"
					value={formData.app_name}
					variant={"bordered"}
					onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
				/>
				
				<Input
					isRequired
					label="App Link"
					labelPlacement={"outside"}
					name="app_link"
					placeholder="Enter application link/URL..."
					type="text"
					value={formData.app_link}
					variant={"bordered"}
					onChange={(e) => setFormData({ ...formData, app_link: e.target.value })}
				/>

				{mode === "update" && currentAppIcon ? (
					<div className="grid grid-cols-4 gap-4 items-start">
						<div className="col-span-3">
							<Input
								accept="image/*"
								description="Leave empty to keep current icon"
								label="App Icon"
								labelPlacement={"outside"}
								name="app_icon"
								type="file"
								variant={"bordered"}
								onChange={(e) => {
									setFormData((prev) => ({
										...prev,
										app_icon: e.target.files && e.target.files.length > 0 ? e.target.files : null,
									}));
								}}
							/>
						</div>
						<div className="col-span-1 flex flex-col justify-center items-center gap-1">
							<span className="text-sm font-medium text-gray-700">
								Current Icon
							</span>
							<Image
								alt="Current app icon"
								className="rounded-md border"
								height={50}
								src={currentAppIcon}
								width={50}
							/>
						</div>
					</div>
				) : (
					<Input
						isRequired
						accept="image/*"
						label="App Icon"
						labelPlacement={"outside"}
						name="app_icon"
						type="file"
						variant={"bordered"}
						onChange={(e) => {
							setFormData((prev) => ({
								...prev,
								app_icon: e.target.files && e.target.files.length > 0 ? e.target.files : null,
							}));
						}}
					/>
				)}
			</div>
		</CustomForm>
	);
}
