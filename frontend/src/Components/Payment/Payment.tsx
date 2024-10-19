import React, { useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";
import { addOrder } from "../../Services/order.services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store";
import dayjs from "dayjs";
import { MoonLoader } from "react-spinners";
import { addRevenue } from "../../Services/revenue.services";
import { addNotification } from "../../Services/notification.services";
import { useNavigate } from "react-router-dom";

import { resetCart } from "../../Reducer/product.reducer";
// import { Product } from "../../models/product.model";

export const Payment: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<string>("esewa");
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handlePaymentSelection = (paymentMethod: string) => {
    setSelectedPayment(paymentMethod);
  };

  const store = useSelector((state: RootState) => state.root);
  const dispatch = useDispatch<AppDispatch>();

  const handlePayment = async () => {
    if (!selectedPayment) {
      // Show error or alert for missing payment method
      toast.error("Please select a payment method");
      return;
    }
    try {
      setLoading(true);
      await addOrder({
        products: store.cart.products,
        orderRequest: dayjs().format("YYYY-MM-DD"),
        uid: store.auth.userInfo.uid as string,
        note: note,
        orderFullfilled: "",
        revenue: store.cart.products.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0
        ),
        status: "pending",
        orderId: "",
      });
      await addRevenue({
        id: dayjs().format("YYYY-MM-DD"),
        orders: store.cart.products,
      });
      await addNotification({
        userId: store.auth.userInfo.uid as string,
        title: "Order Confirmed!",
        message: `Order placed successfully! We're processing your ${store?.cart?.products?.length} item. Thank you for shopping with us!"`,
      });

      // const handleOrder = (order: Order) => {
      //   navigate(`/order/success/:${order?.orderId}`, {
      //     state: { orderDetails: order },
      //   });
      // };

      // socket.on("new_order", handleOrder);
      navigate("/order/success", {
        state: store.cart,
      });
      dispatch(resetCart());
    } catch (error) {
      toast.error("Error while payment");
      setLoading(true);
      throw new Error("Error while add order & payment" + error);
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   const updateStateFromSessionStorage = () => {
  //     const products = sessionStorage.getItem("products");
  //     setOrder(products ? JSON.parse(products) : []);

  //     const getDiscount = sessionStorage.getItem("discount");
  //     setDiscount(getDiscount ? parseInt(getDiscount, 10) : 0);
  //   };

  //   // Initial state setup
  //   updateStateFromSessionStorage();

  //   // Listen for storage changes
  //   window.addEventListener('storage', updateStateFromSessionStorage);

  //   return () => {
  //     window.removeEventListener('storage', updateStateFromSessionStorage);
  //   };
  // }, []);

  return (
    <div className="w-full md:max-w-md p-5 mt-12 rounded-lg bg-[var(--light-foreground)] shadow-md">
      <h1 className="text-xl font-semibold tracking-wider text-[var(--dark-text)] mb-5">
        Payment Information
      </h1>
      <div className="flex flex-col gap-4">
        {/* Payment Method */}
        <div className="flex flex-col">
          <label className="text-[var(--dark-secondary-text)]">
            Select Payment Method
          </label>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => handlePaymentSelection("esewa")}
              className={`w-full py-3 bg-[var(--esewa)] font-semibold tracking-wide rounded-lg text-[var(--dark-text)] ${
                selectedPayment === "esewa"
                  ? "ring-[4px] ring-[var(--dark-border)]  "
                  : ""
              }`}
            >
              eSewa
            </button>
            <button
              onClick={() => handlePaymentSelection("khalti")}
              className={`w-full py-3 bg-[var(--khalti)] font-semibold tracking-wide rounded-lg text-[var(--dark-text)] ${
                selectedPayment === "khalti"
                  ? "ring-[4px] ring-[var(--dark-border)]  "
                  : ""
              }`}
            >
              Khalti
            </button>
          </div>
        </div>

        {/* Note Section */}
        <div className="flex flex-col w-full mt-4">
          <label className="text-[var(--dark-secondary-text)]">
            Add a Note (Optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-3 mt-2 outline-none text-[14px] rounded-lg bg-[var(--light-background)] border-[1px] border-[var(--dark-border)] text-[var(--dark-text)] placeholder:text-[var(--dark-secondary-text)]"
            placeholder="Special requests or instructions"
            rows={3}
          />
        </div>

        {/* Order Summary */}
        <div className="mt-5 p-4 bg-[var(--light-foreground)] rounded-lg border-[1px] border-[var(--dark-border)]">
          {/* <div className="flex items-center justify-between">
            <span className="text-[var(--dark-secondary-text)]">
              Cart Subtotal
            </span>
            <span className="text-[var(--dark-secondary-text)]">
              {store.cart.products?.reduce(
                (productAcc, product) =>
                  productAcc + product.price * product.quantity,
                0
              )}
            </span>
          </div> */}
          {/* <div className="flex items-center justify-between mt-2">
            <span className="text-[var(--dark-secondary-text)]">Discount</span>
            <span className="text-[var(--dark-secondary-text)]"> { discount || 0}</span>
          </div> */}
          <div className="flex justify-between items-center  font-semibold text-[var(--green-text)]">
            <span>Order Total</span>
            <span>
              Rs.
              {store.cart.products?.reduce(
                (productAcc, product) =>
                  productAcc + product.price * product.quantity,
                0
              ) ||
                store?.cart?.products?.reduce(
                  (productAcc, product) =>
                    productAcc + product.price * product.quantity,
                  0
                )}
            </span>
          </div>
        </div>

        {/* Payment Action */}
        <div className="flex items-center justify-between mt-5">
          <button
            type="button"
            onClick={handlePayment}
            className="bg-[var(--primary-color)] flex gap-2 items-center justify-start text-[var(--dark-text)] py-2 px-4 rounded-lg hover:bg-[var(--primary-light)] transition-all"
          >
            Pay Now
            {loading && (
              <MoonLoader
                size={20}
                className=" size-3 text-[var(--primary-color)] "
              />
            )}
          </button>
        </div>
      </div>

      <div className="mt-5 text-[var(--dark-secondary-text)] text-center">
        <small>
          All payments are processed securely through eSewa or Khalti.
        </small>
      </div>
    </div>
  );
};

//recent products
