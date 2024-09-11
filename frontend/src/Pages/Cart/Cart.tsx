import React, { useState } from "react";
import { SingleCard } from "../../Components/Card/Card.Product.Cart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store";
import { CopyPlus, Plus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../Reducer/product.reducer";

const Cart: React.FC = () => {
  const [isDraggable, setIsDraggable] = useState<boolean>(false);
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);

  const selectedProducts = useSelector(
    (state: RootState) => state.root.cart.products
  );

  const navigate = useNavigate();
  const Total = () => {
    let total = 0;
    selectedProducts?.forEach(
      (singleProduct) => (total += singleProduct.price * singleProduct.quantity)
    );
    return total;
  };
  const dispatch = useDispatch<AppDispatch>();

  return (
    // Desktop
    <div
      onMouseEnter={() => setIsScrollbarVisible(true)}
      onMouseLeave={() => setIsScrollbarVisible(false)}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDraggable(true);
      }}
      onDrop={(event) => {
        const productData = event.dataTransfer.getData("product");
        setIsDraggable(false);
        const product = JSON.parse(productData);
        dispatch(
          addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: 1,
            tag: product.tag,
          })
        );
        setIsDraggable(false);
      }}
      className="flex flex-col w-full justify-between h-full gap-3   sm:px-1 px-[30px]"
    >
      <div className="flex flex-col items-start ">
        <h3 className="w-full py-2 text-[25px] font-semibold tracking-wide text-[var(--dark-text)]">
          My Cart
        </h3>

        <div
          className={`flex flex-col relative h-[400px] items-center gap-2 w-full py-5 scrollbar-custom duration-200  pr-3 overflow-auto`}
        >
          {selectedProducts.length > 0 ? (
            selectedProducts?.map((singleSelectedProduct) => (
              <SingleCard
                prop={singleSelectedProduct}
                key={singleSelectedProduct.id}
              />
            ))
          ) : (
            <div className="flex flex-col  py-16 items-center justify-center gap-2">
              <ShoppingBag className=" text-[var(--dark-text)] cursor-pointer size-16" />

              <h1 className="text-[25px] text-[var(--dark-text)] ">
                Your cart is empty
              </h1>
            </div>
          )}
          <div
            className={`w-full ${
              isDraggable ? "visible  " : "invisible opacity-0"
            } opacity-55 z-[100] h-full duration-150  flex items-center justify-center  backdrop-brightness-50 absolute left-0 top-0`}
          >
            <CopyPlus className="size-20 text-[var(--light-text)] " />
          </div>
        </div>
      </div>
      <div className="flex border-t    flex-col w-full gap-5">
        <div className="flex justify-between p-2  text-[var(--dark-text)]">
          <p className="text-lg font-bold tracking-wide">Total Amount:</p>
          <p className="text-lg">
            Rs <span>{Total()}</span>
          </p>
        </div>
        <button
          onClick={() => navigate("/cart/checkout")}
          className="py-3 rounded-md px-4 w-full flex justify-center items-center bg-[var(--primary-color)] text-center hover:bg-[var(--primary-dark)]  text-white cursor-pointer tracking-wider text-xl font-bold"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
