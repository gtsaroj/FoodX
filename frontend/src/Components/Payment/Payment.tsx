import React from "react";
import {
  ArrowLeft,
  Delete,
  DeleteIcon,
  ShoppingBag,
  Trash,
} from "lucide-react";
import { SingleCard } from "../../Pages/Cart/SingleCard";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Reducer/Store";
import { ProductType } from "../../models/productMode";
import { addToCart, removeCart } from "../../Reducer/Reducer";

interface CartProp {
  prop: ProductType;
}

export const Payment: React.FC = () => {
  const selectedProduct = useSelector(
    (state: RootState) => state.root.cart.products
  );

  const navigate = useNavigate();
  const Total = () => {
    let total = 0;
    selectedProduct?.forEach(
      (singleProduct) => (total += singleProduct.price * singleProduct.quantity)
    );
    return total;
  };
  return (
    <div className=" flex flex-col items-baseline justify-between py-6 w-full gap-20 sm:px-[30px] px-[5px]">
      {/* <MobileCart/> */}
      <div className="flex gap-[20px] flex-col md:flex-row items-stretch justify-center w-full md:px-[50px] sm:px-[40px] px-[0px] ">
        <div className="py-[19px] px-[10px] w-full bg-[#dedde2] rounded-xl  h-[500px]   flex flex-col items-center gap-5">
          <div className="flex flex-col gap-[30px] items-center border-b-[var(--dark-border)] border-b-[1px] w-full pb-8">
            <h3 className="sm:text-[30px]  text-xl font-semibold">Your Cart</h3>
          </div>
          <div className="flex w-full overflow-y-auto flex-col items-center gap-5">
            {selectedProduct.length <= 0 ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <ShoppingBag className="size-16" />

                <h1 className="text-[25px]">Your cart is empty</h1>
              </div>
            ) : (
              selectedProduct?.map((singlProduct) => (
                <div className="w-full flex justify-center items-center  pl-1 rounded-md shadow-sm">
                  <SingleCard prop={singlProduct} key={singlProduct.id} />
                </div>
              ))
            )}
          </div>
          <div className="flex items-center justify-between w-[350px]  sm:px-[10px] px-[20px]">
            <h3>Total : </h3>
            <h3>RS. {Total()}</h3>
          </div>
        </div>
        <div className="flex flex-col w-full items-center gap-[30px] px-[10px] py-[20px] bg-[#dedde2] rounded-xl ">
          <h3 className="sm:text-[30px]  text-xl font-semibold">
            Payment Method
          </h3>
          <div className="flex flex-col w-full justify-between  items-center gap-[30px]">
            <div className="flex items-center sm:gap-[20px] gap-[10px] ">
              <div className=" flex  items-center  gap-[3px] sm:w-[100px] w-full sm:py-[7px] sm:px-[10px] py-3 px-2 hover:border-[1px] hover:border-[var(--primary-color)] cursor-pointer text-[var(--dark-text)] bg-[var(--light-background)] rounded-md ">
                <div className="">
                  <img
                    className="w-[20px] object-cover transform scale-[7]"
                    src="../../../public/logo/esewa.png"
                    alt=""
                  />
                </div>
                <span className="md:text-lg sm:text-md text-sm">Esewa</span>
              </div>
              <div className=" bg-[var(--light-background)] flex  items-center  gap-[3px] hover:border-[1px] hover:border-[var(--primary-color)] cursor-pointer sm:w-[100px] w-full py-[7px] px-[10px] text-[var(--dark-text)]   h-[40px] rounded-md ">
                <div className="">
                  <img
                    className="w-[20px] object-cover transform scale-[7]"
                    src="../../../public/logo/khalti.png"
                    alt=""
                  />
                </div>
                <span className="md:text-lg sm:text-md text-sm">Khalti</span>
              </div>
              <div className=" bg-[var(--light-background)] flex  items-center  gap-[3px] hover:border-[1px] hover:border-[var(--primary-color)] cursor-pointer sm:w-[100px] w-full  py-[7px] px-[10px] text-[var(--dark-text)]   h-[40px] rounded-md ">
                <div className="">
                  <img
                    className="w-[20px] object-cover transform scale-[7]"
                    src="../../../public/logo/ime.png"
                    alt=""
                  />
                </div>
                <span className="md:text-lg sm:text-md text-sm">Ime</span>
              </div>
            </div>
            <div>
              <form
                action=""
                className="flex flex-col gap-[20px] items-center "
              >
                <div className="flex flex-col gap-[1px] ">
                  <label htmlFor="">Full Name</label>
                  <input
                    type="text"
                    className="w-full text-sm px-[20px] py-2 border-[1px] border-[var(--light-border)] rounded-md outline-none"
                  />
                </div>
                <div className="flex flex-col gap-[1px] ">
                  <label htmlFor="">Contact No.</label>
                  <input
                    type="text"
                    className="w-full text-sm px-5 py-2 border-[1px] border-[var(--light-border)]   rounded-md outline-none"
                  />
                </div>
                <div className="flex flex-col gap-[1px]   ">
                  <label htmlFor="">Gmail</label>
                  <input
                    type="text"
                    className="w-full text-sm px-5 py-[6px] border-[1px] border-[var(--light-border)]   rounded-md outline-none"
                  />
                </div>
                <div className="flex  bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] transition-all duration-150 text-[var(--light-foreground)] cursor-pointer justify-center w-full rounded-md border-[1px] py-2 px-5">
                  <button>Pay Now</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MobileCart: React.FC = () => {
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

  return (
    // Desktop
    <div className="w-full flex items-center  py-6 justify-center ">
         <div className="flex flex-col w-[600px] items-center justify-center h-[580px] gap-3  sm:px-1 px-[30px]">
      <div className="flex flex-col items-start ">
        <h3 className="w-full text-3xl font-semibold tracking-wide text-[var(--dark-text)]">
          My Order
        </h3>
      </div>
      <div className="flex flex-col items-center gap-2 w-full py-5 overflow-y-scroll">
        {selectedProducts.length > 0 ? (
          selectedProducts?.map((singleSelectedProduct) => (
            <SingleCard
              prop={singleSelectedProduct}
              key={singleSelectedProduct.id}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <ShoppingBag className=" cursor-pointer size-16" />

            <h1 className="text-[25px]">Your cart is empty</h1>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full gap-5">
        <div className="flex justify-between p-2  text-[var(--dark-text)]">
          <p className="text-lg font-bold tracking-wide">Total Amount:</p>
          <p className="text-lg">
            Rs <span>{Total()}</span>
          </p>
        </div>
        <div
          onClick={() => navigate("/cart/checkout")}
          className="py-3 cursor-pointer rounded-md px-4 w-full flex justify-center items-center bg-[var(--primary-color)] text-center hover:bg-[var(--primary-dark)]  "
        >
          <button className="text-[var(--light-text)] tracking-wider text-xl font-bold">
            Checkout
          </button>
        </div>
      </div>
    </div>
</div>
  );
};
