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
      className={`w-full ${className}  h-full`}
      src={loaded ? highResSrc : lowResSrc}
      alt={alt}
      style={{
        filter: loaded ? "none" : "blur(10px)",
       
        transition: "filter 0.5s ease-in-out", 
      }}
      onLoad={() => setLoaded(true)}
    />
  );
};
