import { Sun, User2Icon } from "lucide-react";

const Navbar = () => {
  return (
    <div className="w-full border-b-2 border-[var(--light-background)] h-[80px] flex justify-between items-center gap-5 px-3 py-4">
      <h1 className="px-3 text-2xl">
        Welcome back,{" "}
        <span className="font-semibold tracking-wide">Aayush</span>
      </h1>
      <div className="flex items-center justify-center gap-3">
        <div className="cursor-pointer">
          <Sun size={25} />
        </div>
        <div className="cursor-pointer">
          <User2Icon size={25} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
