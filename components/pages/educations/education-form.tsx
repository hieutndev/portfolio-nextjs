"use client";

import { useState, useEffect } from "react";
import { Input, addToast, DatePicker, Checkbox } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import moment from "moment";
import { useRouter } from "next/navigation";

import CustomForm from "@/components/shared/forms/custom-form";
import { useFetch } from "@/hooks/useFetch";
import API_ROUTE from "@/configs/api";
import { TEducation, TNewEducation, TUpdateEducation } from "@/types/education";
import { IAPIResponse } from "@/types/global";


export interface EducationFormProps {
	mode: "create" | "edit";
	educationId?: number;
	onSuccess?: () => void;
}

export default function EducationForm({ mode, educationId, onSuccess }: EducationFormProps) {

	const [formData, setFormData] = useState<TNewEducation & TUpdateEducation>({
		title: "",
		organization: "",
		time_start: moment(new Date().toISOString()).startOf("day").format("YYYY-MM-DD"),
		time_end: null,
	});

	const [isCurrent, setIsCurrent] = useState<boolean>(false);

	const {
		data: submitResult,
		error: submitError,
		// loading: submitting,
		fetch: submitEducation,
	} = useFetch(mode === "create" ? API_ROUTE.EDUCATION.NEW : API_ROUTE.EDUCATION.UPDATE(educationId ?? -1), {
		method: mode === "create" ? "POST" : "PATCH",
		skip: true,
	});

	const {
		data: fetchEducationDetailResult,
		error: fetchEducationDetailError,
		// loading: fetchingEducationDetail,
		fetch: fetchEducationDetail,
	} = useFetch<IAPIResponse<TEducation>>(API_ROUTE.EDUCATION.GET_ONE(educationId ?? -1), {
		skip: true,
	});

	useEffect(() => {
		if (mode === "edit" && educationId) {
			fetchEducationDetail();
		}
	}, [mode, educationId]);

	useEffect(() => {
		if (fetchEducationDetailResult) {
			setFormData({
				title: fetchEducationDetailResult.results?.title ?? "",
				organization: fetchEducationDetailResult.results?.organization ?? "",
				time_start: moment(fetchEducationDetailResult.results?.time_start).format("YYYY-MM-DD") ?? "",
				time_end: fetchEducationDetailResult.results?.time_end ?? null,
			});
			setIsCurrent(!fetchEducationDetailResult.results?.time_end);
		}
	}, [fetchEducationDetailResult, fetchEducationDetailError]);

	useEffect(() => {
		if (submitResult) {
			addToast({
				title: "Success",
				description: mode === "create" ? "Education added successfully" : "Education updated successfully",
				color: "success",
			});
			if (onSuccess) {
				onSuccess();
			}
		}
		if (submitError) {
			const parsedError = JSON.parse(submitError);

			if (parsedError.message) {
				addToast({ title: "Error", description: parsedError.message, color: "danger" });
			}
		}
	}, [submitResult, submitError]);

	useEffect(() => {
		if (isCurrent) {
			setFormData((prev) => ({
				...prev,
				time_end: null,
			}));
		}
	}, [isCurrent]);

	const handleSubmit = () => {
		submitEducation({
			body: {
				...formData,
				time_end: isCurrent ? null : formData.time_end,
			},
		});
	};

	const buttonText = mode === "create" ? "Add Education" : "Update Education";
	const loadingText = mode === "create" ? "Adding..." : "Updating...";

	const isFormValid = () => {
		return formData.title && formData.organization && formData.time_start && (isCurrent || formData.time_end);
	};

	return (
		<CustomForm
			className="flex flex-col gap-4"
			disableSubmitButton={!isFormValid()}
			formId="educationForm"
			loadingText={loadingText}
			submitButtonText={buttonText}
			onSubmit={handleSubmit}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					isRequired
					label="Title/Major"
					labelPlacement="outside"
					name="title"
					placeholder="Enter title or major..."
					type="text"
					value={formData.title}
					variant="bordered"
					onChange={(e) => setFormData({ ...formData, title: e.target.value })}
				/>
				<Input
					isRequired
					label="Organization/School"
					labelPlacement="outside"
					name="organization"
					placeholder="Enter organization or school..."
					type="text"
					value={formData.organization}
					variant="bordered"
					onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
				/>
				<DatePicker
					isRequired
					label="Start Date"
					labelPlacement="outside"
					name="time_start"
					value={parseDate(moment(formData.time_start).format("YYYY-MM-DD")) || undefined}
					variant="bordered"
					onChange={(e) => {
						setFormData((prev) => ({
							...prev,
							time_start: moment(e?.toString()).startOf("day").format("YYYY-MM-DD") ?? prev.time_start,
						}));
					}}
				/>
				<DatePicker
					isDisabled={isCurrent}
					label="End Date"
					labelPlacement="outside"
					name="time_end"
					value={formData.time_end ? parseDate(moment(formData.time_end).format("YYYY-MM-DD")) : undefined}
					variant="bordered"
					onChange={(e) => {
						setFormData((prev) => ({
							...prev,
							time_end: e ? moment(e.toString()).startOf("day").format("YYYY-MM-DD") : null,
						}));
					}}
				/>
			</div>

			<div className="flex justify-end">
				<Checkbox
					isSelected={isCurrent}
					name="isCurrent"
					onValueChange={setIsCurrent}
				>
					Currently studying here?
				</Checkbox>
			</div>
		</CustomForm>
	);
}
