import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

export const SpecialCards: React.FC<CardSlides> = (props) => {
  const [activeCart, setActiveCart] = useState<boolean>(false);
  const [cartQuantity, setCartQuantity] = useState<number>();

  const handleCart = () => {
    setActiveCart((activateCart) => !activateCart);
    setCartQuantity(1);
  };

  const addCart = () => {
    if (cartQuantity) {
      setCartQuantity(cartQuantity + 1);
    } else {
      setCartQuantity(1);
    }
  };
  const decreaseCart = () => {
    if (cartQuantity === 1) {
      setCartQuantity(0);
      setActiveCart(false);
    } else {
      setCartQuantity(cartQuantity && cartQuantity - 1);
    }
  };

  return (
    <div
      className={
        " h-full w-[250px] rounded-xl  pb-3 overflow-hidden shadow-sm relative snap-start" +
        (props.color === "secondary"
          ? " bg-[var(--light-background)]"
          : " bg-[var(--light-foreground)]")
      }
    >
      <div className="">
        <img
          src={props.slides.image}
          alt={props.slides.name}
          className="w-full h-[180px] object-cover object-center rounded-t-md"
        />
      </div>
      <div className="flex items-center justify-between gap-1 px-5 pt-4 pb-2">
        <div className="flex flex-col gap-1 pt-2">
          <h4 className="font-semibold tracking-wide">{props.slides.name}</h4>
          <p className="flex gap-2 tracking-wider">
            Rs <span className="tracking-wide">{props.slides.price}</span>
          </p>
        </div>
      </div>

      <div
        className={
          "p-2  bg-[var(--light-background)] rounded-full text-[var(--primary-color)]   shadow-sm flex justify-between items-center absolute top-[165px] right-1 border  " +
          (activeCart
            ? " border-[var(--primary-color)]"
            : "  hover:bg-[var(--primary-color)] hover:text-[var(--light-text)] border-none cursor-pointer")
        }
      >
        {activeCart ? (
          <div className="flex items-center gap-2 px-1 text-xs select-none">
            <Minus
              size={20}
              className="cursor-pointer"
              onClick={decreaseCart}
            />
            <p className="px-1">{cartQuantity ? cartQuantity : "Add"}</p>
            <Plus size={20} className="cursor-pointer" onClick={addCart} />
          </div>
        ) : (
          <ShoppingCart onClick={handleCart} />
        )}
      </div>
    </div>
  );
};
