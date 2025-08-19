"use client";

import { useState, useEffect } from "react";
import { Input, addToast, DatePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import moment from "moment";
import Image from "next/image";

import CustomForm from "@/components/shared/forms/custom-form";
import { useFetch } from "@/hooks/useFetch";
import API_ROUTE from "@/configs/api";
import { TCertification, TNewCertification, TUpdateCertification } from "@/types/certification";
import { IAPIResponse } from "@/types/global";


export interface CertificationFormProps {
	mode: "create" | "update";
	certificationId?: number;
	onSuccess?: () => void;
}

export default function CertificationForm({ mode, certificationId, onSuccess }: CertificationFormProps) {
	const [formData, setFormData] = useState<TNewCertification & TUpdateCertification>({
		title: "",
		cert_image: null as FileList | null,
		issued_by: "",
		issued_date: moment(new Date().toISOString()).startOf("day").format("YYYY-MM-DD"),
		image_url: "",
	});

	// const [currentCertImage, setcurrentCertImage] = useState<string>("");

	const {
		data: submitResult,
		error: submitError,
		// loading: submitting,
		fetch: submitEmployment,
	} = useFetch(
		mode === "create" ? API_ROUTE.CERTIFICATION.NEW : API_ROUTE.CERTIFICATION.UPDATE(certificationId ?? -1),
		{
			method: mode === "create" ? "POST" : "PATCH",
			skip: true,
			options: {
				removeContentType: true,
			},
		}
	);

	const {
		data: fetchCertDetailResult,
		error: fetchCertDetailError,
		// loading: fetchingCertDetail,
		fetch: fetchCertDetail,
	} = useFetch<IAPIResponse<TCertification>>(API_ROUTE.CERTIFICATION.GET_ONE(certificationId ?? -1), {
		skip: true,
	});

	useEffect(() => {
		if (mode === "update" && certificationId) {
			fetchCertDetail();
		}
	}, [mode, certificationId]);

	useEffect(() => {
		if (fetchCertDetailResult) {
			setFormData((prev) => ({
				title: fetchCertDetailResult.results?.title ?? prev.title,
				image_url: fetchCertDetailResult.results?.image_url ?? "",
				issued_by: fetchCertDetailResult.results?.issued_by ?? prev.issued_by,
				issued_date: fetchCertDetailResult.results?.issued_date ?? prev.issued_date,
				cert_image: null,
			}));
		}
	}, [fetchCertDetailResult, fetchCertDetailError]);

	useEffect(() => {
		if (submitResult) {
			addToast({ title: "Success", description: "Certification added", color: "success" });
			onSuccess?.();
		}
		if (submitError) {
			const parsedError = JSON.parse(submitError);

			if (parsedError.message) {
				addToast({ title: "Error", description: parsedError.message, color: "danger" });
			}
		}
	}, [submitResult, submitError]);

	const handleSubmit = () => {
		const form = new FormData();

		form.append("title", formData.title);
		form.append("issued_by", formData.issued_by);
		form.append("issued_date", formData.issued_date);
		if (formData.cert_image) {
			form.append("cert_image", formData.cert_image[0]);
		}

		submitEmployment({
			body: form,
			options: {
				removeContentType: true,
			},
		});
	};

	const buttonText = mode === "create" ? "Add new" : "Update";
	const loadingText = mode === "create" ? "Adding..." : "Updating...";

	return (
		<CustomForm
			className={"flex flex-col gap-4 mb-4"}
			formId={"certificationForm"}
			loadingText={loadingText}
			submitButtonText={buttonText}
			onSubmit={handleSubmit}
		>
			<div className="grid grid-cols-2 gap-4">
				<div className="w-full col-span-2">
					<Input
						isRequired
						label="Title"
						labelPlacement={"outside"}
						name="title"
						placeholder="Enter certificate title..."
						type="text"
						value={formData.title}
						variant={"bordered"}
						onChange={(e) => setFormData({ ...formData, title: e.target.value })}
					/>
				</div>
				<Input
					isRequired
					label="Issued By"
					labelPlacement={"outside"}
					name="issued_by"
					placeholder="Enter organization issuing..."
					type="text"
					value={formData.issued_by}
					variant={"bordered"}
					onChange={(e) => setFormData({ ...formData, issued_by: e.target.value })}
				/>
				<Input
					isRequired
					accept="image/*"
					label="Certification Image"
					labelPlacement={"outside"}
					name="cert_image"
					type="file"
					variant={"bordered"}
					onChange={(e) => {
						setFormData((prev) => ({
							...prev,
							cert_image: e.target.files && e.target.files.length > 0 ? e.target.files : null,
						}));
					}}
				/>
				<DatePicker
					isRequired
					className="col-span-2"
					label="Issued Date"
					labelPlacement={"outside"}
					name="issued_date"
					value={parseDate(moment(formData.issued_date).format("YYYY-MM-DD")) || undefined}
					variant="bordered"
					onChange={(e) => {
						setFormData((prev) => ({
							...prev,
							issued_date: moment(e?.toString()).startOf("day").format("YYYY-MM-DD") ?? prev.issued_date,
						}));
					}}
				/>
				{mode === "update" && formData.image_url && <Image alt={"certificate image"} height={1000} src={formData.image_url} width={1000}/>}
			</div>
		</CustomForm>
	);
}
