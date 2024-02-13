import Cart from "./Components/Cart/Cart";
import { MenuType } from "./Components/Category/MenuType";
import Footer from "./Components/Footer/Footer";
import { Header } from "./Components/Navbar/Navbar";
import Banner from "./Pages/Home/Banner";
import Home from "./Pages/Home/Home";

export const App: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-w-[100vw]  ">
      <div className="w-full h-full max-w-[1500px] flex flex-col justify-center items-center">
        <div className="mb-[100px] z-50">
          <Header />
        </div>
        <div className="w-full h-full flex justify-between items-stretch px-[20px]"> 
          <div className="w-[900px] h-[400px]">
          <Banner />
        </div>
          <Cart/>
        </div>
        <div className="flex gap-[10px] justify-between items-stretch">
          <Home />
        </div>
        <div>
          <MenuType />
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
};
