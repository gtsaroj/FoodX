import React, { useEffect, useState } from "react";
import { MenuTypes } from "./Data";
import { SpecialCards } from "../Card/SpecialCards";
import { UseFetch } from "../../UseFetch";
import { ProductType } from "../../models/productMode";
import { getCategory } from "../../firebase/db";

interface categoriesTagOption {
  tag: string;
  photoUrl: string;
}

export const MenuType: React.FC = () => {
  const { data, loading, error } = UseFetch("/products/all");
  const [collectionTags, setCollectionTags] = useState<[]>();
  const [categoriesTag, setCategoriesTag] = useState<categoriesTagOption[]>();

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

  const TagsArray = getCategory("color");

  useEffect(() => {
    const CategoriesData = async () => {
      try {
        const res = await TagsArray;
        const categoryTags = await Promise.all(
          Object.keys(res.icons).map(async (singleCategory) => {
            const categoryImg = await getCategory("color");
            return {
              tag: singleCategory,
              photoUrl:
                categoryImg.icons[
                  singleCategory as keyof typeof categoryImg.icons
                ],
            };
          })
        );
        setCategoriesTag(categoryTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    CategoriesData();
  }, []);

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
      <div className="flex items-center sm:gap-3 gap-1 sm:justify-evenly justify-center w-[full] py-3 ">
        {categoriesTag?.map((items: categoriesTagOption, index) => (
          <div
            onClick={() => handleEvent(items.tag.split("_").join(" "))}
            key={index}
            className=" py-1  rounded-full h-[60px] sm:h-full  sm:rounded-md cursor-pointer flex flex-col gap-2 text-sm sm:text-[15px] w-full sm:w-[100px]  items-center justify-center "
          >
            <div className="bg-[#8a849571]  p-3 rounded-full">
              <img
                className="sm:w-[40px] w-[30px] sm:h-[40px] h-[30px] "
                src={items.photoUrl}
              />
            </div>
            <p className="sm:text-[16px] text-[12px]">
              {items.tag.split("_").join(" ")}
            </p>
          </div>
        ))}
      </div>
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
