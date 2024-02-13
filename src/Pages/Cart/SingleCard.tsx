
import React, { useState } from "react";
import { UseDispatch, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Reducer/Store";
import { ProductType, addToCart } from "../../Reducer/CardReducer";

interface SingleCardProp {
  prop: ProductType;
}

const SingleCard: React.FC<SingleCardProp> = ({ prop }: SingleCardProp) => {
  const [InitialQuantity, setInitialQuantity] = useState<number>(1);

  const dispatch: AppDispatch = useDispatch();
  console.log(prop);

  return (
    <div
      className="flex gap-[5px] items-center  h-[80px]  w-[300px] bg-[var(--light-background)] rounded-lg"
      key={prop.id}
    >
      <div>
        <img
          className="w-[100px]  h-[70px] rounded-lg"
          src={prop.image}
          alt=""
        />
      </div>
      <div className="flex flex-col items-stretch justify-between gap-[2px] py-5">
        <h3 className=" text-[18px] font-Poppins -text--dark-text">
          {prop.title}
        </h3>
        <h3 className="text-[12px] font-Poppins -text--dark-secondary-text] ">
          {prop.price}
        </h3>
        <div className="flex gap-[40px]  items-center ">
          <div className="flex gap-[4px] text-[14px] font-Poppins">
            <button
              onClick={() =>
                dispatch(
                  addToCart({
                    id: prop.id,
                    quantity: prop.quantity === 1 ? 1 : -InitialQuantity,
                  })
                )
              }
              className=" h-[25px] flex items-center justify-center  text-[10px] font-bold -bg--dark-secondary-text  w-[25px] py-[4px] px-[6px] rounded-full  text-center"
            >
              -
            </button>
            <h3 className="w-[25px] h-[25px] rounded-full flex justify-center items-center -bg--dark-secondary-text ">
              {prop.quantity}
            </h3>
            <button
              onClick={() =>
                dispatch(
                  addToCart({
                    id: prop.id,
                    quantity: +1,
                  })
                )
              }
              className=" h-[25px] justify-center flex items-center text-[10px]  w-[25px] font-bold -bg--dark-secondary-text py-[4px] px-[6px] rounded-full  text-center"
            >
              +
            </button>
          </div>
          <h3 className="text-[12px]  flex items-center justify-center font-Poppins -bg--dark-secondary-text w-[60px] px-[3px] py-[2px] rounded-sm">
            {" "}
            {prop.quantity} × {prop.price}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default SingleCard;
