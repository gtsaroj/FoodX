import React, { useEffect, useRef, useState } from "react";
import { SpecialCards } from "../Card/ProductCard";
import { UseFetch } from "../../UseFetch";
import { ProductType } from "../../models/product.model";
import { getCategory } from "../../firebase/db";
import { getCategories } from "../../Services/category.services";
import { Selector } from "../Common/Selector/Selector";
import { LoadingContent } from "../Loader/Loader";

export interface categoriesTagOption {
  name: string;
  id?: string;
  image: string;
}

export const MenuType: React.FC = () => {
  const [initialData, setInitialData] = useState<ProductType[]>();
  const { data, loading: loader } = UseFetch("/products/all");
  const [loading, setLoading] = useState<boolean>(loader);

  useEffect(() => {
    setInitialData(data);
  }, [data]);

  const [categoriesTag, setCategoriesTag] = useState<categoriesTagOption[]>([]);

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
      setLoading(true);
      try {
        const response = await getCategories();
        console.log(response)
        setCategoriesTag(response.data);
      } catch (error) {
        throw new Error("Error fetching tags:" + error);
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
    <div className="flex w-full flex-col flex-wrap gap-8 py-8 ">
      <Selector
        children={categoriesTag as categoriesTagOption[]}
        action={(tag) => handleEvent(tag)}
      />

      <div className="flex flex-col gap-8 rounded-md bg-[var(--light-foreground)] px-5 py-8">
        <div className="w-full ">
          <p className="text-2xl font-bold tracking-wider">Category Title</p>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-evenly gap-5 bg-[var(--light-background)] p-8 rounded-md flex-shrink-0">
          {loading ? (
            <LoadingContent
              isLoading={loading}
              loadingFn={() => setLoading(false)}
            />
          ) : (
            categorizedData?.map((singleObject) => (
              <SpecialCards prop={singleObject} key={singleObject.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
