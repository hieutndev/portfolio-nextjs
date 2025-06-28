import {
	FaAngleLeft,
	FaAngleRight,
	FaArrowRotateLeft,
	FaBan,
	FaBars,
	FaBuilding,
	FaEye,
	FaFileCode,
	FaFloppyDisk,
	FaGraduationCap,
	FaLockOpen,
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

const ICON_CONFIG = {
	MENU: <FaBars />,
	BACK: <FaAngleLeft />,
	NEXT: <FaAngleRight />,
	NEW: <FaPlus />,
	EDIT: <MdEdit />,
	VIEW: <FaEye />,
	SOFT_DELETE: <MdDelete />,
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
};

export default ICON_CONFIG;
