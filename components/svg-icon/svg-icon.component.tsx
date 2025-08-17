import { ComponentPropsWithoutRef, forwardRef } from "react";
// Import the FontAwesome and FontAwesome6 icons
import * as FaIcons from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";
import * as Lu6Icons from "react-icons/lu";
import * as Fi6Icons from "react-icons/fi";
import * as MdIcons from "react-icons/md";
import * as MbIcons from "react-icons/tb";
import * as BsIcons from "react-icons/bs";
import * as RiIcons from "react-icons/ri";
import * as AiOutIcons from "react-icons/ai";
import * as BiSolidIcons from "react-icons/bi";
import * as TiCameraIcons from "react-icons/ti";
import * as IoChatIcons from "react-icons/io5";
import * as LocationMarkerIcons from "react-icons/hi";

import { TbLayoutNavbarCollapse, TbCalendarStar } from "react-icons/tb";

// Define allowed icon names (including both fa and fa6 icons)
type IconName =
  | "FaArrowLeft"
  | "RiHome5Line"
  | "TbCalendarStar"
  | "BsQrCodeScan"
  | "TbUserHexagon"
  | "TbEyeOff"
  | "TbEye"

  // Add any icons from Fa6 here as well
  | "Fa6SomeIcon" // Example of a Fa6 icon name you may add here.
  | "TbLayoutNavbarCollapse"
  | "LuLayoutDashboard";

interface ISvgIcon extends ComponentPropsWithoutRef<"svg"> {
  iconName: IconName; // Ensure only valid icon names are accepted
  className?: string; // Custom class for additional styling
  color?: string; // Optional color for the icon
  size?: string | number; // Optional size (e.g., "24px" or 24)
}

const SvgIcon = forwardRef<HTMLDivElement, ISvgIcon>(
  (
    { iconName, className, color = "#565656", size = "1em", ...otherProps },
    ref
  ) => {
    // Dynamically select the icon component from either FaIcons or Fa6Icons
    const IconComponent =
      FaIcons[iconName as keyof typeof FaIcons] ||
      Fa6Icons[iconName as keyof typeof Fa6Icons] ||
      Lu6Icons[iconName as keyof typeof Lu6Icons] ||
      BsIcons[iconName as keyof typeof BsIcons] ||
      Fi6Icons[iconName as keyof typeof Fi6Icons] ||
      MbIcons[iconName as keyof typeof MbIcons] ||
      MdIcons[iconName as keyof typeof MdIcons] ||
      RiIcons[iconName as keyof typeof RiIcons] ||
      AiOutIcons[iconName as keyof typeof AiOutIcons] ||
      BiSolidIcons[iconName as keyof typeof BiSolidIcons] ||
      TiCameraIcons[iconName as keyof typeof TiCameraIcons] ||
      IoChatIcons[iconName as keyof typeof IoChatIcons] ||
      LocationMarkerIcons[iconName as keyof typeof LocationMarkerIcons] ||
      TbLayoutNavbarCollapse;
    TbCalendarStar;

    return (
      <div ref={ref} className={className || ""}>
        <IconComponent
          {...otherProps}
          style={{ color, fontSize: size }}
          className={className}
        />
      </div>
    );
  }
);

SvgIcon.displayName = "SvgIcon";

export default SvgIcon;
