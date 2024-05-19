import React from "react";
import FoodItemCategory from "./FoodItemCategory";
import FoodPage from "./FoodPage";

const FoodList : React.FC = () => {
  return (
    <div className="container flex items-start justify-start ">
      <FoodItemCategory />
      <FoodPage />
    </div>
  );
};

export default FoodList;
