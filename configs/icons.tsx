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
	FaGithub
} from "react-icons/fa6";
import { MdDelete, MdDeleteForever, MdEdit } from "react-icons/md";
import { LuGlobe } from "react-icons/lu";
import { BsShieldLockFill } from "react-icons/bs";
import { IoGrid } from "react-icons/io5";
import { PiCertificateFill } from "react-icons/pi";
import {
	HiChevronDoubleLeft,
	HiChevronDoubleRight,
	HiChevronLeft,
	HiChevronRight
} from "react-icons/hi2";
import { FcConferenceCall, FcDepartment, FcDiploma1, FcGraduationCap, FcOpenedFolder, FcPortraitMode, FcTemplate, FcWorkflow } from "react-icons/fc";

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
	// DASHBOARD: <IoGrid />,
	DASHBOARD: <FcTemplate size={24} />,
	// ACCOUNT: <FaUserGroup />,
	ACCOUNT: <FcConferenceCall size={24} />,
	// EDUCATION: <FaGraduationCap />,
	EDUCATION: <FcGraduationCap size={24} />,
	// CERTIFICATION: <PiCertificateFill />,
	CERTIFICATION: <PiCertificateFill size={24} />,
	// EMPLOYMENT: <FaBuilding />,
	EMPLOYMENT: <FcDepartment size={24} />,
	// PROJECT: <FaFileCode />,
	PROJECT: <FcOpenedFolder size={24} />,
	// APP: <FaFileCode />,
	APP: <FcWorkflow size={24} />,
	// Search and Pagination Icons
	SEARCH: <FaMagnifyingGlass />,
	PAGINATION_FIRST: <HiChevronDoubleLeft />,
	PAGINATION_PREVIOUS: <HiChevronLeft />,
	PAGINATION_NEXT: <HiChevronRight />,
	PAGINATION_LAST: <HiChevronDoubleRight />,
	GITHUB: <FaGithub />,
	LIVE_DEMO: <LuGlobe />,
};

export default ICON_CONFIG;
