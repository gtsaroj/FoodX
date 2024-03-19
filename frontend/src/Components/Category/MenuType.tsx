import React, { useEffect, useState } from "react";
import { MenuTypes } from "./Data";
import { SpecialCards } from "../Card/SpecialCards";
import { UseFetch } from "../../UseFetch";
import { ProductType } from "../../models/productMode";

export const MenuType: React.FC = () => {
  const { data, loading, error } = UseFetch("/products/all");

  const [categorizedData, setCategorizedData] = useState<ProductType[]>();

  const handleEvent = (tag: string) => {
    const filteredData = data?.filter(
      (singleProduct) => singleProduct.tag === tag
    );
    setCategorizedData(filteredData);
  };

  useEffect(() => {
    if (data) {
      const defaultData = data?.filter(
        (singleProduct) => singleProduct.tag === "momo"
      );
      setCategorizedData(defaultData);
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex items-center gap-3 justify-evenly w-[full] py-3 ">
        {MenuTypes?.map((items, index) => (
          <div
            key={index}
            className="p-3 rounded-full cursor-pointer text-[var( --light-text)] bg-[var(--light-foreground)]"
            onClick={() => handleEvent(items.tag)}
          >
            <div className="flex flex-col items-center justify-center p-2">
              {items.tag}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-8 rounded-md bg-[var(--light-foreground)] px-5 py-8">
        <div className="w-full p-2">
          <p className="text-2xl font-bold tracking-wider">Category Title</p>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 bg-[var(--light-background)] p-8 rounded-md flex-shrink-0">
          {categorizedData?.map((singleObject) => (
            <SpecialCards prop={singleObject} key={singleObject.id} />
          ))}
        </div>
      </div>
    </div>
  );
};
