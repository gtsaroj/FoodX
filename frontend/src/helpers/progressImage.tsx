import React from "react";

export const ProgressiveImage = ({
  lowResSrc,
  highResSrc,
  alt,
  className,
}: {
  lowResSrc?: string;
  highResSrc: string;
  alt?: string;
  className: string;
}) => {
  const [loaded, setLoaded] = React.useState<boolean>(false);

  return (
    <img
      className={` ${loaded ? className : "bg-slate-50 border w-[100px] blur h-[70px] brightness-50 rounded-full "} `}
      src={loaded ? highResSrc : lowResSrc}
      alt={alt}
      onLoad={() => setLoaded(true)}
    />
  );
};
