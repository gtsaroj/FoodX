import { Filter, Plus } from "lucide-react";
import React, { useState } from "react";
import Modal from "../Components/Common/Popup/Popup";
import { BannerTable } from "../Components/Collection/BannerTable";
import UploadBanner from "../Components/Upload/UploadBanner";
import { DropDown } from "../Components/Common/DropDown/DropDown";

const FoodPage: React.FC = () => {
  const [isModalOpen, setIsModelOpen] = useState<boolean>(true);

  const closeModal = () => setIsModelOpen(true);

  return (
    <div className="relative flex flex-col items-start justify-center w-full px-5 py-7 gap-7">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start justify-center gap-1">
          <h4 className="text-xl tracking-wide text-[var(--dark-text)]">
            Banners
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
      <BannerTable />
      <div className="absolute ">
        <Modal close={isModalOpen} closeModal={closeModal}>
          <UploadBanner />
        </Modal>
      </div>
    </div>
  );
};

export default FoodPage;
