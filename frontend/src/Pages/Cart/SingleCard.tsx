import { useState } from "react";
import { ProductType, addToCart } from "../../Reducer/CardReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Reducer/Store";

interface SingleCardProp {
  prop: ProductType;
}

export const SingleCard: React.FC<SingleCardProp> = ({
  prop,
}: SingleCardProp) => {
  console.log(prop);
  const [InitialQuantity, setInitialQuantity] = useState<number>(1);
  const dispatch: AppDispatch = useDispatch();

  return (
    <div className="flex gap-3 items-center h-[120px] w-full bg-[var(--light-foreground)] shadow-sm rounded-md ">
      <div>
        <img
          className="w-[120px]  h-[120px] object-cover shrink-0 object-center rounded-l-lg"
          src={prop.image}
          alt=""
        />
      </div>
      <div className="flex flex-col gap-2 px-3 justfy-between">
        <p className="text-xl text-[var(--dark-text)] font-bold tracking-wide">
          {prop.title}
        </p>
        <p className="text-sm text-[var(--dark-secondary-text)] ">
          Rs {prop.price}
        </p>
        <div className="flex gap-[40px]  items-center ">
          <div className="flex gap-2 text-md text-[var(--primary-color)]">
            <button
              onClick={() =>
                dispatch(
                  addToCart({
                    id: prop.id,
                    quantity: prop.quantity < 1 ? 1 : -1,
                  })
                )
              }
              className=" h-[25px] flex items-center justify-center  text-[10px] font-bold text-lg   w-[25px] py-[4px] px-[6px] rounded-full  text-center hover:bg-[var(--primary-color)] hover:text-[var(--light-text)]"
            >
              -
            </button>
            <p className="w-[25px] h-[25px] text-sm rounded-full flex justify-center items-center   ">
              {" "}
              {prop.quantity}
            </p>
            <button
              onClick={() =>
                dispatch(
                  addToCart({
                    id: prop.id,
                    quantity: +1,
                  })
                )
              }
              className=" h-[25px] justify-center flex items-center text-[10px] text-lg  w-[25px] font-bold  py-[4px] px-[6px] rounded-full  text-center hover:bg-[var(--primary-color)] hover:text-[var(--light-text)]"
            >
              +
            </button>
          </div>
          <p className=" text-sm  flex items-center justify-center  w-[60px] px-[3px] py-[2px] rounded-sm">
            {" "}
            {prop.quantity} × {prop.price}
          </p>
        </div>
      </div>
    </div>
  );
};
