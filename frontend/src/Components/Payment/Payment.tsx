import React from "react";
import { ArrowLeft } from "lucide-react";

export const SecondCard = () => {
  return (
    <div className="flex gap-[20px]    items-center pr-[5px] rounded-xl justify-evenly">
      <div className="w-[100px]  ">
        <img
          src="https://www.biofournil.com/wp-content/uploads/2021/02/BRIOCHE-BIOFOURNIL_web.jpg"
          alt=""
          className="rounded-xl"
        />
      </div>
      <div>
        <h3 className="text-[14px] font-semibold text-[var(--dark-foreground)]">
          Burger XL
        </h3>
        <h3 className="text-[13px] font-semibold text-[var(--dark-foreground)]">
          RS 450
        </h3>
        <h3 className="text-[13px] text-[var(--dark-text)] ">QTY. 3</h3>
      </div>

      <div className="w-[80px] h-[30px] justify-center rounded-2xl py-[5px] px-[8px] flex gap-[15px] items-center border-[1px] border-[var(--dark-border)]">
        <button className="text-[19px] font-bold focus:text-[var(--secondary-color)]">
          {" "}
          -{" "}
        </button>
        <span className="text-[14px] font-semibold"> 1</span>
        <button className="text-[19px] font-bold focus:text-[var(--secondary-color)] ">
          +
        </button>
      </div>
    </div>
  );
};

export const SecondCart = () => {
  return (
    <div className="py-[19px] px-[10px] w-full bg-[var(--light-foreground)] rounded-xl    flex flex-col items-center gap-5">
      <div className="flex flex-col gap-[30px] items-center border-b-[var(--dark-border)] border-b-[1px] w-full pb-8">
        <h3 className="sm:text-[30px]  text-xl font-semibold">Your Cart</h3>
        <SecondCard />
        <SecondCard />
        <SecondCard />
      </div>
      <div className="flex items-center justify-between w-[350px]  sm:px-[10px] px-[20px]">
        <h3>Total : </h3>
        <h3>550</h3>
      </div>
    </div>
  );
};

export const Payment: React.FC = () => {
  return (
    <div className=" flex flex-col items-baseline justify-between w-full gap-20 sm:px-[30px] px-[5px]">
      <h3 className="flex gap-[3px] hover:gap-[7px] transition-all cursor-pointer text-[15px] items-center">
        {" "}
        <span className="font-semibold ">
          {" "}
          <ArrowLeft className="w-[10px]" />{" "}
        </span>
        Back To Home
      </h3>
      <div className="flex gap-[20px] flex-col md:flex-row items-stretch justify-center w-full md:px-[50px] sm:px-[40px] px-[0px] ">
        <SecondCart />
        <div className="flex flex-col w-full items-center gap-[30px] px-[10px] py-[20px] bg-[var(--light-foreground)] rounded-xl ">
          <h3 className="sm:text-[30px]  text-xl font-semibold">
            Payment Method
          </h3>
          <div className="flex flex-col w-full justify-between  items-center gap-[30px]">
            <div className="flex items-center sm:gap-[20px] gap-[10px] ">
              <div className=" flex  items-center  gap-[3px] sm:w-[100px] w-full sm:py-[7px] sm:px-[10px] py-3 px-2 hover:border-[1px] hover:border-[var(--primary-color)] cursor-pointer text-[var(--dark-text)] bg-[var(--light-background)] rounded-md ">
                <div className="">
                  <img
                    className="w-[20px] object-cover transform scale-[7]"
                    src="../../../public/logo/esewa.png"
                    alt=""
                  />
                </div>
                <span className="md:text-lg sm:text-md text-sm" >Esewa</span> 
              </div>
              <div className=" bg-[var(--light-background)] flex  items-center  gap-[3px] hover:border-[1px] hover:border-[var(--primary-color)] cursor-pointer sm:w-[100px] w-full py-[7px] px-[10px] text-[var(--dark-text)]   h-[40px] rounded-md ">
                <div className="">
                  <img
                    className="w-[20px] object-cover transform scale-[7]"
                    src="../../../public/logo/khalti.png"
                    alt=""
                  />
                </div>
                <span className="md:text-lg sm:text-md text-sm" >Khalti</span> 
              </div>
              <div className=" bg-[var(--light-background)] flex  items-center  gap-[3px] hover:border-[1px] hover:border-[var(--primary-color)] cursor-pointer sm:w-[100px] w-full  py-[7px] px-[10px] text-[var(--dark-text)]   h-[40px] rounded-md ">
                <div className="">
                  <img
                    className="w-[20px] object-cover transform scale-[7]"
                    src="../../../public/logo/ime.png"
                    alt=""
                  />
                </div>
                <span className="md:text-lg sm:text-md text-sm" >Ime</span> 
              </div>
            </div>
            <div>
              <form
                action=""
                className="flex flex-col gap-[20px] items-center "
              >
                <div className="flex flex-col gap-[1px] ">
                  <label htmlFor="">Full Name</label>
                  <input
                    type="text"
                    className="w-full text-sm px-[20px] py-2 border-[1px] border-[var(--light-border)] focus:bg-[var(--light-border)]   rounded-md outline-none"
                  />
                </div>
                <div className="flex flex-col gap-[1px] ">
                  <label htmlFor="">Contact No.</label>
                  <input
                    type="text"
                    className="w-full text-sm px-5 py-2 border-[1px] border-[var(--light-border)]  focus:bg-[var(--light-border)] rounded-md outline-none"
                  />
                </div>
                <div className="flex flex-col gap-[1px]   ">
                  <label htmlFor="">Gmail</label>
                  <input
                    type="text"
                    className="w-full text-sm px-5 py-[6px] border-[1px] border-[var(--light-border)]  focus:bg-[var(--light-border)] rounded-md outline-none"
                  />
                </div>
                <div className="flex  bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] transition-all duration-150 text-[var(--light-foreground)] cursor-pointer justify-center w-full rounded-md border-[1px] py-2 px-5">
                  <button>Pay Now</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
