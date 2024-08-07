import { useEffect, useState } from "react";
import { LogCardProps } from "../../../models/logModel";
import {
  AlignLeft,
  ChevronDown,
  ChevronRight,
  LogOutIcon,
  MinusCircle,
  PlusCircleIcon,
  RefreshCcw,
  ShoppingBagIcon,
  UserCheck2Icon,
  UserPlus2,
} from "lucide-react";

export const LogCard: React.FC<LogCardProps> = ({
  id,
  uid,
  action,
  date,
  detail,
  name,
  profile,
  open = false,
  handleClick,
}: {
  id: string;
  uid: string;
  name: string;
  profile: string;
  action:
    | "login"
    | "register"
    | "logout"
    | "create"
    | "update"
    | "delete"
    | "checkout";
  detail?: string;
  date: Date;
  open?: boolean;
  handleClick?: (id: string) => void;
}) => {
  const icons = {
    login: <UserCheck2Icon color="green" size={15} />,
    register: <UserPlus2 color="green" size={15} />,
    logout: <LogOutIcon color="red" size={15} />,
    create: <PlusCircleIcon color="green" size={15} />,
    update: <RefreshCcw color="yellow" size={15} />,
    delete: <MinusCircle color="red" size={15} />,
    checkout: <ShoppingBagIcon color="green" size={15} />,
  };
  const titles = {
    login: "logged in.",
    register: "created new account.",
    logout: "logged out.",
    create: "added new item in database.",
    update: "updated item in database.",
    delete: "deleted item in database.",
    checkout: "ordered an item.",
  };

  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const handleCollapse = () => {
    if (handleClick) {
      handleClick(id);
      setOpenMenu(!openMenu);
    }
  };
  const newDate = new Date(date);
  return (
    <div>
      <div className="flex items-center justify-between w-full h-full gap-3 p-4 border rounded-md ">
        <div className="flex items-center justify-center gap-1">
          <div className="pr-2">
            <p className="relative">
              <AlignLeft color="var(--dark-secondary-text)" size={35} />
              <span className="absolute bottom-[-5px] right-[-5px] bg-[var(--light-foreground)] rounded-full p-1">
                {icons[`${action}`]}
              </span>
            </p>
          </div>
          <img
            src={profile}
            alt="user profile"
            className="h-[40px] rounded-full w-[40px]"
          />
          <div className="px-2">
            <p className="flex flex-wrap items-center justify-start gap-1 text-[var(--dark-secondary-text)] text-sm">
              <span>{name}</span>
              <span>{titles[`${action}`]}</span>
            </p>
            <p className="text-[var(--dark-secondary-text)] text-xs">
              {newDate?.toISOString()}
            </p>
          </div>
        </div>
        <div className="cursor-pointer" onClick={() => handleCollapse()}>
          {openMenu ? <ChevronDown /> : <ChevronRight />}
        </div>
      </div>
      {openMenu && (
        <div className="px-3 py-4 mt-0.5 text-sm border rounded-md ">
          {detail ? (
            <div className="flex flex-col items-start justify-center gap-0.5 text-sm">
              <span className="text-[var(--dark-secondary-text)] text-[10px]">
                #{uid}
              </span>
              {detail}
            </div>
          ) : (
            <div className="flex flex-col gap-0.5 justify-center items-start text-[10px] ">
              <p className="text-[var(--dark-secondary-text)]">#{uid}</p>
              <p className="flex flex-wrap items-center justify-start gap-1 text-sm text-[var(--dark-text)]">
                <span>{name}</span>
                <span>{titles[`${action}`]}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
