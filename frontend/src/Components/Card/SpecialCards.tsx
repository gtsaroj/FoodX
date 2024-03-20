import { Minus, Plus, ShoppingCart } from "lucide-react";
import {  useState } from "react";
import { ProductType } from "../../Reducer/Reducer";
import {  useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Reducer/Reducer";
import { RootState } from "../../Reducer/Store";

interface MenuProp {
  prop: ProductType;
}
export const SpecialCards: React.FC<MenuProp> = ({ prop }: MenuProp) => {
  const [activeCart, setActiveCart] = useState<boolean>(false);
  const [cartQuantity, setCartQuantity] = useState<number>(1);

  const dispatch = useDispatch();

  const selectedProductsQuantity = useSelector(
    (state: RootState) => state.root.cart.products
  );

  const handleClick = () => {
    setCartQuantity((prev) => (prev <= 1 ? 1 : prev - 1));

    const findQuantity = selectedProductsQuantity?.find(
      (singleProduct) => singleProduct.id == prop.id
    );
    if (findQuantity?.quantity) {
      dispatch(
        addToCart({
          id: prop.id,
          quantity: findQuantity.quantity <= 1 ? 1 : -1,
        })
      );
    }
  };

  return (
    <div
      className={
        " h-full w-[250px] rounded-xl  pb-3 overflow-hidden shadow-sm relative snap-start" //+
        // (props.color === "secondary"
        //   ? " bg-[var(--light-background)]"
        //   : " bg-[var(--light-foreground)]")
      }
      key={prop.id}
    >
      <div className="">
        <img
          src={prop?.image}
          className="w-full h-[180px] object-cover object-center rounded-t-md"
        />
      </div>
      <div className="flex items-center justify-between gap-1 px-5 pt-4 pb-2">
        <div className="flex flex-col gap-1 pt-2">
          <h4 className="font-semibold tracking-wide">{prop.name}</h4>
          <p className="flex gap-2 tracking-wider">
            Rs <span className="tracking-wide">{prop.price}</span>
          </p>
        </div>
      </div>

      <div
        className={
          "p-2  bg-[var(--light-background)] rounded-full text-[var(--primary-color)]   shadow-sm flex justify-between items-center absolute top-[165px] right-1 border  " //+
          // (activeCart
          //   ? " border-[var(--primary-color)]"
          //   : "  hover:bg-[var(--primary-color)] hover:text-[var(--light-text)] border-none cursor-pointer")
        }
      >
        {activeCart ? (
          <div className="flex items-center gap-2 px-1 text-xs select-none">
            <Minus
              size={20}
              className="cursor-pointer"
              onClick={() => handleClick()}
            />

            <p className="px-1">{cartQuantity ? cartQuantity : "Add"}</p>
            <Plus
              size={20}
              className="cursor-pointer"
              onClick={() => {
                setCartQuantity((prevValue) => prevValue + 1);
                dispatch(
                  addToCart({
                    id: prop.id,
                    quantity: +1,
                  })
                );
              }}
            />
          </div>
        ) : (
          <ShoppingCart
            onClick={() => {
              setActiveCart((prevValue) => !prevValue);
              dispatch(
                addToCart({
                  id: prop.id,
                  name: prop.name,
                  image: prop.image,
                  price: prop.price,
                  quantity: 1,
                })
              );
            }}
          />
        )}
      </div>
    </div>
  );
};
