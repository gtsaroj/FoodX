import React, { useEffect, useRef, useState } from "react";
import { SpecialCards } from "../Card/SpecialCards";
import { UseFetch } from "../../UseFetch";
import { ProductType } from "../../models/productMode";
import { getCategory } from "../../firebase/db";
import { getAllCategory } from "../../Services";
import { Selector } from "../Common/Selector/Selector";

export interface categoriesTagOption {
  name: string;
  id?: string;
  image: string;
}

export const MenuType: React.FC = () => {
  const [initialData, setInitialData] = useState<ProductType[]>();
  const { data } = UseFetch("/products/all");

  useEffect(() => {
    setInitialData(data);
  }, [data]);

  const [categoriesTag, setCategoriesTag] = useState<categoriesTagOption[]>();

  const [categorizedData, setCategorizedData] = useState<ProductType[]>();

  const handleEvent = (tag: string) => {
    console.log(tag);
    const filteredData = initialData?.filter(
      (singleProduct) => singleProduct.tag === tag
    );
    setCategorizedData(filteredData);
  };

  useEffect(() => {
    const CategoriesData = async () => {
      try {
        const response = await getAllCategory();
        setCategoriesTag(response);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    CategoriesData();
  }, []);

  useEffect(() => {
    if (initialData) {
      const defaultData = initialData?.filter(
        (singleProduct) => singleProduct.tag === "Burger"
      );
      setCategorizedData(defaultData);
    }
  }, [initialData]);

  return (
    <div className="flex flex-col flex-wrap gap-8 py-8 ">
      <Selector children={categoriesTag as categoriesTagOption[]} action={(tag) => handleEvent(tag)} />

      <div className="flex flex-col gap-8 rounded-md bg-[var(--light-foreground)] px-5 py-8">
        <div className="w-full p-2">
          <p className="text-2xl font-bold tracking-wider">Category Title</p>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-evenly gap-5 bg-[var(--light-background)] p-8 rounded-md flex-shrink-0">
          {categorizedData?.map((singleObject) => (
            <SpecialCards prop={singleObject} key={singleObject.id} />
          ))}
        </div>
      </div>
    </div>
  );
};
