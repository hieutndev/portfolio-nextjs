import {
	FaAngleLeft,
	FaAngleRight,
	FaArrowRotateLeft,
	FaBan,
	FaBars,
	FaBuilding,
	FaEllipsisVertical,
	FaEye,
	FaFileCode,
	FaFloppyDisk,
	FaGraduationCap,
	FaLockOpen,
	FaMagnifyingGlass,
	FaPlus,
	FaPowerOff,
	FaUserGroup,
	FaUserShield,
	FaXmark,
} from "react-icons/fa6";
import { MdDelete, MdDeleteForever, MdEdit } from "react-icons/md";
import { BsShieldLockFill } from "react-icons/bs";
import { IoGrid } from "react-icons/io5";
import { PiCertificateFill } from "react-icons/pi";
import {
	HiChevronDoubleLeft,
	HiChevronDoubleRight,
	HiChevronLeft,
	HiChevronRight
} from "react-icons/hi2";

const ICON_CONFIG = {
	MENU: <FaBars />,
	BACK: <FaAngleLeft />,
	NEXT: <FaAngleRight />,
	NEW: <FaPlus />,
	EDIT: <MdEdit />,
	VIEW: <FaEye />,
	EYE: <FaEye />,
	MORE: <FaEllipsisVertical />,
	SOFT_DELETE: <MdDelete />,
	DELETE: <MdDeleteForever />,
	PERMANENT_DELETE: <MdDeleteForever />,
	RECOVER: <FaArrowRotateLeft />,
	AUTH: <FaUserShield />,
	UNAUTH: <BsShieldLockFill />,
	// LOG_OUT: <FaArrowRightFromBracket className={"-scale-x-100"} />,
	LOG_OUT: <FaPowerOff />,
	BLOCK: <FaBan />,
	UNBLOCK: <FaLockOpen />,
	CLOSE: <FaXmark />,
	SAVE: <FaFloppyDisk />,
	DASHBOARD: <IoGrid />,
	ACCOUNT: <FaUserGroup />,
	EDUCATION: <FaGraduationCap />,
	CERTIFICATION: <PiCertificateFill />,
	EMPLOYMENT: <FaBuilding />,
	PROJECT: <FaFileCode />,
	APP: <FaFileCode />,
	// Search and Pagination Icons
	SEARCH: <FaMagnifyingGlass />,
	PAGINATION_FIRST: <HiChevronDoubleLeft />,
	PAGINATION_PREVIOUS: <HiChevronLeft />,
	PAGINATION_NEXT: <HiChevronRight />,
	PAGINATION_LAST: <HiChevronDoubleRight />,
};

export default ICON_CONFIG;
