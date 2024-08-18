import { Product } from "../../models/product.model";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Store";
import { Trash2 } from "lucide-react";
import { removeFavourite } from "../../Reducer/favourite.reducer";

interface SingleCardProp {
  prop: Product;
}

export const FavouriteCard: React.FC<SingleCardProp> = ({
  prop,
}: SingleCardProp) => {
  // const [InitialQuantity, setInitialQuantity] = useState<number>(1);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div
      key={prop.id}
      className={`duration-1000 cursor-pointer  border-[1px] border-[var(--dark-border)]    group/cart relative flex gap-3 items-center h-[120px] w-full bg-[var(--light-foreground)] rounded-lg `}
    >
      <div>
        <img
          className="w-[120px]  h-[120px] object-cover shrink-0 object-center rounded-l-lg"
          src={prop.image}
          alt=""
        />
      </div>
      <div className="flex h-full  flex-col gap-2 px-3 items-start justify-evenly ">
        <p className="text-xl  text-[var(--dark-text)] font-bold tracking-wide">
          {prop.name}
        </p>
        <p className="text-sm  text-[var(--dark-secondary-text)] ">
          Rs {prop.price}
        </p>
      </div>
      <div
        onClick={() => {
          dispatch(removeFavourite(prop.id));
        }}
        className=" cursor-pointer duration-150 absolute px-3 bg-[#B32624] h-full  justify-center items-center right-0 flex rounded-tr-md  rounded-br-md invisible group-hover/cart:visible opacity-0 group-hover/cart:opacity-[1] "
      >
        <Trash2 className="text-[var(--light-text)]" />
      </div>
    </div>
  );
};
