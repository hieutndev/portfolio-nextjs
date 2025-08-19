"use client";

import { addToast, Divider, Image, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

import Container from "@/components/shared/container/container";
import CustomForm from "@/components/shared/forms/custom-form";
import API_ROUTE from "@/configs/api";
import { MAP_MESSAGE } from "@/configs/response-message";
import ROUTE_PATH from "@/configs/route-path";
import { useFetch } from "@/hooks/useFetch";
import { IAPIResponse } from "@/types/global";
import { BREAK_POINT } from "@/configs/break-point";
import useScreenSize from "@/hooks/useScreenSize";
import { TSignInResponse, TSignUp } from "@/types/auth";

// interface SignInProps {}

export default function SignUpPage() {
	const router = useRouter();

	const [signUpForm, setSignUpForm] = useState<TSignUp>({
		email: "",
		password: "",
		confirm_password: "",
	});

	const {
		data: signUpResponse,
		loading: signingUp,
		error: signUpError,
		fetch: signUp,
	} = useFetch<IAPIResponse<TSignInResponse>>(API_ROUTE.ACCOUNT.SIGN_UP, {
		method: "POST",
		body: signUpForm,
		skip: true,
	});

	const onSubmitSignUp = () => {
		if (!signUpForm.email || !signUpForm.password || !signUpForm.confirm_password) {
			addToast({
				title: "Error",
				description: "Please fill in all fields",
				color: "danger",
			});

			return false;
		}

		signUp();
	};

	useEffect(() => {
		if (signUpResponse) {
			addToast({
				title: "Success",
				description: MAP_MESSAGE[signUpResponse.message],
				color: "success",
			});
			router.push(ROUTE_PATH.AUTH.SIGN_IN);
		}

		if (signUpError) {
			const parseError = JSON.parse(signUpError);

			addToast({
				title: "Error",
				description: MAP_MESSAGE[parseError.message],
				color: "danger",
			});
		}
	}, [signUpResponse, signUpError]);

	const { width } = useScreenSize();

	return (
		<div className={"bg-light w-screen h-screen flex flex-col justify-center items-center gap-8 px-4"}>
			<button
				className={"w-96"}
				onClick={() => router.push(ROUTE_PATH.CLIENT.INDEX)}
			>
				<Image
					alt=""
					className={"drop-shadow-2xl"}
					radius={"none"}
					src="/logow_b.png"
				/>
			</button>

			<Container
				className={clsx(
					"bg-white rounded-3xl shadow-lg max-w-2xl h-max border border-default-200 flex flex-col gap-4",
					{
						"p-8": width >= BREAK_POINT.XL,
						"p-4": width < BREAK_POINT.XL,
					}
				)}
				orientation={"vertical"}
			>
				<h2 className={"text-primary text-4xl font-bold"}>Sign up.</h2>
				<CustomForm
					className={"flex flex-col gap-4"}
					formId={"loginForm"}
					isLoading={signingUp}
					loadingText={"Signing up"}
					submitButtonSize={"lg"}
					submitButtonText={"Sign up"}
					onSubmit={onSubmitSignUp}
				>
					<Input
						label={"Your email"}
						labelPlacement={"outside"}
						name={"email"}
						placeholder={"example@email.com"}
						size={"lg"}
						value={signUpForm.email}
						variant={"bordered"}
						onValueChange={(value) => setSignUpForm((prev) => ({ ...prev, email: value }))}
					/>
					<Input
						label={"Password"}
						labelPlacement={"outside"}
						name={"password"}
						placeholder={"Enter your password"}
						size={"lg"}
						type={"password"}
						value={signUpForm.password}
						variant={"bordered"}
						onValueChange={(value) => setSignUpForm((prev) => ({ ...prev, password: value }))}
					/>
					<Input
						label={"Confirm password"}
						labelPlacement={"outside"}
						name={"confirm_password"}
						placeholder={"Re-enter your password"}
						size={"lg"}
						type={"password"}
						value={signUpForm.confirm_password}
						variant={"bordered"}
						onValueChange={(value) => setSignUpForm((prev) => ({ ...prev, confirm_password: value }))}
					/>
				</CustomForm>
				<Divider />
				<div className={"flex items-center justify-between"}>
					<p className={"text-center"}>
						Already have an account?{" "}
						<button
							className={"ml-2 text-primary-500 hover:text-primary-300 transition-colors duration-300"}
							type="button"
							onClick={() => router.push(ROUTE_PATH.AUTH.SIGN_IN)}
						>
							Sign In Here
						</button>
					</p>
				</div>
			</Container>
		</div>
	);
}
