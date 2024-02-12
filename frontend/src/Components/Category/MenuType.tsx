import React, { useState } from "react";
import { MenuCategory, category } from "./Data";
import { Pizza, CoffeeIcon } from "lucide-react";
import Card from "../Card/Card";
import { DataType, menuType } from "./Data";

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
    <div className="flex flex-col gap-[20px] py-[100px]">
      <div className="flex items-center gap-[10px] justify-evenly w-[full] py-[7px] -bg--dark-secondary-text rounded-sm ">
        {Items?.map((items) => (
          <div
            key={items.id}
            className="font-Poppins text-[15px] -text--light-text -bg--primary-color rounded-md   py-[6px] px-[9px] w-[150px] cursor-pointer"
            onClick={() => ChangedCategory(items.id)}
          >
            <div className="flex flex-col items-center justify-between">
              <CoffeeIcon className="w-[30px] h-[32px]" />
              <div className="text-[10px]"> {items.type}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-[20px]">
        {Data?.map((singleObject) => (
          <Card prop={singleObject} key={singleObject.id} />
        ))}
      </div>
    </div>
  );
};
