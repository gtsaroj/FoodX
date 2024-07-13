import { Filter, Plus, Search } from "lucide-react";
import React, { useCallback, useState } from "react";
import FoodTable from "../../Components/Collection/FoodTable";
import UploadFood from "../../Components/Upload/UploadFood";
import Modal from "../../Components/Common/Popup/Popup";
import { DropDown } from "../../Components/Common/DropDown/DropDown";
import { debounce } from "../../Utility/Debounce";

const FoodPage: React.FC = () => {
  const [isModalOpen, setIsModelOpen] = useState<boolean>(true);
  const [userSearch, setUserSearch] = useState<string>();

  const closeModal = () => setIsModelOpen(true);

  const handleChange = (value: string) => {
    setUserSearch(value);
  };

  const debounceSearch = useCallback(debounce(handleChange, 300), [userSearch]);

  return (
    <div className="relative flex flex-col items-start justify-center w-full px-5 py-7 gap-7 ">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start justify-center gap-1">
          <h4 className="text-xl tracking-wide text-[var(--dark-text)]">
            Products
          </h4>
          <p className="text-[14px] text-[var(--dark-secondary-text)] text-nowrap ">
            6 entries found
          </p>
        </div>
        <div className="flex items-center justify-center gap-5 ">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setIsModelOpen(!isModalOpen)}
              className="flex items-center gap-2 justify-center bg-[var(--primary-color)] text-[var(--light-foreground)] py-[0.5rem] border-[1px] border-[var(--primary-color)] px-4 rounded"
            >
              <Plus className="size-4" />
              <p className="text-[15px]">Item</p>
            </button>
            <DropDown
              children={
                <>
                  <Filter className="size-4 text-[var(--dark-secondary-text)]" />
                  <span className="text-[var(--dark-secondary-text)]">
                    Filter
                  </span>
                </>
              }
              options={[]}
              style={{
                display: "flex",
                fontSize: "15px",
                borderRadius: "4px",
                padding: "0.5rem 1rem 0.5rem 1rem",
                color: "var(--dark-text)",
                border: "1px solid var(--light-secondary-text)  ",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                background: "",
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-start w-full ">
        <form action="" className="relative w-full">
          <label htmlFor="search">
            <Search className="absolute text-[var(--dark-secondary-text)] cursor-pointer top-3 size-5 left-2" />
          </label>
          <input
            id="search"
            type="search"
            onChange={(event) => debounceSearch(event?.target.value)}
            className=" pl-9 border placeholder:text-sm outline-none sm:w-[250px] w-full py-2 px-8 border-[var(--dark-secondary-background)] rounded bg-transparent focus:border-[var(--primary-color)] "
            placeholder="Search"
          />
        </form>
      </div>

      <FoodTable userInput={userSearch as string} />

      <Modal close={isModalOpen} closeModal={closeModal}>
        <UploadFood />
      </Modal>
    </div>
  );
};

export default FoodPage;
