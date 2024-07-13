"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Calendar } from "../Common/components/ui/calendar";
export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={` duration-150 w-[180px] ${
          date ? "bg-[var(--primary-dark)] " : ""
        } duration-150 bg-[var(--primary-color)] text-[var(--light-text)] hover:bg-[var(--primary-light)] hover:border-[var(--primary-light)] rounded py-2 border-[var(--dark-secondary-text)] border flex items-center  justify-center gap-3`}
      >
        <CalendarIcon className="size-4" />
        {date ? (
          <span className="flex items-center text-[14px] justify-center gap-2">
            {format(date, "PPP")}
            <button
              onClick={() => setDate(undefined)}
              className=" bg-[var(--dark-foreground)] rounded-full p-1"
            >
              {" "}
              <X className=" text-[var(--light-text)] size-3" />
            </button>{" "}
          </span>
        ) : (
          <span className="text-[15px]">Pick a date</span>
        )}
      </button>

      <div
        className={` bg-slate-300 z-[1] top-10 right-0 rounded absolute ${
          open ? "visible" : "invisible"
        }`}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </div>
    </div>
  );
}
