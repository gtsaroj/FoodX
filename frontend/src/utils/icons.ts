import { MdHistory, MdLightMode, MdDarkMode } from "react-icons/md";
import { GiRingingBell } from "react-icons/gi";
import { IoLogOutOutline } from "react-icons/io5";
import { FaHeart, FaXTwitter } from "react-icons/fa6";
import { RiMenu2Line } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { FaCloudDownloadAlt, FaPaperPlane, FaUserCircle } from "react-icons/fa";
import { IoSettings, IoBagCheckOutline } from "react-icons/io5";
import { CgUnavailable } from "react-icons/cg";
import {
  FaEdit,
  FaFrown,
  FaMinus,
  FaPlus,
  FaTrashRestore,
  FaShoppingCart,
  FaRedoAlt,
  FaClock,
  FaInstagramSquare,
  FaFacebook,
  FaLinkedin,
  FaMapMarker,
  FaPhoneAlt,
  FaTimes,
  FaHome,
  FaUserEdit,
} from "react-icons/fa";
import { LuEyeClosed, LuEye } from "react-icons/lu";
import {
  MdOutlineDisplaySettings,
  MdShoppingBag,
  MdEmail,
} from "react-icons/md";
import {
  FaCircleChevronDown,
  FaCircleChevronLeft,
  FaCircleChevronRight,
  FaCircleChevronUp,
} from "react-icons/fa6";

export const FontAwesomeIcons = {
  logout: IoLogOutOutline,
  history: MdHistory,
  delete: FaTrashRestore,
  displaySetting: MdOutlineDisplaySettings,
  chevronDown: FaCircleChevronDown,
  chevronLeft: FaCircleChevronLeft,
  chevronRight: FaCircleChevronRight,
  chevronUp: FaCircleChevronUp,
  bell: GiRingingBell,
  darkMode: MdDarkMode,
  lightMode: MdLightMode,
  plus: FaPlus,
  minus: FaMinus,
  shoppingBag: MdShoppingBag,
  shoppingCart: FaShoppingCart,
  heart: FaHeart,
  redo: FaRedoAlt,
  clock: FaClock,
  twitter: FaXTwitter,
  instagram: FaInstagramSquare,
  facebook: FaFacebook,
  linkedin: FaLinkedin,
  mapMarker: FaMapMarker,
  email: MdEmail,
  phone: FaPhoneAlt,
  menu: RiMenu2Line,
  close: FaTimes,
  search: FiSearch,
  user: FaUserCircle,
  setting: IoSettings,
  cartCheckout: IoBagCheckOutline,
  avoid: CgUnavailable,
  home: FaHome,
  eyeOpen: LuEye,
  eyeClose: LuEyeClosed,
  userEdit: FaUserEdit,
  frown: FaFrown,
  edit: FaEdit,
  send: FaPaperPlane,
  download : FaCloudDownloadAlt
};

export const Icons = {
  ...FontAwesomeIcons,
};
