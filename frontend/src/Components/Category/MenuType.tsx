import React, { useEffect, useState } from "react";
import { SpecialCards } from "../Card/Card.Product";
import { Product } from "../../models/product.model";
import { getCategories } from "../../Services/category.services";
import Skeleton from "react-loading-skeleton";

import {
  getProductsByTag,
  getSpecialProducts,
} from "../../Services/product.services";
import { Frown } from "lucide-react";
import { Category } from "../../models/category.model";

export interface categoriesTagOption {
  name: string;
  id?: string;
  image: string;
}

export const MenuType: React.FC = () => {
  const [initialData, setInitialData] = useState<Product[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [categoriesTag, setCategoriesTag] = useState<Category[]>([]);
  const [initialTag, setInitialTag] = useState<Category>({
    id: "",
    image: "",
    name: "",
  });

  const getMenuProducts = async () => {
    setLoading(true);
    try {
      const response = await getProductsByTag(initialTag?.id as string);
      const specialProducts = await getSpecialProducts();
      const aggregateSpecialData = specialProducts?.data?.filter(
        (product: Product) => product?.tagId === initialTag?.id
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
        if (response?.data) {
          setCategoriesTag(response.data);
          setInitialTag(response?.data[0]);
        }
      } catch (error) {
        throw new Error("Error fetching tags:" + error);
      }
    };
    CategoriesData();
  }, []);

  useEffect(() => {
    if (initialTag?.id) {
      getMenuProducts();
    }
  }, [initialTag.id]);

  const gradientColorPalette = [
    "linear-gradient(135deg, rgba(255, 223, 186, 0.8), rgba(255, 150, 100, 0.8))", // Gradient for Pizza
    "linear-gradient(135deg, rgba(255, 240, 207, 0.8), rgba(255, 200, 140, 0.8))", // Gradient for Burger
    "linear-gradient(135deg, rgba(255, 235, 205, 0.8), rgba(255, 180, 90, 0.8))", // Gradient for Biryani
    "linear-gradient(135deg, rgba(240, 248, 255, 0.8), rgba(130, 200, 255, 0.8))", // Gradient for Asian
    "linear-gradient(135deg, rgba(255, 245, 238, 0.8), rgba(255, 160, 122, 0.8))", // Gradient for Sushi
    "linear-gradient(135deg, rgba(245, 222, 179, 0.8), rgba(189, 183, 107, 0.8))", // Gradient for Salad
    "linear-gradient(135deg, rgba(250, 235, 215, 0.8), rgba(210, 105, 30, 0.8))", // Gradient for Pasta
    "linear-gradient(135deg, rgba(255, 250, 205, 0.8), rgba(255, 215, 0, 0.8))", // Gradient for Dessert
    "linear-gradient(135deg, rgba(253, 245, 230, 0.8), rgba(160, 82, 45, 0.8))", // Gradient for Drinks
    "linear-gradient(135deg, rgba(245, 245, 220, 0.8), rgba(139, 69, 19, 0.8))", // Gradient for Steak
  ];

  const interactiveTextColorPalette = [
    "#3E2723", // Deep brown for Pizza (good contrast on warm backgrounds)
    "#4B0082", // Indigo for Burger
    "#3E2723", // Deep brown for Biryani
    "#1A237E", // Navy blue for Asian
    "#8B0000", // Dark red for Sushi
    "#556B2F", // Dark olive green for Salad
    "#2F4F4F", // Dark slate gray for Pasta
    "#DAA520", // Goldenrod for Dessert
    "#4682B4", // Steel blue for Drinks
    "#4B0082", // Indigo for Steak
  ];

  return (
    <div className="flex w-full flex-col flex-wrap gap-8 py-8 ">
      <div className="w-full flex items-center  overflow-auto gap-4">
        {categoriesTag?.map((tag, index) => (
          <FoodCategory
            action={(data) => setInitialTag(data)}
            prop={tag}
            color={{
              backgroundColor: gradientColorPalette[index],
              textColor: interactiveTextColorPalette[index],
            }}
            key={tag.id}
          />
        ))}
      </div>

      <div className="flex  w-full flex-col items-start rounded-md bg-[var(--light-foreground)] px-8 gap-5  py-5">
        <p className="text-2xl  pt-4 text-[var(--dark-text)] font-bold tracking-wider">
          {initialTag?.name}
        </p>

        <div className=" w-full  flex sm:flex-row flex-col gap-8 sm:flex-wrap  sm:gap-20 sm:justify-evenly lg:justify-start items-center   ">
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
            <div className="w-full gap-4 flex sm:flex-row flex-col items-center ">
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

interface FoodCategoryProp {
  prop: Category;
  color: { textColor: string; backgroundColor: string };
  action: (data: Category) => void;
}

export const FoodCategory: React.FC<FoodCategoryProp> = ({
  prop,
  color,
  action,
}) => {
  // const { colors,dominantColor,error, loading } = useExtractColors(prop.image);

  // async function getColors(image: string) {
  //    const {colors,darkerColor, dominantColor, error,lighterColor,loading} = await useExtractColors(image)
  //    return {colors, darkerColor, dominantColor, error, lighterColor, loading}
  // }

  //  const {} = getColors(prop.image)

  return (
    <div
      onClick={() => action({ ...prop })}
      className="w-full  min-w-[180px] cursor-pointer rounded-xl overflow-hidden relative h-[240px] z-30"
      key={prop.id}
    >
      <div
        style={{
          background: color.backgroundColor,
        }}
        className="w-full bg-slate-300 hover:opacity-[0.9] duration-150 absolute z-[2] h-full"
      >
        <div className="flex -bottom-5 items-end h-full w-full z-[-1] rounded-xl justify-end overflow-hidden absolute -right-8   ">
          <img
            src={prop.image}
            className="w-[260px] scale-[1.05] h-[180px] rounded-3xl "
            alt=""
            loading="lazy"
          />
        </div>
        <h1
          style={{ color: color.textColor }}
          className="absolute top-7 left-4 tracking-wider text-[17px]  font-semibold "
        >
          {prop.name}
        </h1>
      </div>
    </div>
  );
};
