import { ChevronDown, Moon, SunMoon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MdDisplaySettings } from "react-icons/md";

const mode = [
  {
    name: "Dark",
    icon: <Moon className="size-5 " />,
  },
  {
    name: "Light",
    icon: <SunMoon className="size-5 " />,
  },
];

export const DarkMode = () => {
  const [displayMode, setDisplayMode] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const modeReference = useRef<HTMLDivElement | null>(null);

  function displayModeFn(type: string) {
    setDisplayMode(type);
    setOpen(false);
  }

  useEffect(() => {
    const closeModal = (event: MouseEvent) => {
      if (
        modeReference.current &&
        !modeReference.current.contains(event.target as Node)
      ) {
        setOpen(!open);
      }
    };
    if (open) {
      document.addEventListener("mousedown", closeModal);
    }

    return () => {
      document.removeEventListener("mousedown", closeModal);
    };
  },[open]);

  useEffect(() => {
    const windowPreference = window.matchMedia("(prefers-color-scheme: dark)");

    // Set the initial mode based on system preference if no user selection is made
    if (!displayMode) {
      setDisplayMode(windowPreference.matches ? "Dark" : "Light");
    }
    const handleChange = (e: MediaQueryListEvent) => {
      if (!displayMode) {
        setDisplayMode(e.matches ? "Dark " : "Light ");
      }
    };

    windowPreference.addEventListener("change", handleChange);

    if (displayMode === "Dark") {
      document.body.classList.add("dark");
    } else if (displayMode === "Light") {
      document.body.classList.remove("dark");
    }

    return () => windowPreference.removeEventListener("change", handleChange);
  }, [displayMode]);

  return (
    <div ref={modeReference} className="w-full relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]    w-full p-3 rounded duration-150 "
      >
        <MdDisplaySettings className="size-5" />
        <p> Mode</p>
        <span>
          <ChevronDown
            className={`size-5 ${open ? "rotate-180" : ""}  duration-150`}
          />
        </span>
      </button>
      <div 
        className={`w-full border-[1px] border-[var(--dark-border)] p-1 duration-150 ${
          open
            ? "visible translate-y-1 opacity-100 "
            : "invisible translate-y-0 opacity-0"
        } absolute bg-[var(--body-bg)] top-14  z-[1000]   flex flex-col rounded-lg items-start justify-center gap-3`}
      >
        {mode?.map((type) => (
          <button
            onClick={() => displayModeFn(type.name)}
            className="text-[15.5px] rounded-lg duration-150 w-full py-2 text-[var(--dark-secondary-text)]  hover:bg-[var(--light-background)] px-5  gap-5   flex items-center justify-start "
          >
            {type.name}
            {type.icon}
          </button>
        ))}
      </div>
    </div>
  );
};
