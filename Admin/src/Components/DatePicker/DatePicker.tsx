"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Flag, X } from "lucide-react";

import { cn } from "../../../@/lib/Utils";
import { Button } from "../Common/components/ui/button";
import { Calendar } from "../Common/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../Common/components/ui/popover";

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={` w-[180px] ${
          date ? "bg-slate-200" : ""
        } duration-150 hover:text-[var(--light-text)] hover:bg-[#b4b3b3c5]  rounded py-2 border-[var(--dark-secondary-text)] border flex items-center  justify-center gap-3`}
      >
        <CalendarIcon className="size-4" />
        {date ? (
          <span className="flex items-center text-[14px] justify-center gap-2">
            {format(date, "PPP")}
            <button onClick={()=>setDate(undefined)} className=" bg-[var(--dark-foreground)] rounded-full p-1">
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
