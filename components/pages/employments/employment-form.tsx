"use client";

import { useState, useEffect } from "react";
import { addToast, Input, DateRangePicker, RangeValue } from "@heroui/react";
import { useRouter } from "next/navigation";
import { DateValue, parseDate } from "@internationalized/date";
import moment from "moment";

import CustomForm from "@/components/shared/forms/custom-form";
import { useFetch } from "@/hooks/useFetch";
import { IAPIResponse } from "@/types/global";
import { TEmployment, TNewEmployment } from "@/types/employment";
import API_ROUTE from "@/configs/api";
import { MAP_MESSAGE } from "@/configs/response-message";
import { formatDate } from "@/utils/date";



interface EmploymentFormProps {
	mode: "create" | "update";
	defaultValues?: TEmployment;
	employmentId?: number;
	onSuccess?: () => void;
}

export default function EmploymentFormComponent({ mode, defaultValues, employmentId, onSuccess }: EmploymentFormProps) {
	const router = useRouter();

	const [employmentData, setEmploymentData] = useState<TNewEmployment>({
		title: "",
		organization: "",
		time_start: "",
		time_end: "",
	});

	const [datePicked, setDatePicked] = useState<RangeValue<DateValue> | null>(
		mode === "create"
			? {
					start: parseDate(moment().format("YYYY-MM-DD")),
					end: parseDate(moment().add(1, "month").format("YYYY-MM-DD")),
			  }
			: null
	);

	/* HANDLE FETCH EMPLOYMENT DETAILS (for edit mode) */
	const {
		data: fetchEmploymentResult,
		error: fetchEmploymentError,
		loading: fetchingEmployment,
		fetch: fetchEmployment,
	} = useFetch<IAPIResponse<TEmployment>>(
		mode === "update" && employmentId ? API_ROUTE.EMPLOYMENT.GET_ONE(employmentId) : "",
		{
			skip: mode === "create" || !employmentId,
		}
	);

	useEffect(() => {
		console.log("🚀 ~ EmploymentFormComponent ~ mode, employmentId:", mode, employmentId)

		if (mode === "update" && employmentId) {
			fetchEmployment();
		}
	}, [mode, employmentId]);

	useEffect(() => {
		if (mode === "update" && fetchEmploymentResult && fetchEmploymentResult.results) {
			const employment = fetchEmploymentResult.results;
			const formattedData = {
				title: employment.title,
				organization: employment.organization,
				time_start: formatDate(employment.time_start, "onlyDateReverse"),
				time_end: formatDate(employment.time_end, "onlyDateReverse"),
			};

			setEmploymentData(formattedData);

			// Set date picker values
			setDatePicked({
				start: parseDate(formattedData.time_start),
				end: parseDate(formattedData.time_end),
			});
		} else if (mode === "create" && defaultValues) {
			// If we have default values for create mode
			const formattedData = {
				title: defaultValues.title,
				organization: defaultValues.organization,
				time_start: formatDate(defaultValues.time_start, "onlyDateReverse"),
				time_end: formatDate(defaultValues.time_end, "onlyDateReverse"),
			};

			setEmploymentData(formattedData);
			setDatePicked({
				start: parseDate(formattedData.time_start),
				end: parseDate(formattedData.time_end),
			});
		}

		if (fetchEmploymentError) {
			const parseError = JSON.parse(fetchEmploymentError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [mode, fetchEmploymentResult, fetchEmploymentError, defaultValues]);

	/* HANDLE SUBMIT */
	const {
		data: submitResult,
		error: submitError,
		loading: submitting,
		fetch: submitEmployment,
	} = useFetch(mode === "create" ? API_ROUTE.EMPLOYMENT.NEW : API_ROUTE.EMPLOYMENT.UPDATE(employmentId!), {
		method: mode === "create" ? "POST" : "PATCH",
		skip: true,
	});

	useEffect(() => {
		if (submitResult) {
			addToast({
				title: "Success",
				description: `Employment history ${mode === "create" ? "added" : "updated"} successfully`,
				color: "success",
			});

			onSuccess?.();
		}

		if (submitError) {
			const parseError = JSON.parse(submitError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [submitResult, submitError, mode, router, onSuccess]);

	// Update employment data when date range changes
	useEffect(() => {
		if (datePicked?.start && datePicked?.end) {
			setEmploymentData((prev) => ({
				...prev,
				time_start: datePicked.start.toString(),
				time_end: datePicked.end.toString(),
			}));
		}
	}, [datePicked]);

	const handleSubmit = () => {
		// Validate required fields
		if (!employmentData.title || !employmentData.organization) {
			addToast({
				title: "Error",
				description: "Please fill in all required fields",
				color: "danger",
			});

			return;
		}

		if (!datePicked?.start || !datePicked?.end) {
			addToast({
				title: "Error",
				description: "Please select start and end dates",
				color: "danger",
			});

			return;
		}
		console.log("submit");

		submitEmployment({
			body: employmentData,
		});
	};

	const isLoading = fetchingEmployment || submitting;
	const buttonText = mode === "create" ? "Add new" : "Update";
	const loadingText = mode === "create" ? "Adding..." : "Updating...";

	return (
		<CustomForm
			className={"w-full flex flex-col gap-4 mb-4"}
			formId={mode === "create" ? "newEmploymentForm" : "updateEmploymentForm"}
			isLoading={isLoading}
			loadingText={loadingText}
			submitButtonText={buttonText}
			onSubmit={handleSubmit}
		>
			{/* <Divider /> */}

			<div className={"grid grid-cols-2 gap-4"}>
				<Input
					isRequired
					label={"Title"}
					labelPlacement={"outside"}
					name={"title"}
					placeholder={"Enter title..."}
					type={"text"}
					value={employmentData.title}
					variant={"bordered"}
					onValueChange={(value) => setEmploymentData((prev) => ({ ...prev, title: value }))}
				/>

				<Input
					isRequired
					label={"Organization"}
					labelPlacement={"outside"}
					name={"organization"}
					placeholder={"Enter organization..."}
					type={"text"}
					value={employmentData.organization}
					variant={"bordered"}
					onValueChange={(value) => setEmploymentData((prev) => ({ ...prev, organization: value }))}
				/>
			</div>

			<DateRangePicker
				isRequired
				aria-label={"Employment duration"}
				label={"Employment Duration"}
				labelPlacement={"outside"}
				value={datePicked}
				variant={"bordered"}
				onChange={setDatePicked}
			/>
		</CustomForm>
	);
}
