import React, { useEffect, useRef, useState } from "react";
import { SpecialCards } from "../Card/SpecialCards";
import { UseFetch } from "../../UseFetch";
import { ProductType } from "../../models/productMode";
import { getCategory } from "../../firebase/db";

interface categoriesTagOption {
  tag: string;
  photoUrl: string;
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
    const filteredData = initialData?.filter(
      (singleProduct) => singleProduct.tag === tag
    );
    setCategorizedData(filteredData);
  };

  const collectionOfTags = new Set();
  initialData?.forEach((singleProduct) => {
    collectionOfTags.add(singleProduct.tag);
  });

  const TagsArray = getCategory("bnw");

  useEffect(() => {
    const CategoriesData = async () => {
      try {
        const res = await TagsArray;
        const categoryTags = await Promise.all(
          Object.keys(res.icons).map(async (singleCategory) => {
            const categoryImg = await getCategory("bnw");
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
    if (initialData) {
      const defaultData = initialData?.filter(
        (singleProduct) => singleProduct.tag === "momo"
      );
      setCategorizedData(defaultData);
    }
  }, [initialData]);

  return (
    <div className="flex flex-col flex-wrap gap-8 py-8 ">
      <div className="flex flex-wrap h-full gap-3 px-3 justify-evenly ">
        {categoriesTag?.map((items: categoriesTagOption, index) => (
          <div
            onClick={() => handleEvent(items.tag.split("_").join(" "))}
            key={index}
            className=" py-3 sm:h-full  sm:rounded-md cursor-pointer flex flex-col gap-2 text-sm sm:text-[15px] flex-wrap  items-center justify-center "
          >
            <div className=" bg-[#dbd9e462]  hover:bg-[#8a84953a]  p-3 rounded-md">
              <img className=" w-[40px] h-[40px] " src={items.photoUrl} />
            </div>
            <p className="sm:text-[16px]  text-[12px]">
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
