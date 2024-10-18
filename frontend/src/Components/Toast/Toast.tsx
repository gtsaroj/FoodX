import { toast } from "react-hot-toast";
import { Order, OrderStatus } from "../../models/order.model";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";

export const CustomToast = (
  order: Order,
  id: string,
  orderStatus: OrderStatus["status"]
) => {
  const { uid,  products } = order;
  const user = useSelector((state: RootState) => state.root.auth.userInfo);

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-pulse" : "animate-pulse"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
        }}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            {/* Order details */}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {user?.uid === uid ? user.fullName : "Your"} Order is Ready!
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Order #{id} is now{" "}
                <span className="font-semibold">{orderStatus}</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Items: <span className="font-semibold">{products.length}</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Ready at:{" "}
                <span className="font-semibold">{order.orderFullFilled}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            aria-label="Close notification"
          >
            Close
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity, // Keeps the toast visible until manually dismissed
      position: "bottom-right", // Adjusts the position to bottom-center
    }
  );
};
