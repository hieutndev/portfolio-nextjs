import ICON_CONFIG from "@/configs/icons";
import { Button, ButtonProps } from "@heroui/react";

interface TableCellActionProps {
	mode: boolean;
	showViewButton?: boolean;
	buttonSize?: ButtonProps["size"];
	onRecover?: () => void;
	onPermanentDelete?: () => void;
	onSoftDelete?: () => void;
	onEdit?: () => void;
	onViewDetails?: () => void;
}

const TableCellAction = ({
	mode,
	showViewButton = false,
	buttonSize = "md",
	onRecover,
	onSoftDelete,
	onPermanentDelete,
	onEdit,
	onViewDetails,
}: TableCellActionProps) => (
	<div className={"flex justify-center items-center gap-1"}>
		{mode ? (
			<>
				<Button
					size={buttonSize}
					color={"success"}
					isIconOnly
					onPress={onRecover}
				>
					{ICON_CONFIG.RECOVER}
				</Button>

				<Button
					size={buttonSize}
					color={"danger"}
					isIconOnly
					onPress={onPermanentDelete}
				>
					{ICON_CONFIG.PERMANENT_DELETE}
				</Button>
			</>
		) : (
			<>
				{showViewButton && (
					<Button
						size={buttonSize}
						color={"secondary"}
						isIconOnly
						onPress={onViewDetails}
					>
						{ICON_CONFIG.VIEW}
					</Button>
				)}
				<Button
					size={buttonSize}
					color={"warning"}
					isIconOnly
					onPress={onEdit}
				>
					{ICON_CONFIG.EDIT}
				</Button>

				<Button
					size={buttonSize}
					color={"danger"}
					isIconOnly
					onPress={onSoftDelete}
				>
					{ICON_CONFIG.SOFT_DELETE}
				</Button>
			</>
		)}
	</div>
);

export default TableCellAction;
