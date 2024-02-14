import { SpecialCards } from "../../Components/Card/SpecialCards";
import Cart from "../Cart/Cart";

const specialItems: CardProp[] = [
  {
    id: 0,
    name: "Chicken Momo",
    price: 250,
    image:
      "https://i.pinimg.com/564x/98/13/31/9813314076f31996a326287ca74b4960.jpg",
  },
  {
    id: 1,
    name: "Chicken Pizza",
    price: 750,
    image:
      "https://i.pinimg.com/564x/b6/94/0e/b6940e530fa87fdf8f4e9cdf5ccafc36.jpg",
  },
  {
    id: 2,
    name: "Chicken Burger",
    price: 450,
    image:
      "https://i.pinimg.com/736x/39/e9/7f/39e97f890fb372074fa0e06e202ef665.jpg",
  },
  {
    id: 3,
    name: "Fries",
    price: 150,
    image:
      "https://i.pinimg.com/736x/57/22/00/57220047fc59da5722f2daf2bf683b67.jpg",
  },
  {
    id: 0,
    name: "Chicken Momo",
    price: 250,
    image:
      "https://i.pinimg.com/564x/98/13/31/9813314076f31996a326287ca74b4960.jpg",
  },
];

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
  const firstGroup = specialItems.slice(0, 4);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5 pl-3 pr-5 overflow-x-scroll justify-evenly w-fit">
        {firstGroup &&
          firstGroup.map((item, index) => (
            <SpecialCards slides={item} key={index} color="primary" />
          ))}
      </div>
      <div className="flex gap-5 pr-5 overflow-x-scroll justify-evenly w-fit">
        {firstGroup &&
          firstGroup.map((item, index) => (
            <SpecialCards slides={item} key={index} color="primary" />
          ))}
      </div>
    </div>
  );
};
