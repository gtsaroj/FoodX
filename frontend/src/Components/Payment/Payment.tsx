import React from "react";
import { ShoppingBag } from "lucide-react";
import { SingleCard } from "../../Pages/Cart/SingleCard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Reducer/Store";
import { ProductType } from "../../models/productMode";
import { order } from "../../Services";
import { Order, Product } from "../../models/order.model";
import toast from "react-hot-toast";
import Cart from "../../Pages/Cart/Cart";
import { OrderCard } from "../../Pages/Orders/Order";

interface CartProp {
  prop: Product;
}

export const Payment: React.FC = () => {
  const selectedProduct = useSelector(
    (state: RootState) => state.root.Products.cart.products
  );

  const navigate = useNavigate();
  const Total = () => {
    let total = 0;
    selectedProduct?.forEach(
      (singleProduct) => (total += singleProduct.price * singleProduct.quantity)
    );
    return total;
  };

  // fetch products
  const products = useSelector(
    (state: RootState) => state.root.Products.cart.products
  );
  const userId = useSelector(
    (state: RootState) => state.root.auth.userInfo.uid
  );
  console.log(products, userId.uid);

  const handleOrder = async () => {
    console.log("fkdjl");
    const today = new Date().toISOString();
    try {
      const sendOrder = await order({
        products: products,
        uid: userId,
        orderRequest: today,
        orderFullFilled: "",
        status: "Pending",
      });
      if (sendOrder) toast.success("Order Succesfully");
    } catch (error) {
      throw new Error("Error while ordering food " + error);
    }
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
              {/* payment */}
              <form
                onClick={() => handleOrder()}
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
                  <button type="submit">Pay Now</button>
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
    (state: RootState) => state.root.Products.cart.products
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
    <div className="flex flex-col items-start  w-full h-full py-6 justify-between ">
      <div className="w-full h-full flex items-start justify-around">
      <div className="w-[500px]">
        <Cart />
      </div>
      <div className="w-[400px] flex h-full flex-col gap-4 py-3 bg-white px-4 rounded-sm">
        <h2 className="text-[23px] tracking-wider">Recent Products</h2>
        <div className="w-full h-full">
          <div className="flex flex-col items-start h-[400px] overflow-auto justify-center gap-4">
            <div className="w-full bg-slate-200 h-[60px]"></div>
            <div className="w-full bg-slate-200 h-[60px]"></div>
            <div className="w-full bg-slate-200 h-[60px]"></div>
            <div className="w-full bg-slate-200 h-[60px]"></div>
            <div className="w-full bg-slate-200 h-[60px]"></div>
      
          </div>
        </div>
      </div>
 </div>
  
      <div className="w-full flex flex-col gap-3 bg-white px-5 py-4   rounded items-start justify-center">
        <h1 className="text-[23px] tracking-wider ">Popular products</h1>
        <div className="flex items-center w-full  gap-5 overflow-x-auto ">
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
        </div>
      </div>
    </div>
  );
};
