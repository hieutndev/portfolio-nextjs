"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import AccountForm from "./account-form";
import { TAccount } from "@/types/account";

interface ModalAccountFormProps {
    title: string;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    mode: "create" | "update";
    accountId?: number;
    defaultValues?: Partial<TAccount>;
    onSuccess: () => void;
}

export default function ModalAccountForm({
    title,
    isOpen,
    onOpenChange,
    mode,
    accountId,
    defaultValues,
    onSuccess,
}: ModalAccountFormProps) {
    const handleSuccess = () => {
        onSuccess();
        onOpenChange(false);
    };

    return (
        
    );
}
