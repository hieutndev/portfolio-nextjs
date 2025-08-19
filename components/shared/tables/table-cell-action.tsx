import { Button, ButtonProps } from "@heroui/react";

import ICON_CONFIG from "@/configs/icons";

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
					isIconOnly
					color={"success"}
					size={buttonSize}
					onPress={onRecover}
				>
					{ICON_CONFIG.RECOVER}
				</Button>

				<Button
					isIconOnly
					color={"danger"}
					size={buttonSize}
					onPress={onPermanentDelete}
				>
					{ICON_CONFIG.PERMANENT_DELETE}
				</Button>
			</>
		) : (
			<>
				{showViewButton && (
					<Button
						isIconOnly
						color={"secondary"}
						size={buttonSize}
						onPress={onViewDetails}
					>
						{ICON_CONFIG.VIEW}
					</Button>
				)}
				<Button
					isIconOnly
					color={"warning"}
					size={buttonSize}
					onPress={onEdit}
				>
					{ICON_CONFIG.EDIT}
				</Button>

				<Button
					isIconOnly
					color={"danger"}
					size={buttonSize}
					onPress={onSoftDelete}
				>
					{ICON_CONFIG.SOFT_DELETE}
				</Button>
			</>
		)}
	</div>
);

export default TableCellAction;
