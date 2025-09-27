import { Modal, ModalContent, ModalHeader, ModalBody, Input } from "@heroui/react";

import CustomForm from "@/components/shared/forms/custom-form";

interface ModalCreateUpdateProjectGroupProps {
	title: string;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	defaultValue: string;
	onUpdateValue: (value: string) => void;
	onSubmit: () => void;
}

export default function ModalCreateUpdateProjectGroup({
	title,
	isOpen,
	onOpenChange,
	defaultValue,
	onUpdateValue,
	onSubmit,
}: ModalCreateUpdateProjectGroupProps) {
	return (
		<Modal
			hideCloseButton
			isOpen={isOpen}
			placement="top"
			onOpenChange={onOpenChange}

		>
			<ModalContent>
				<ModalHeader>
					<h6 className={"text-xl"}>{title}</h6>
				</ModalHeader>
				<ModalBody>
					
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
