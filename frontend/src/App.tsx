import Footer from "./Components/Footer/Footer";
import { Header } from "./Components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import {Payment} from "./Components/Payment/Payment.tsx"

export const App: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-w-[100vw]  ">
      <div className="w-full h-full max-w-[1500px] flex flex-col justify-center items-center ">
        <div className="mb-[100px] z-50">
          <Header />
        </div>
        <div className="w-full">
          <Home />
        </div>
        <Payment/>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
};
