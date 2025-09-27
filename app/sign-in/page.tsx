"use client";

import { addToast, Divider, Image, Input } from "@heroui/react";
import { useReactiveCookiesNext } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import clsx from "clsx";
import { useFetch, useWindowSize } from "hieutndev-toolkit";

import Container from "@/components/shared/container/container";
import CustomForm from "@/components/shared/forms/custom-form";
import API_ROUTE from "@/configs/api";
import { MAP_MESSAGE } from "@/configs/response-message";
import ROUTE_PATH from "@/configs/route-path";
import { IAPIResponse } from "@/types/global";
import { BREAK_POINT } from "@/configs/break-point";
import { TSignIn, TSignInResponse } from "@/types/auth";

function SignInContent() {
  const router = useRouter();
  const { setCookie } = useReactiveCookiesNext();
  const search = useSearchParams();

  useEffect(() => {
    if (search.get("message")) {
      addToast({
        title: "Error",
        description: MAP_MESSAGE[search.get("message") ?? ""],
        color: "danger",
      });
    }
  }, [search]);

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
      setCookie("access_token", signInResponse.results?.access_token, {
        maxAge: 10,
        path: "/",
      });
      setCookie("refresh_token", signInResponse.results?.refresh_token, {
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      setCookie("role", signInResponse.results?.role, {
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      addToast({
        title: "Success",
        description: MAP_MESSAGE[signInResponse.message],
        color: "success",
      });
      router.push(ROUTE_PATH.ADMIN.DASHBOARD.INDEX);
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

  const { width } = useWindowSize();
  

  return (
    <div
      className={
        "bg-light w-screen h-screen flex flex-col justify-center items-center gap-8 px-4"
      }>
      <button
        className={"w-96"}
        onClick={() => router.push(ROUTE_PATH.CLIENT.INDEX)}>
        <Image alt="" className={"drop-shadow-2xl"} radius={"none"} src="/logow_b.png" />
      </button>

      <Container
        className={clsx(
          "bg-white rounded-3xl shadow-lg max-w-2xl h-max border border-default-200 flex flex-col gap-4",
          {
            "p-8": width >= BREAK_POINT.XL,
            "p-4": width < BREAK_POINT.XL,
          }
        )}
        orientation={"vertical"}>
        <h2 className={"text-primary text-4xl font-bold"}>Sign in.</h2>
        <CustomForm
          className={"flex flex-col gap-4"}
          formId={"loginForm"}
          isLoading={signingIn}
          loadingText={"Signing in"}
          submitButtonSize={"lg"}
          submitButtonText={"Sign in"}
          onSubmit={onSubmitSignIn}>
          <Input
            label={"Email"}
            labelPlacement={"outside"}
            name={"email"}
            placeholder={"example@email.com"}
            size={"lg"}
            value={signInForm.email}
            variant={"bordered"}
            onValueChange={(value) =>
              setSignInForm((prev) => ({ ...prev, email: value }))
            }
          />
          <Input
            label={"Password"}
            labelPlacement={"outside"}
            name={"password"}
            placeholder={"Enter your password"}
            size={"lg"}
            type={"password"}
            value={signInForm.password}
            variant={"bordered"}
            onChange={(e) =>
              setSignInForm((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </CustomForm>
        <Divider />
        <div className={"flex items-center justify-between"}>
          <p className={"text-center"}>
            Don&apos;t have an account yet?{" "}
            <button
              className={
                "ml-2 text-primary-500 hover:text-primary-300 transition-colors duration-300"
              }
              type="button"
              onClick={() => router.push(ROUTE_PATH.AUTH.SIGN_UP)}>
              Sign up here
            </button>
          </p>
        </div>
      </Container>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
