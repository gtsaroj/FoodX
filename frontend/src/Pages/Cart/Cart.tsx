import React from "react";
import { SingleCard } from "./SingleCard";
import { useSelector } from "react-redux";
import { RootState } from "../../Reducer/Store";


const Cart: React.FC = () => {
  const selectedProducts = useSelector((state: RootState) => state.root.cart.products)
   
  const Total = () => {
    let total = 0;
    selectedProducts?.forEach((singleProduct) => (
     total += singleProduct.price * singleProduct.quantity    
    ))
    return total;
  }

  return (
    <div className="flex flex-col w-full h-full gap-3">
      <div className="flex flex-col items-start ">
        <h3 className="w-full text-3xl font-semibold tracking-wide text-[var(--dark-text)]">
          My Order
        </h3>
      </div>
      <div className="flex flex-col gap-2 w-full py-5 overflow-y-scroll">
        {
          selectedProducts?.map((singleSelectedProduct) =>
          (
            <SingleCard prop={singleSelectedProduct} key={singleSelectedProduct.id} />
          ))
        }
      </div>
      <div className="flex flex-col w-full gap-5">
        <div className="flex justify-between p-2  text-[var(--dark-text)]">
          <p className="text-lg font-bold tracking-wide">Total Amount:</p>
          <p className="text-lg">
            Rs <span>{Total() }</span>
          </p>
        </div>
        <div className="py-3 cursor-pointer rounded-md px-4 w-full flex justify-center items-center bg-[var(--primary-color)] text-center hover:bg-[var(--primary-dark)]  ">
          <button className="text-[var(--light-text)] tracking-wider text-xl font-bold">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

// export const CartContainer: React.FC = () => {
//   const product = useSelector((state: RootState) => state.root.cart.products);
//   return (
//     <div className="flex flex-col w-full gap-5 overflow-y-scroll max-h-[450px]">
//       {product?.map((item) => (
//         <SingleCard prop={item} key={item.id} />
//       ))}
//     </div>
//   );
// };
