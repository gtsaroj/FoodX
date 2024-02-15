import React from "react";
import { ArrowLeft } from "lucide-react";

export const SecondCard = () => {
  return (
    <div className="flex gap-[20px]  w-[350px]  items-center pr-[5px] rounded-xl justify-evenly">
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
      <button className="text-[19px] font-bold focus:text-[var(--secondary-color)]" > - </button>
      <span className="text-[14px] font-semibold"> 1</span>
      <button className="text-[19px] font-bold focus:text-[var(--secondary-color)] ">+</button>
    </div>
  </div>
  )
}

export const SecondCart = () => {
  return (
    <div className="py-[19px] px-[10px] w-full bg-[var(--light-foreground)] rounded-xl    flex flex-col items-center gap-5">
      <div className="flex flex-col gap-[30px] items-center border-b-[var(--dark-border)] border-b-[1px] w-full pb-8">
        <h3 className="text-[30px] font-semibold">Your Cart</h3>
        <SecondCard />
        <SecondCard />
        <SecondCard />
        
          </div>
          <div className="flex items-center justify-between w-[350px]  px-[10px]">
            <h3>Total : </h3>
            <h3>550</h3>
          </div>
    </div>
  );
};

export const Payment: React.FC = () => {
    return (
      <div className=" flex flex-col items-baseline justify-between w-full gap-20 px-[30px]">
            <h3 className="flex gap-[3px] hover:gap-[7px] transition-all cursor-pointer text-[15px] items-center"> <span className="font-semibold "> <ArrowLeft className="w-[10px]"/> </span>Back To Home</h3>
            <div className="flex gap-[20px] flex-col sm:flex-row items-stretch justify-center w-full px-[50px]">
          
          <SecondCart />
          <div className="flex flex-col w-full items-center gap-[30px] px-[10px] py-[20px] bg-[var(--light-foreground)] rounded-xl ">
            <h3 className="text-[30px] font-semibold">Payment Method</h3>
            <div className="flex flex-col w-full justify-between  items-center gap-[30px]">
              <div className="flex items-center gap-[20px] ">
                <div className=" flex  items-center  gap-[3px] w-[100px] py-[7px] px-[10px] hover:border-[1px] hover:border-[var(--primary-color)] cursor-pointer text-[var(--dark-text)] bg-[var(--light-background)] rounded-md ">
                  <div className="">
                    <img  className="w-[20px] object-cover transform scale-[7]" src="../../../public/logo/esewa.png" alt="" />
                  </div>
                  Esewa
                </div>
                <div className=" bg-[var(--light-background)] flex  items-center  gap-[3px] hover:border-[1px] hover:border-[var(--primary-color)] cursor-pointer w-[100px] py-[7px] px-[10px] text-[var(--dark-text)]   h-[40px] rounded-md ">
                  <div className="">
                    <img  className="w-[20px] object-cover transform scale-[7]" src="../../../public/logo/khalti.png" alt="" />
                  </div>
                  Khalti
                </div>
                <div className="  bg-[var(--light-background)] flex  items-center  gap-[3px] hover:border-[1px] hover:border-[var(--primary-color)] cursor-pointer w-[90px] py-[7px] px-[10px] text-[var(--dark-text)]  h-[40px] rounded-md ">
                  <div className="">
                    <img  className="w-[20px] object-cover transform scale-[7]" src="../../../public/logo/ime.png" alt="" />
                  </div>
                  Hamro
                </div>
              </div>
              <div>
                <form action="" className="flex flex-col gap-[20px] items-center ">
                  <div className="flex flex-col gap-[1px] ">
                    <label htmlFor="">fullname</label>
                    <input
                      type="text"
                      placeholder="Your fullname"
                      className="w-full px-[20px] py-[6px] border-[1px] border-[var(--dark-border)] rounded-md outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-[1px] ">
                    <label htmlFor="">contact number</label>
                    <input
                      type="text"
                      placeholder="Your contact number"
                      className="w-full px-[20px] py-[6px] border-[1px] border-[var(--dark-border)] rounded-md outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-[1px]   ">
                    <label htmlFor="">gmail</label>
                    <input
                      type="text"
                      placeholder="Your gmail"
                      className="w-full px-[20px] py-[6px] border-[1px] border-[var(--dark-border)] rounded-md outline-none"
                    />
                  </div>
                </form>
              </div>
              <div className="flex bg-[var(--primary-color)] text-[var(--light-foreground)] cursor-pointer justify-center w-[360px] rounded-md border-[1px] py-[8px] px-[10px]">
                <button>Pay Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>

  );
};
