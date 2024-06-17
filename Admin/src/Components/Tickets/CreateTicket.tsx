import React from "react";

const CreateTicket: React.FC = () => {
  return (
    <div className="w-full py-9 px-4 flex items-center justify-center">
      <form
        className="w-[700px] gap-16 flex flex-col items-center justify-center"
        action=""
      >
        <div
          className="w-full flex flex-col 
      items-start justify-center gap-6"
        >
          <label className="text-xl" htmlFor="">
            Feedback
          </label>
          <div className="h-[200px] text-start w-full">
            <input
              type="text"
              className=" h-full w-full outline-none py-2 placeholder:px-1 rounded placeholder:text-sm placeholder:text-[(--dark-secondary-text)]"
              placeholder="Write your feedback"
            />
          </div>
        </div>
        <button className=" rounded duration-150 py-3 w-full text-center text-[16px] hover:bg-[var(--primary-light)] bg-[var(--primary-color)] text-[var(--light-background)] ">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
