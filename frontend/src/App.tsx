import Banner from "./Components/Carousel/Banner";
import Cart from "./Components/Cart/Cart";
import { MenuType } from "./Components/Category/MenuType";
import Footer from "./Components/Footer/Footer";
import { Header } from "./Components/Navbar/Navbar";

export const App: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-w-[100vw]  ">
      <div className="w-full h-full max-w-[1500px] flex flex-col justify-center items-center">
        <div className="mb-[100px] z-50">
          <Header />
        </div>
        <div className="flex gap-[10px] justify-between items-stretch">
          <Banner />
       
        </div>
        <div className="flex">
          <MenuType />
          <Cart />
     </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
};
