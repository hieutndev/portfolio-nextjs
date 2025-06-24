"use client";

import Container from "@/components/shared/container/container";
import CustomForm from "@/components/shared/forms/custom-form";
import API_ROUTE from "@/configs/api";
import { MAP_MESSAGE } from "@/configs/response-message";
import ROUTE_PATH from "@/configs/route-path";
import { useFetch } from "@/hooks/useFetch";
import { IAPIResponse } from "@/types/global";
import { addToast, Button, Divider, Input } from "@heroui/react";
import { useReactiveCookiesNext } from "cookies-next";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { BREAK_POINT } from "@/configs/break-point";
import useScreenSize from "@/hooks/useScreenSize";
import { TSignIn, TSignInResponse } from "@/types/auth";

// interface SignInProps {}

export default function SignInPage() {
	const router = useRouter();

	const { setCookie } = useReactiveCookiesNext();

	const [signInForm, setSignInForm] = useState<TSignIn>({
		email: "",
		password: "",
	});

	const {
		data: signInResponse,
		loading: signingIn,
		error: signInError,
		fetch: signIn,
	} = useFetch<IAPIResponse<TSignInResponse>>(API_ROUTE.ACCOUNT.SIGN_IN, {
		method: "POST",
		body: signInForm,
		skip: true,
	});

	const onSubmitSignIn = () => {
		if (!signInForm.email || !signInForm.password) {
			addToast({
				title: "Error",
				description: "Please fill in all fields",
				color: "danger",
			});
			return false;
		}

		signIn();
	};

	useEffect(() => {
		if (signInResponse) {
			setCookie("access_token", signInResponse.results?.access_token, { maxAge: 10, path: "/" });
			setCookie("refresh_token", signInResponse.results?.refresh_token, { maxAge: 60 * 60 * 24, path: "/" });
			setCookie("role", signInResponse.results?.role, { maxAge: 60 * 60 * 24, path: "/" });
			addToast({
				title: "Success",
				description: MAP_MESSAGE[signInResponse.message],
				color: "success",
			});
			router.push(ROUTE_PATH.CLIENT.INDEX);
		}

		if (signInError) {
			const parseError = JSON.parse(signInError);

			addToast({
				title: "Error",
				description: MAP_MESSAGE[parseError.message],
				color: "danger",
			});
		}
	}, [signInResponse, signInError]);

	const { width } = useScreenSize();

	return (
		<div className={"bg-light w-screen h-screen flex flex-col justify-center items-center gap-8 px-4"}>
			<div
				className={"w-96"}
				onClick={() => router.push(ROUTE_PATH.CLIENT.INDEX)}
			>
				<img
					src="/logow_b.png"
					alt=""
					className={"drop-shadow-2xl"}
				/>
			</div>

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
				<h2 className={"text-primary text-4xl font-bold"}>Sign in.</h2>
				<CustomForm
					formId={"loginForm"}
					submitButtonText={"Sign in"}
					submitButtonSize={"lg"}
					className={"flex flex-col gap-4"}
					onSubmit={onSubmitSignIn}
					loadingText={"Signing in"}
					isLoading={signingIn}
				>
					<Input
						label={"Your email"}
						labelPlacement={"outside"}
						name={"email"}
						variant={"bordered"}
						placeholder={"example@email.com"}
						size={"lg"}
						value={signInForm.email}
						onValueChange={(value) => setSignInForm((prev) => ({ ...prev, email: value }))}
					/>
					<Input
						label={"Password"}
						labelPlacement={"outside"}
						name={"password"}
						variant={"bordered"}
						type={"password"}
						placeholder={"Enter your password"}
						value={signInForm.password}
						onChange={(e) => setSignInForm((prev) => ({ ...prev, password: e.target.value }))}
						size={"lg"}
					/>
				</CustomForm>
				<Divider />
				<div className={"flex items-center justify-between"}>
					<p className={"text-center"}>
						Don't have an account yet?{" "}
						<button
							className={"ml-2 text-primary-500 hover:text-primary-300 transition-colors duration-300"}
							type="button"
							onClick={() => router.push(ROUTE_PATH.AUTH.SIGN_UP)}
						>
							Sign up here
						</button>
					</p>
				</div>
			</Container>
		</div>
	);
}
