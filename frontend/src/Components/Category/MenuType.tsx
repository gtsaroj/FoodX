import React, { useEffect, useState } from "react";
import { SpecialCards } from "../Card/Card.Product";
import { Product } from "../../models/product.model";
import { getCategories } from "../../Services/category.services";
import { Selector } from "../Common/Selector/Selector";
import Skeleton from "react-loading-skeleton";
import {
  getProductsByTag,
  getSpecialProducts,
} from "../../Services/product.services";
import { Frown } from "lucide-react";

export interface categoriesTagOption {
  name: string;
  id?: string;
  image: string;
}

export const MenuType: React.FC = () => {
  const [initialData, setInitialData] = useState<Product[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [categoriesTag, setCategoriesTag] = useState<categoriesTagOption[]>([]);
  const [initialTag, setInitialTag] = useState<string>("Burger");

  const getMenuProducts = async () => {
    setLoading(true);
    try {
      const response = await getProductsByTag(initialTag);
      const specialProducts = await getSpecialProducts();
      const aggregateSpecialData = specialProducts?.data?.filter(
        (product: Product) => product.tagId === initialTag
      );
      setInitialData([...response.data, ...aggregateSpecialData]);
    } catch (error) {
      throw new Error("Error while getting products by tag" + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const CategoriesData = async () => {
      setLoading(true);
      try {
        const response = await getCategories();
        setCategoriesTag(response.data);
        setInitialTag(response.data[0].id);
      } catch (error) {
        throw new Error("Error fetching tags:" + error);
      }
    };
    CategoriesData();
  }, []);

  useEffect(() => {
    console.log(initialTag);
    getMenuProducts();
  }, [initialTag]);

  return (
    <div className="flex w-full flex-col flex-wrap gap-8 py-8 ">
      <Selector
        children={categoriesTag as categoriesTagOption[]}
        action={(tagId) => setInitialTag(tagId)}
      />

      <div className="flex flex-col items-start rounded-md bg-[var(--light-foreground)] px-8 gap-5  py-5">
          <p className="text-2xl px-5 pt-4 text-[var(--dark-text)] font-bold tracking-wider">
            Category Title
          </p>
    
        <div className="flex flex-wrap items-center justify-center md:justify-start  gap-20 p-5 rounded-md flex-shrink-0">
          {!loading ? (
            initialData?.length <= 0 ? (
              <div className="w-full flex flex-col items-center justify-center text-center p-4">
                <Frown className="size-32 text-[var(--dark-secondary-text)] " />
                <h2 className="text-xl text-[var(--dark-text)] font-semibold mb-2">
                  No Products Found
                </h2>
                <p className="text-gray-500">
                  Sorry, we couldn't find any products in this category. Please
                  try searching for something else.
                </p>
              </div>
            ) : (
              initialData?.map((singleObject, index) => (
                <SpecialCards prop={singleObject} key={index} />
              ))
            )
          ) : (
            <div className="w-full gap-4 flex ">
              <Skeleton
                height={230}
                width={330}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
              <Skeleton
                height={230}
                width={330}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
              <Skeleton
                height={230}
                width={330}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
              <Skeleton
                height={230}
                width={330}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
