import CustomForm from "@/components/shared/forms/custom-form";
import ICON_CONFIG from "@/configs/icons";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Input, ModalFooter } from "@heroui/react";

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
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			placement="top"
		>
			<ModalContent>
				<ModalHeader>
					<h6 className={"text-xl"}>{title}</h6>
				</ModalHeader>
				<ModalBody>
					<CustomForm
						formId={"crudForm"}
						onSubmit={onSubmit}
						className={"flex flex-col gap-4 pb-4"}
					>
						<Input
							label={"Group Title"}
							isRequired={true}
							value={defaultValue}
							onValueChange={onUpdateValue}
							type={"text"}
							labelPlacement={"outside"}
							placeholder={"Enter project group title"}
							variant={"bordered"}
							name={"group_title"}
							autoFocus
						/>
					</CustomForm>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
