"use client";

import { useState, useEffect } from "react";
import { Input, Button, addToast, DatePicker, Checkbox, Divider } from "@heroui/react";
import AchievementRow from "@/components/pages/introduce/achievement-row";
import { formatDate } from "@/utils/date";
import { CalendarDate, parseDate } from "@internationalized/date";
import moment from "moment";
import CustomForm from "@/components/shared/forms/custom-form";
import { useFetch } from "@/hooks/useFetch";
import API_ROUTE from "@/configs/api";
import { TEducation, TNewEducation, TUpdateEducation } from "@/types/education";
import { IAPIResponse } from "@/types/global";
import Container from "@/components/shared/container/container";
import AdminHeader from "@/components/shared/partials/admin-header";
import ICON_CONFIG from "@/configs/icons";
import ROUTE_PATH from "@/configs/route-path";
import { useRouter } from "next/navigation";

export interface EducationFormProps {
	mode: "create" | "edit";
	educationId?: number;
	onSuccess?: () => void;
}

export default function EducationForm({ mode, educationId, onSuccess }: EducationFormProps) {
	const router = useRouter();
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
		loading: submitting,
		fetch: submitEducation,
	} = useFetch(mode === "create" ? API_ROUTE.EDUCATION.NEW : API_ROUTE.EDUCATION.UPDATE(educationId ?? -1), {
		method: mode === "create" ? "POST" : "PATCH",
		skip: true,
	});

	const {
		data: fetchEducationDetailResult,
		error: fetchEducationDetailError,
		loading: fetchingEducationDetail,
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
	const headerTitle = mode === "create" ? "Add New Education" : "Update Education Information";

	const isFormValid = () => {
		return formData.title && formData.organization && formData.time_start && (isCurrent || formData.time_end);
	};

	return (
		<CustomForm
			onSubmit={handleSubmit}
			formId="educationForm"
			className="flex flex-col gap-4"
			loadingText={loadingText}
			submitButtonText={buttonText}
			disableSubmitButton={!isFormValid()}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					type="text"
					label="Title/Major"
					value={formData.title}
					onChange={(e) => setFormData({ ...formData, title: e.target.value })}
					name="title"
					placeholder="Enter title or major..."
					isRequired
					labelPlacement="outside"
					variant="bordered"
				/>
				<Input
					type="text"
					label="Organization/School"
					value={formData.organization}
					onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
					name="organization"
					placeholder="Enter organization or school..."
					isRequired
					labelPlacement="outside"
					variant="bordered"
				/>
				<DatePicker
					label="Start Date"
					value={parseDate(moment(formData.time_start).format("YYYY-MM-DD")) || undefined}
					onChange={(e) => {
						setFormData((prev) => ({
							...prev,
							time_start: moment(e?.toString()).startOf("day").format("YYYY-MM-DD") ?? prev.time_start,
						}));
					}}
					name="time_start"
					isRequired
					variant="bordered"
					labelPlacement="outside"
				/>
				<DatePicker
					label="End Date"
					value={formData.time_end ? parseDate(moment(formData.time_end).format("YYYY-MM-DD")) : undefined}
					onChange={(e) => {
						setFormData((prev) => ({
							...prev,
							time_end: e ? moment(e.toString()).startOf("day").format("YYYY-MM-DD") : null,
						}));
					}}
					name="time_end"
					variant="bordered"
					labelPlacement="outside"
					isDisabled={isCurrent}
				/>
			</div>

			<div className="flex justify-end">
				<Checkbox
					isSelected={isCurrent}
					onValueChange={setIsCurrent}
					name="isCurrent"
				>
					Currently studying here?
				</Checkbox>
			</div>
		</CustomForm>
	);
}
