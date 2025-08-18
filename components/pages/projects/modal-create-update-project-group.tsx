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
					<CustomForm
						className={"flex flex-col gap-4 pb-4"}
						formId={"crudForm"}
						onSubmit={onSubmit}
					>
						<Input
							isRequired={true}
							label={"Group Title"}
							labelPlacement={"outside"}
							name={"group_title"}
							placeholder={"Enter project group title"}
							type={"text"}
							value={defaultValue}
							variant={"bordered"}
							onValueChange={onUpdateValue}
						/>
					</CustomForm>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
