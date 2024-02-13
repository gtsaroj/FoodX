import { SpecialCards } from "../../Components/Card/SpecialCards";
import Cart from "../Cart/Cart";

const specialItems: CardProp[] = [
  {
    name: "Chicken Momo",
    price: 250,
    image:
      "https://i.pinimg.com/564x/98/13/31/9813314076f31996a326287ca74b4960.jpg",
  },
  {
    name: "Chicken Pizza",
    price: 750,
    image:
      "https://i.pinimg.com/564x/b6/94/0e/b6940e530fa87fdf8f4e9cdf5ccafc36.jpg",
  },
  {
    name: "Chicken Burger",
    price: 450,
    image:
      "https://i.pinimg.com/736x/39/e9/7f/39e97f890fb372074fa0e06e202ef665.jpg",
  },
  {
    name: "Fries",
    price: 150,
    image:
      "https://i.pinimg.com/736x/57/22/00/57220047fc59da5722f2daf2bf683b67.jpg",
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
      <div className="grid w-full h-full grid-cols-1 gap-5 lg:grid-cols-5">
        <div
          className="flex items-center col-span-3 gap-5 overflow-x-scroll shrink-0 scroll-smooth"
          id="specials"
        >
          <SpecialCardsContainer />
        </div>
        <div className="h-full bg-[var(--light-background)] items-center justify-center flex-grow hidden col-span-2 lg:flex">
          <Cart />
        </div>
      </div>
    </div>
  );
};

export default Specials;

const SpecialCardsContainer: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-5 shrink-0 snap-x">
      {specialItems &&
        specialItems.map((item, index) => (
          <SpecialCards slides={item} key={index} />
        ))}
    </div>
  );
};
