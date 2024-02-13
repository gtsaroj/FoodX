
import Specials from "./Specials";

const Home = () => {
  return (
    <div className="flex items-center justify-center w-full h-full px-3 py-6 ">
      <div className="w-full max-w-[1800px] h-full flex flex-col gap-5">
        <div className="flex ">
          <Specials />
      
        </div>
      </div>
    </div>
  );
};

export default Home;
