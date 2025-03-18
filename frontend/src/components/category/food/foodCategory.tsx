import { Image } from "@/helpers";
import { useNavigate } from "react-router-dom";
import Img from "@/assets/placeholder.webp";
export interface MenuProps {
  menu: Ui.Category[];
}

export const FoodCategory = ({ menu }: MenuProps) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math?.round(
          menu?.length / 2
        )}, minmax(0,1fr) ) `,
      }}
      className={`w-full text-nowrap grid  sm:gap-x-10 gap-x-14  justify-items-start gap-y-5  sm:gap-y-10`}
    >
      {menu?.map((product) => (
        <div
          onClick={() => navigate(`/category/${product.id}`)}
          className="flex size-24 sm:size-40       gap-1 cursor-pointer   flex-col items-center justify-center"
          key={product.id}
        >
          <Image
            lowResSrc={Img}
            highResSrc={product.image}
            className="sm:size-32 size-16 rounded-full  object-cover"
            alt="product"
          />
          <p className="sm:text-[18px]  text-[13.5px] font-[600] text-[var(--secondary-text)] ">
            {product.name}
          </p>
        </div>
      ))}
    </div>
  );
};
