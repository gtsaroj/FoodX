import { Minus, Plus, ShoppingCart } from "lucide-react";
import { addToCart } from "../../Reducer/product.reducer";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../Store";
import { useDispatch, useSelector } from "react-redux";
import { Product } from "../../models/product.model";

interface MenuProp {
    prop: Product;
}
  
export const RecentProduct: React.FC<MenuProp> = ({ prop }) => {
    const [activeCart, setActiveCart] = useState<boolean>();
    const [cartQuantity, setCartQuantity] = useState<number>(1);
  
    const selectedProductsQuantity = useSelector(
      (state: RootState) => state.root.cart.products
    );
  
    const dispatch = useDispatch<AppDispatch>();
  
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
  
    useEffect(() => {
      const findQuantity = selectedProductsQuantity?.find(
        (singleProduct) => singleProduct.id === prop.id
      );
      if (findQuantity) {
        setCartQuantity(findQuantity.quantity);
      }
      if (findQuantity?.quantity === undefined || null) {
        setActiveCart(false);
      }
    }, [selectedProductsQuantity]);
  
    return (
      <div className=" w-full shadow-sm  rounded-lg pr-4 flex items-center justify-between bg-[var(--light-foreground)] h-[200px] ">
        <div className="flex w-full items-stretch h-full justify-start gap-3">
          <div className=" h-full ">
            <img
              src={prop.image}
              className="  w-[120px] h-[105px] rounded-l-lg    "
            ></img>
          </div>
          <div className="flex h-full  flex-col  items-start justify-evenly">
            <p className="text-[var(--dark-text)] tracking-wide font-semibold text-[20px] w-full ">
              {prop.name}
            </p>
            <span className="text-[18px] tracking-wide text-[var(--dark-text)] ">
              Rs {prop.price}
            </span>
          </div>
        </div>
  
        <div
          className={`p-2   ${
            activeCart
              ? ""
              : "duration-200 cursor-pointer hover:bg-[var(--primary-color)] hover:text-[var(--light-text)]"
          }   bg-[var(--light-foreground)] rounded-full text-[var(--primary-color)]   shadow-sm flex justify-between items-center  right-1 border  `}
        >
          {activeCart ? (
            <div className="flex items-center gap-2 px-1 text-xs select-none ">
              <button
                onClick={() => handleClick()}
                disabled={cartQuantity <= 1 ? true : false}
              >
                <Minus
                  size={20}
                  className={` hover:text-[var(--secondary-color)]`}
                  aria-disabled={"true"}
                />
              </button>
  
              <p className="px-1">{cartQuantity ? cartQuantity : "Add"}</p>
              <Plus
                size={20}
                className=" cursor-pointer hover:text-[var(--secondary-color)]"
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
            <button>
              <ShoppingCart
                className=" size-7"
                onClick={() => {
                  setActiveCart((prevValue) => !prevValue);
                  dispatch(
                    addToCart({
                      id: prop.id,
                      name: prop.name,
                      image: prop.image,
                      price: prop.price,
                      quantity: 1,
                      tag: prop.tag,
                    })
                  );
                }}
              />
            </button>
          )}
        </div>
      </div>
    );
  };