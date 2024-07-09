import {
  Filter,
  Plus,
  Search,
} from "lucide-react";
import React, { useCallback, useState } from "react";
import FoodTable from "../../Components/Collection/FoodTable";
import UploadFood from "../../Components/Upload/UploadFood";
import Modal from "../../Components/Common/Popup/Popup";
import { DropDown } from "../../Components/Common/DropDown/DropDown";
import { debounce } from "../../Utility/Debounce";

const FoodPage: React.FC = () => {
  const [isModalOpen, setIsModelOpen] = useState<boolean>(true);
  const [userSearch,setUserSearch] = useState<string>();

  const closeModal = () => setIsModelOpen(true);

  const handleChange = (value : string) => {
     setUserSearch(value);
  }

  const debounceSearch = useCallback(debounce(handleChange,300),[userSearch]);


  return (
    <div className="w-full relative py-4 flex flex-col gap-10 sm:px-4  items-start justify-center ">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start justify-center gap-1">
          <h1 className="text-xl">Foods</h1>
          <h2 className="text-[14px] text-[var(--dark-secondary-text)] ">
            6 entries found
          </h2>
        </div>
      </div>
      <div className="flex items-center justify-between w-full gap-5 ">
        <form action="" className="relative">
          <Search className="absolute text-[var(--dark-secondary-text)]   cursor-pointer top-3 size-5 left-2" />
          <input
            type="search"
            onChange={(event)=>debounceSearch(event?.target.value)}
            className=" pl-9 border-[1px] placeholder:text-sm outline-none sm:w-[250px] w-full py-2 px-8 border-[var(--dark-secondary-text)] rounded  "
            placeholder="Search"
          />
        </form>
        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={() => setIsModelOpen(!isModalOpen)}
            className="flex items-center gap-2 justify-center bg-[var(--primary-color)] text-[var(--light-foreground)] py-[0.5rem] border-[1px] border-[var(--primary-color)] px-4 rounded"
          >
            <Plus className="size-4" />
            <h1 className="text-[15px]">Item</h1>
          </button>
          <DropDown
            children={
              <>
                {" "}
                <Filter className="size-4" />
                <span>Filter</span>
              </>
            }
            options={[]}
            style={{
              display: "flex",
              fontSize: "15px",
              borderRadius: "4px",
              padding: "0.5rem 1rem 0.5rem 1rem",
              color: "var(--dark-text)",
              border: "1px solid var(--dark-secondary-text)  ",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: "",
            }}
          />
        </div>
      </div>
      <FoodTable userInput={userSearch as string} />
      <div className=" ">
        <Modal close={isModalOpen} closeModal={closeModal}>
          <UploadFood />
        </Modal>
      </div>
    </div>
  );
};

export default FoodPage;
