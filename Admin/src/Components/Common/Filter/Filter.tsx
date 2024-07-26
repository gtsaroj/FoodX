import React from "react";
import { Edit2, FilePenLine, Filter, Trash2 } from "lucide-react";

interface ButtonType {
  type: string;
  style?: React.CSSProperties;
  value?: string;
  onClick?: (label: string, type?: string) => void;
}

export const Button: React.FC<ButtonType> = ({
  type,
  style,
  onClick,
  value,
}) => {
  return type === "Delete" ? (
    <button
      onClick={() => {
        if (!onClick) return;
        onClick(value as string, type);
      }}
      className="flex items-center w-[100px] hover:bg-[var(--danger-text)] duration-150  gap-2 text-[var(--light-text)] text-[15px] tracking-wide justify-center bg-[var(--danger-bg)] rounded-lg p-2 "
    >
      <Trash2 className="size-5" />
      {type}
    </button>
  ) : (
    <button
      onClick={() => {
        if (!onClick) return;
        onClick(value as string, type);
      }}
      className="flex items-center gap-2  w-[100px] duration-150 hover:bg-[var(--primary-dark)] text-[var(--light-text)] text-[15px] tracking-wide justify-center bg-[var(--primary-color)] rounded-lg p-2 "
      style={style}
    >
      <FilePenLine className="size-5" />

      {type}
    </button>
  );
};

interface StatusType {
  type: string[];
  onClick?: (value: string, uid: string) => void;
  uid?: string;
}

export const StatusButton: React.FC<StatusType> = ({ type, onClick, uid }) => {
  return (
    <div className="flex w-full  backdrop-blur-xl p-1 flex-col items-start justify-center gap-1 ">
      {type?.map((value) => (
        <div
          onClick={() => {
            if (!onClick) return;
            onClick(value, uid as string);
          }}
          className={`flex hover:bg-[var(--green-text)] rounded duration-150 flex-col w-[150px] bg-[var(--green-bg)] text-[var(--light-text)] p-1.5 tracking-wide `}
        >
          {value}
        </div>
      ))}
    </div>
  );
};
