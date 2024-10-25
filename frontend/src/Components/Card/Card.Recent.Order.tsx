import { ArrowRight } from "lucide-react";
import { UserOrder } from "../../models/order.model";
import { AppDispatch, RootState } from "../../Store";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeCart } from "../../Reducer/product.reducer";
import {
  addProductToCart,
  removeProductFromCart,
} from "../../Services/cart.services";

interface RecentCardProp {
  item: UserOrder;
}

export const RecentCard: React.FC<RecentCardProp> = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const store = useSelector((state: RootState) => state.root);

  return (
    <div className="sm:w-[550px] w-[400px] bg-[var(--light-foreground)] rounded-l-lg pr-5 h-[140px] sm:h-full border-[1px] border-[var(--dark-border)] rounded-lg gap-5  flex items-center justify-center">
      <div className="sm:w-[350px] w-[200px] rounded-l-lg h-full sm:h-[180px] ">
        <img
          src={item.products[0].image}
          className=" rounded-l-lg w-full h-full bg-slate-100  "
        ></img>
      </div>
      <div className="flex py-3 flex-col w-full items-start gap-3 justify-between h-full">
        <p className="sm:text-[14px] text-xs text-gray-400 ">
          #{item.id.slice(0, 10)}{" "}
        </p>
        <div className="w-full flex items-center justify-between">
          <p className="text-[var(--dark-secondary-text)] tracking-wider font-semibold gap-4 text-sm sm:text-[14px] ">
            {item.time.split(" ")[0]}
          </p>
          <p className="text-[var(--dark-secondary-text)] tracking-wider font-semibold gap-4 text-sm sm:text-[14px] ">
            {item.time.split(" ")[1]} {item.time.split(" ")[2]}
          </p>
        </div>
        <div
          className={`flex pb-5  overflow-auto text-sm sm:text-[14px] font-semibold w-full text-gray-500 border-b-[2px] border-[var(--dark-border)]  justify-start`}
        >
          {item?.products?.length <= 3
            ? item.products.map(
                (product) => `${product.name} × ${product.quantity} ,`
              )
            : `${item.products[0].name} × ${item.products[0].quantity} ...`}
        </div>
        <div className="flex  items-center justify-between w-full">
          <span className=" font-semibold text-[var(--dark-text)] text-sm sm:text-[17px] tracking-wider ">
            Rs. {item.amount}
          </span>
          <button
            onClick={() => {
              store?.cart?.products?.forEach(async (product) => {
                await removeProductFromCart(
                  store?.auth?.userInfo?.uid as string,
                  product.id
                );
                dispatch(removeCart(product.id));
              });
              item.products?.forEach(async (product) => {
                await addProductToCart(
                  store?.auth?.userInfo?.uid as string,
                  product.id
                );
                dispatch(addToCart({ ...product }));
              });

              navigate("/cart/checkout");
            }}
            className=" font-semibold duration-150 gap-2 flex items-center justify-start text-[var(--primary-color)] text-[14px] sm:text-[17px] hover:text-[var(--primary-light)] "
          >
            Order Again <ArrowRight className="size-5" />{" "}
          </button>
        </div>
      </div>
    </div>
  );
};
