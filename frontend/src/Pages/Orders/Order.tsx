import { useEffect, useState } from "react";
import { addOrderToDatabase, getOrderByUser } from "../../firebase/oder";
import { Order, Product } from "../../models/order.model";
import { nanoid } from "@reduxjs/toolkit";
import { ChevronsLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { auth } from "../../firebase";
import { RootState, Store } from "../../Reducer/Store";
import authReducer from "../../Reducer/authReducer";
import { addToCart } from "../../Reducer/Reducer";
import { addToList } from "../../Reducer/OrderReducer";
import { useSelector } from "react-redux";

const product: Product = {
  id: nanoid(),
  image: "img.png",
  name: "Chicken Pizza",
  price: 120,
  quantity: 5,
  tag: "pizza",
};

const order1: Order = {
  orderId: nanoid(),
  uid: "X8LHXCdRffcKJMR9Rs1s87HJBm83",
  products: [product],
  orderRequest: {
    nanoseconds: 1,
    seconds: 2,
  },
  orderFullFilled: {
    nanoseconds: 3,
    seconds: 4,
  },
};


export const OrderComponent = () => {


  const orderList = useSelector((state : RootState)=> state.root.Products.order.order)
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastVisibleOrder, setLastVisibleOrder] = useState<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [nextDisabled, setNextDisabled] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.root.auth.userInfo);
  const fetchData = async (next?: boolean) => {
    try {
      if (!user) throw new Error("Please Login first.");
      const data = await getOrderByUser(user?.uid, lastVisibleOrder, next);
      const serializeData = data?.map((order: Order) => ({
        ...order,
        orderRequest: {
          seconds: order.orderRequest?.seconds,
          nanoseconds: order.orderRequest?.nanoseconds,
        },
        orderFullFilled: {
          seconds: order.orderFullFilled?.seconds,
          nanoseconds: order.orderFullFilled?.nanoseconds,
        },
      }));
      Store.dispatch(addToList([...serializeData]));

      if (data.length < 5) {
        setNextDisabled(true);
      } else {
        setNextDisabled(false);
      }

      if (next) {
        setOrders((prev) => [...prev, ...data]);
      } else {
        setOrders(data);
      }

      if (data.length > 0) {
        setLastVisibleOrder(data[data.length - 1].orderRequest);
      }
      setOrders(data);
    } catch (error) {
      console.error(error);
      throw new Error("Fetch data failed");
    } finally {
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
    fetchData(true);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    fetchData(false);
  };

  // useEffect(() => {
  //   fetchData();
  // }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full p-3">
      <div className="max-w-[800px] py-3 px-5 flex-grow flex flex-col gap-5">
        <div className="text-xl font-bold text-[var(--dark-text)] text-center tracking-wide">
          <p>Order History</p>
        </div>
        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-scroll">
          <div className="flex flex-col flex-grow-0 gap-2 py-2">
            {orderList.map((item: Order) => (
              <OrderCard key={item.orderId} item={item} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs">
          <button
            className={
              currentPage === 1
                ? "cursor-not-allowed  hover:bg-[var(--light-secondary-text)] py-1 pr-2 pl-1 group rounded flex items-center bg-[var(--light-border)] text-[var(--dark-text)]"
                : "hover:bg-[var(--light-secondary-text)] py-1 pr-2 pl-1 group rounded flex items-center bg-[var(--light-border)] cursor-pointer text-[var(--dark-text)] "
            }
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <span>
              <ChevronsLeft
                size={15}
                className="group-hover:text-[var(--secondary-color)]"
              />
            </span>
            <span>Prev</span>
          </button>
          <p className="px-2 py-1 font-medium">{currentPage}</p>
          <button
            className={
              nextDisabled
                ? " cursor-not-allowed  hover:bg-[var(--light-secondary-text)] py-1 pl-2 pr-1 group rounded flex items-center bg-[var(--light-border)] text-[var(--dark-text)]  "
                : " cursor-pointer  hover:bg-[var(--light-secondary-text)] py-1 pl-2 pr-1 group rounded flex items-center bg-[var(--light-border)]  text-[var(--dark-text)]  "
            }
            onClick={handleNextPage}
            disabled={nextDisabled}
          >
            <span>Next</span>
            <span>
              <ChevronsRight
                size={15}
                className="group-hover:text-[var(--secondary-color)]"
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const OrderCard = (props: { item: Order }) => {
  return (
    <div className="w-full h-[110px] bg-[var(--light-foreground)] py-2 px-3 overflow-hidden rounded shadow-sm select-none">
      <div className="flex flex-col w-full h-full gap-3 text-sm">
        <div className="flex items-center justify-between gap-3 text-sm font-medium text-[var(--dark-text)] group">
          <p className="text-xs cursor-pointer">7th April, 2024</p>
          <div className="flex items-center gap-1 text-xs cursor-pointer ">
            <p>
              {props.item.products.map((product) => (
                <span>{product.price * product.quantity}</span>
              ))}
            </p>
            <ChevronRight
              className="group-hover:text-[var(--secondary-color)] text-[var(--dark-secondary-text)]"
              size={20}
            />
          </div>
        </div>
        {props.item.products.map((product) => (
          <div className="flex items-center justify-between gap-3 text-[var(--dark-secondary-text)]">
            <div className="flex flex-col gap-2 text-xs">
              <p className="flex items-center gap-[6px]">
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--primary-color)]"></span>
                {product.name}
              </p>
              <p className="flex items-center gap-[6px]">
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--secondary-color)]"></span>
                Rs {product.price} ({product.quantity})
              </p>
            </div>
            <div>
              <img
                src={product.image}
                className="w-[50px] rounded-full h-[50px] object-cover object-center"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
