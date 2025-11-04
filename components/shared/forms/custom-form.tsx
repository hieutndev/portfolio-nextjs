"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { Button, ButtonProps } from "@heroui/button";

import ICON_CONFIG from "@/configs/icons";

interface CustomFormProps {
  formId: string;
  className?: string;
  onSubmit?: () => void;
  onReset?: () => void;
  submitButtonText?: string;
  resetButtonText?: string;
  resetButtonIcon?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  disableSubmitButton?: boolean;
  submitButtonSize?: ButtonProps["size"];
  resetButtonSize?: ButtonProps["size"];
  useEnterKey?: boolean;
  useCtrlSKey?: boolean;
  children: React.ReactNode;
}

export default function CustomForm({
  formId,
  className,
  onSubmit,
  onReset,
  submitButtonText = "Submit",
  resetButtonText = "Reset",
  resetButtonIcon = false,
  isLoading = false,
  loadingText = "Submitting...",
  disableSubmitButton = false,
  submitButtonSize = "md",
  resetButtonSize = "md",
  useEnterKey = true,
  useCtrlSKey = false,
  children,
}: CustomFormProps) {

  const onSubmitRef = useRef(onSubmit);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (
      useEnterKey &&
      event.key === "Enter" &&
      !event.shiftKey &&
      !(
        event.target instanceof HTMLElement &&
        event.target.classList.contains("ql-editor")
      ) &&
      !(
        event.target instanceof HTMLElement &&
        event.target.classList.contains("cm-lineWrapping")
      ) &&
      !(
        event.target instanceof HTMLElement &&
        event.target.classList.contains("mdxeditor-content")
      ) &&
      !(
        event.target instanceof HTMLElement &&
        event.target.classList.contains("_textInput_sects_1201")
      )
    ) {
      event.preventDefault();
      onSubmitRef.current?.();
    }

    if (
      useCtrlSKey &&
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "s"
    ) {
      event.preventDefault();
      onSubmitRef.current?.();
    }
  }, [useEnterKey, useCtrlSKey]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className={className} id={formId}>
      {children}
      <div className="flex gap-2">
        <Button
          fullWidth
          color={"primary"}
          isDisabled={isLoading || disableSubmitButton}
          isLoading={isLoading}
          size={submitButtonSize}
          type={"submit"}
          onPress={onSubmit}>
          {isLoading ? loadingText : submitButtonText}
        </Button>
        {onReset && (
          <Button
            color={"default"}
            disabled={isLoading}
            isIconOnly={resetButtonIcon}
            size={resetButtonSize}
            type="reset"
            onPress={onReset}>
            {resetButtonIcon ? ICON_CONFIG.RECOVER : resetButtonText}
          </Button>
        )}
      </div>
    </div>
  );
}
