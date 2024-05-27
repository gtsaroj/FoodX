import React from "react";

const UploadFood: React.FC = () => {
  return (
    <React.Fragment>
      <div className="w-[600px] h-[300px] flex flex-col items-start justify-center gap-11 py-10 px-5 bg-[var(--light-background)] rounded-md shadow-inner ">
        <div className=" w-full flex items-center justify-between">
          <h1 className="text-[22px] text-[var(--dark-text)] font-semibold ">Add Food</h1>
          <button className="bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] duration-200 text-[15px] px-10 py-3 rounded-sm text-[var(--light-foreground)] ">Save</button>
       </div>
        <form className=" flex flex-col items-start justify-center gap-4" action="">
          <div className="w-full flex items-center justify-between">
          <div className="flex flex-col items-start justify-center gap-1">
          <label
                className="text-[17px] font-semibold text-[var(--dark-text)] "
                htmlFor=""
              >Product Name</label>
            <input type="text" className="py-2 px-3 rounded-md outline-none" />
          </div>
            <div className="flex w-[230px] flex-col items-start justify-center gap-1">
            <label
                className="text-[17px] font-semibold text-[var(--dark-text)] "
                htmlFor=""
              >Image</label>
               <input type="file"/>
            </div>
          </div>

          <div className="w-full flex items-start justify-between gap-10">
            <div className="flex gap-1 flex-col items-start justify-center">
              <label
                className="text-[17px] font-semibold text-[var(--dark-text)] "
                htmlFor=""
              >Category</label>
              <select id="foodlist" className=" flex justify-center items-center gap-2 py-2.5 text-[var(--dark-text)] border  px-16 outline-none cursor-pointer rounded-md">
                <option className="px-16 cursor-pointer py-2 border bg-slate-500 " value="Pizza">Pizza</option>
                <option className="px-16 cursor-pointer py-2 border bg-slate-500 " value="MoMo">MoMo</option>
                <option className="px-16 cursor-pointer py-2 border bg-slate-500 " value="Cold Drinks">Cold Drinks</option>
                <option className="px-16 cursor-pointer py-2 border bg-slate-500 " value="Hot Drinks">Hot Drinks</option>
              </select>
            </div>
            <div className="flex flex-col items-start justify-center gap-1">
            <label
                className="text-[17px] font-semibold text-[var(--dark-text)] "
                htmlFor=""
              >Price</label>
              <input
                type="text"
                className="py-2 px-3 rounded-md outline-none"
              />
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default UploadFood;
