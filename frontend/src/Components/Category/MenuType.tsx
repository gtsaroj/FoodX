import React, { useState } from "react";
import { MenuCategory, category } from "./Data";
import { CoffeeIcon } from "lucide-react";
import { DataType, menuType } from "./Data";
import { SpecialCards } from "../Card/SpecialCards";

export const MenuType: React.FC = () => {
  const [Data, setData] = useState<DataType[]>(category[0]?.data);
  const [Items, setItems] = useState<menuType[]>(MenuCategory);

  const ChangedCategory = (id: any) => {
    category.filter((data): void => {
      if (data.type === Items[id].type) {
        setData(data.data);
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex items-center gap-3 justify-evenly w-[full] py-3 ">
        {Items?.map((items) => (
          <div
            key={items.id}
            className="p-3 rounded-full cursor-pointer text-[var( --light-text)] bg-[var(--light-foreground)]"
            onClick={() => ChangedCategory(items.id)}
          >
            <div className="flex flex-col items-center justify-center p-2">
              <img src={items.icon} className="max-h-[50px] mix-blend-darken" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-8 rounded-md bg-[var(--light-foreground)] px-5 py-8">
        <div className="w-full p-2">
          <p className="text-2xl font-bold tracking-wider">Category Title</p>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 bg-[var(--light-background)] p-8 rounded-md flex-shrink-0">
          {Data?.map((singleObject , index) => (
            <SpecialCards slides={singleObject} key={index} color="primary" />
          ))}
        </div>
      </div>
    </div>
  );
};
