import React, { FormEvent, useEffect, useState } from "react";
import { Frown, Minus, Plus, ShoppingBag, ShoppingCart } from "lucide-react";
import { SingleCard } from "../Card/CardProductCart";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store";
import addNotification from "react-push-notification";
import { order } from "../../Services/order.services";
import { Product } from "../../models/product.model";
import toast from "react-hot-toast";
import Cart from "../../Pages/Cart/Cart";
import { SpecialCards } from "../Card/ProductCard";
import { UseFetch } from "../../UseFetch";
import { addToCart } from "../../Reducer/product.reducer";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface CartProp {
  prop: Product;
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

  // fetch products
  const products = useSelector((state: RootState) => state.root.cart.products);
  const userId = useSelector(
    (state: RootState) => state.root.auth.userInfo.uid
  );

  const handleOrder = async (event: FormEvent) => {
    event.preventDefault();
    const toasLoader = toast.loading("Processing your order...");
    const today = new Date();
    try {
      await order({
        products: products,
        uid: userId as string,
        orderRequest: today,
        orderFullFilled: "",
        status: "Pending",
      });
      toast.dismiss(toasLoader);
      addNotification({
        title: "Order Confirmed",
        subtitle: "Success!",
        message:
          "Your order has been successfully placed and is now being processed. You will receive an email confirmation with the details shortly. Thank you for shopping with us!",
        theme: "darkblue",
        native: true, // when using native, your OS will handle theming.
      });
      toast.success("Order sent successfully! ");
    } catch (error) {
      toast.dismiss(toasLoader);
      toast.error("Order failed. Please try again.");
      throw new Error("Error while ordering food " + error);
    }
  };

  return (
    <div className=" flex flex-col items-baseline justify-between py-6 w-full gap-20 sm:px-[30px] px-[5px]">
      {/* <MobileCart/> */}
      <div className="flex gap-[20px] flex-col md:flex-row items-stretch justify-center w-full md:px-[50px] sm:px-[40px] px-[0px] ">
        {/* my cart */}
        <div className="py-[19px] px-[10px] w-full rounded-lg   h-[500px]   flex flex-col items-start border-[1px] border-[var(--dark-border)] justify-between gap-5">
          <h3 className="sm:text-[30px]  text-xl px-2 font-semibold">
            My Cart
          </h3>

          <div className="flex w-full overflow-y-auto flex-col items-center gap-5">
            {selectedProduct.length <= 0 ? (
              <div className="flex flex-col  py-16 items-center justify-center gap-2">
                <ShoppingBag className=" cursor-pointer size-16" />

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
          <div className="flex  border-t w-full pt-5 items-center justify-between   sm:px-[10px] px-[20px]">
            <h3>Total : </h3>
            <h3>RS. {Total()}</h3>
          </div>
        </div>
        {/* My cart */}
        <div className="flex flex-col w-full items-center gap-[30px] px-[10px] py-[20px] bg-[var(--light-foreground)] rounded-lg ">
          <h3 className="sm:text-[30px]  border-b  w-full text-center pb-7 text-xl font-semibold">
            Payment Method
          </h3>
          <div className="flex flex-col  w-full justify-between  items-center gap-[30px]">
            <div className="w-full">
              {/* payment */}
              <form
                onSubmit={(event: FormEvent) => handleOrder(event)}
                action=""
                className="flex px-7  w-full flex-col  gap-6  items-center "
              >
                <div className="flex w-full text-[18px] tracking-wide flex-col gap-[1px] ">
                  <label htmlFor="">Full name</label>
                  <input
                    type="text"
                    className="w-full  px-[20px] py-2.5 text-[16px] focus:bg-[var(--light-background)] border-[1px] border-[var(--light-border)] rounded-md outline-none"
                  />
                </div>
                <div className="flex w-full text-[18px] tracking-wide flex-col gap-[1px] ">
                  <label htmlFor="">Contact No.</label>
                  <input
                    type="text"
                    className="w-full  px-[20px] py-2.5 text-[16px] focus:bg-[var(--light-background)] border-[1px] border-[var(--light-border)] rounded-md outline-none"
                  />
                </div>
                <div className="flex w-full text-[18px] tracking-wide flex-col gap-[1px] ">
                  <label htmlFor="">Gmail</label>
                  <input
                    type="text"
                    className="w-full  px-[20px] py-2.5 text-[16px] focus:bg-[var(--light-background)] border-[1px] border-[var(--light-border)] rounded-md outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex mt-8  py-3 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] transition-all duration-150 text-[var(--light-foreground)] cursor-pointer justify-center w-full rounded-md border-[1px]  px-5"
                >
                  Pay now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MobileCart: React.FC = () => {
  const [initialData, setInitialData] = useState<Product[]>([]);
  const { data } = UseFetch("products/all");

  const authUser = useSelector((state: RootState) => state.root.auth.success);

  useEffect(() => {
    setInitialData(data as Product[]);
  }, [data]);
  const navigate = useNavigate();

  return (
    // Desktop
    <div className="flex flex-col items-start  gap-10 w-full h-full py-6 px-3 justify-between ">
      <div className="w-full h-full flex lg:flex-row flex-col gap-[7rem] sm:gap-7  bg-[var(--light-foreground)] px-5 py-8 rounded items-center lg:items-start justify-around">
        <div className="lg:w-[600px] w-full p-2 py-4  px-5 rounded">
          <Cart />
        </div>
        <div className="lg:w-[550px] w-full flex h-full flex-col gap-4 pt-3 px-4 border  rounded-lg">
          <h3 className="w-full text-[25px] pl-4  py-2 font-semibold tracking-wide text-[var(--dark-text)]">
            Recent Products
          </h3>
          <div className="w-full h-full overflow-y-auto scrollbar-custom px-5 ">
            <div className="flex  flex-col w-full items-start h-[530px]  gap-3">
              {authUser ? (
                initialData?.length > 0 ? (
                  initialData?.map((data) => (
                    <Carts prop={data} key={data.id} />
                  ))
                ) : (
                  <div className="w-full ">
                    <Skeleton
                      height={90}
                      baseColor="var(--light-background)"
                      highlightColor="var(--light-foreground)"
                      count={5}
                    />
                  </div>
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                  <Frown className="size-32 text-[var(--dark-secondary-text)] " />
                  <p className="text-lg text-[var(--dark-secondary-text)] mb-4">
                    You are not logged in!
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-[var(--primary-light)] text-white py-2 px-4 rounded hover:bg-[var(--primary-color)] "
                  >
                    Log in to see your products
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mx-4 h-full px-3 py-2 rounded-t-lg flex flex-col gap-3 bg-white ">
        <h1 className="text-[23px] pl-5 pt-4 tracking-wider ">
          Popular products
        </h1>
        <div className="w-full flex flex-col gap-3 bg-white px-5 py-4  overflow-auto  rounded items-start justify-center">
          <div className=" overflow-hidden">
            <div className="w-full h-full flex items-center gap-4 justify-start  ">
              {initialData?.length > 0 ? (
                initialData?.map((singleObject) => (
                  <SpecialCards prop={singleObject} key={singleObject.id} />
                ))
              ) : (
                <div className="w-full gap-4 flex ">
                  <Skeleton
                    height={230}
                    width={330}
                    baseColor="var(--light-background)"
                    highlightColor="var(--light-foreground)"
                    count={1}
                  />
                  <Skeleton
                    height={230}
                    width={330}
                    baseColor="var(--light-background)"
                    highlightColor="var(--light-foreground)"
                    count={1}
                  />
                  <Skeleton
                    height={230}
                    width={330}
                    baseColor="var(--light-background)"
                    highlightColor="var(--light-foreground)"
                    count={1}
                  />
                  <Skeleton
                    height={230}
                    width={330}
                    baseColor="var(--light-background)"
                    highlightColor="var(--light-foreground)"
                    count={1}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MenuProp {
  prop: Product;
}

//recent products

export const Carts: React.FC<MenuProp> = ({ prop }) => {
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
    <div className=" w-full  rounded-lg pr-4 flex items-center justify-between bg-[var(--light-foreground)] h-[200px] ">
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
