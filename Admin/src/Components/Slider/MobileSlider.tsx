import React, { ReactNode, useEffect } from "react";
import collegeLogo from "../../assets/logo/texas.png";
import { Menu, X } from "lucide-react";

interface SliderProp {
  close?: boolean;
  closeNavbar?: () => void;
  children?: ReactNode;
}

const MobileSlider: React.FC<SliderProp> = ({
  close,
  closeNavbar,
  children,
}) => {
    console.log(close)

  useEffect(() => {}, [close]);
    return <div className={` sticky top-0 shadow-md  flex flex-col items-end justify-center transition-all `}>
        <button className="absolute top-2 right-2" onClick={closeNavbar}>
             <X/>
          </button>
        {children}</div>;
};

export default MobileSlider;
