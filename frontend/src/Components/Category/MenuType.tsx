import React, { useEffect, useState } from "react";
import { MenuTypes } from "./Data";
import { SpecialCards } from "../Card/SpecialCards";
import { UseFetch } from "../../UseFetch";
import { ProductType } from "../../models/productMode";

export const MenuType: React.FC = () => {
  const { data, loading, error } = UseFetch("/products/all");
  const [collectionTags, setCollectionTags] = useState<[]>();

  const [categorizedData, setCategorizedData] = useState<ProductType[]>();

  const handleEvent = (tag: string) => {
    const filteredData = data?.filter(
      (singleProduct) => singleProduct.tag === tag
    );
    setCategorizedData(filteredData);
  };

  const collectionOfTags = new Set();
  data?.forEach((singleProduct) => {
    collectionOfTags.add(singleProduct.tag);
  });

  const TagsArray = Array.from(collectionOfTags);

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
        {TagsArray?.map((items: any, index) => (
          <div
            onClick={() => handleEvent(items)}
            key={index}
            className=" shadow-black shadow-sm py-1 rounded-full h-[60px] sm:h-full sm:py-3 sm:rounded-md cursor-pointer hover:bg-[#8a849571] bg-[var(--dark-secondary-text)]   flex flex-col text-sm sm:text-[15px] w-full sm:w-[100px]  items-center justify-center  px-2"
          >
            {items}
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
