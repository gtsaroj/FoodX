import { SpecialCards } from "../../Components/Card/SpecialCards";
import { UseFetch } from "../../UseFetch";
import Cart from "../Cart/Cart";

const Specials: React.FC = () => {
  return (
    <div className="flex flex-col bg-[var(--light-foreground)] w-full h-full gap-8 px-5 py-8 rounded">
      <div className="w-full px-3 py-5">
        <h2 className="text-xl md:text-3xl font-bold tracking-wide text-[var(--dark-text)]">
          Today's Specials 🎉
        </h2>
      </div>
      <div className="grid grid-cols-5 gap-8 " id="specials">
        <div className="bg-[var(--light-background)] rounded-md px-5 py-8 col-span-5 lg:col-span-3 w-full h-full overflow-x-scroll">
          <SpecialCardsContainer />
        </div>
        <div className="bg-[var(--light-background)] h-full hidden lg:flex lg:col-span-2 w-full px-5 py-8 rounded-md">
          <Cart />
        </div>
      </div>
    </div>
  );
};

export default Specials;

const SpecialCardsContainer: React.FC = () => {

 const {data} = UseFetch("/products/all")
  const firstGroup = data?.slice(0, 4)
  const secondGroup = data?.slice(4)
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5 pl-3 pr-5 overflow-x-scroll justify-evenly w-fit">
        {firstGroup &&
          firstGroup.map((item, index) => (
            <SpecialCards prop={item} key={index}/>
          ))}
      </div>
      <div className="flex gap-5 pr-5 overflow-x-scroll justify-evenly w-fit">
        {secondGroup &&
          secondGroup.map((item) => (
            <SpecialCards prop={item} key={item.id} />
          ))}
      </div>
    </div>
  );
};
