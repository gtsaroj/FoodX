"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Calendar } from "../calendar";
export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState<boolean>(false);

  const reference = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    const closeModal = (event: Event) => {
      if (
        reference.current &&
        !reference.current.contains(event.target as any)
      ) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    window.addEventListener("mousedown", closeModal);

    return () => {
      window.removeEventListener("mousedown", closeModal);
    };
  }, []);

  return (
    <div ref={reference as any} className="relative">
      <button
        className={`  duration-150 rounded p-1.5 hover:bg-[var(--light-secondary-background)]   flex items-center  justify-start w-full gap-3`}
      >
        <CalendarIcon className="size-4" />

        <span className="text-[15px]">Pick a date</span>
      </button>

      <div
        className={` bg-slate-300 z-[1] top-[-2.8rem] left-[-16.1rem] rounded absolute ${
          open ? "visible" : "invisible"
        }`}
      >
         <input type="date" />
      </div>
    </div>
  );
}
