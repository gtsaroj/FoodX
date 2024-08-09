import React, {
  ChangeEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoMdArrowDropdown } from "react-icons/io";

interface ButtonProp {
  parentStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  parent: React.ReactNode;
  sort?: { label: ReactNode | string; value: string; id: string }[];
  types?: { label: ReactNode | string; value: string; id: string }[];
  children?: React.ReactNode[] | string[];
  onSelect?: (value: string) => void;
  sortFn: (type: "asc" | "desc") => void;
  checkFn?: (isChecked: boolean, value: string) => void;
}

export const Button: React.FC<ButtonProp> = ({
  parent,
  bodyStyle,
  sort,
  types,
  checkFn,
  sortFn,
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [index, setIndex] = useState<string>();
  const reference = useRef<HTMLInputElement>();
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleCheckboxChange = (
    id: string,
    value: string,
    isChecked: boolean
  ) => {
    setCheckedState({ [id]: isChecked });
    if (checkFn) {
      checkFn(isChecked, value);
    }
  };

  return (
    <div className="relative ">
      <div
        className=" cursor-pointer flex justify-end"
        onClick={() => setShow(!show)}
      >
        {parent}
      </div>
      <div
        style={bodyStyle}
        className={`flex border    flex-col items-start gap-5  px-4 py-3  z-[100]  duration-100 absolute ${
          show
            ? "visible translate-y-0 opacity-100 "
            : "invisible -translate-y-2 opacity-0 "
        } flex-col shadow-sm w-full  shadow-[#0000000e] items-start justify-center gap-1 bg-[var(--light-foreground)]  rounded `}
      >
        <div
          className={`flex ${
            types && types?.length > 0 ? "visible" : "hidden"
          } flex-col w-full items-start justify-center  gap-4`}
        >
          <h1 className="text-[18px] tracking-wider ">Types</h1>
          <div className="w-full  flex items-center justify-around gap-5">
            {types?.map(
              (data) =>
                checkFn &&
                data.value && (
                  <div
                    key={data.id}
                    className="w-full   flex items-center justify-start gap-2 cursor-pointer"
                  >
                    <input
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        handleCheckboxChange(
                          data.id,
                          data.value,
                          event.target.checked
                        );
                      }}
                      id={data.value}
                      checked={checkedState[data.id] || false}
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer accent-black"
                      ref={reference as any}
                    />
                    <label
                      htmlFor={data.value}
                      className=" text-[17px] cursor-pointer tracking-wide "
                    >
                      {" "}
                      {data.label}
                    </label>
                  </div>
                )
            )}
          </div>
        </div>
        <div className="flex w-full flex-col items-start justify-start  gap-7">
          <div className="w-full flex items-center justify-between ">
            <h1 className="text-[18px] tracking-wider ">Sort By</h1>
            <div className="w-[130px]">
              <Selector
                data={[
                  { label: "Low to High", value: "asc" },
                  { label: "High to Low", value: "desc" },
                ]}
                onSelect={(type) => sortFn(type as "asc" | "desc")}
              />
            </div>
          </div>
          <div className=" flex  overflow-auto items-center justify-around gap-10">
            {sort?.map(
              (data) =>
                checkFn &&
                data.value && (
                  <div
                    key={data.id}
                    className="flex items-center  justify-start gap-2"
                  >
                    <input
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        handleCheckboxChange(
                          data.id,
                          data.value,
                          event.target.checked
                        );
                      }}
                      id={data.value}
                      checked={checkedState[data.id] || false}
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer accent-slate-950  "
                      ref={reference as any}
                    />
                    <label
                      htmlFor={data.value}
                      className=" text-[17px] cursor-pointer tracking-wide "
                    >
                      {" "}
                      {data.label}
                    </label>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface SelectorProp {
  data: { label: string; value: "asc" | "desc" }[];
  onSelect: (value: "asc" | "desc") => void;
}
const Selector: React.FC<SelectorProp> = ({ data, onSelect }) => {
  const [show, setShow] = useState<boolean>(false);
  const [showField, setShowField] = useState<string>("Low to High");
  return (
    <div className="w-full relative group/selector border-[1px] rounded px-2 border-[var(--light-secondary-text)]">
      <div
        onClick={() => setShow(!show)}
        className="flex items-center cursor-pointer  justify-between"
      >
        <input
          type="text"
          className="w-full text-[var(--dark-secondary-text)]  outline-none cursor-pointer "
          readOnly
          value={showField}
        />
        <IoMdArrowDropdown className="size-7 text-[var(--dark-secondary-text)] " />
      </div>
      <div
        className={` p-0.5 bg-[var(--light-foreground)] overflow-auto left-0 top-7 z-[1000] shadow shadow-[#0000003a] rounded-b-lg absolute flex flex-col  gap-1 w-full transition-all duration-300  ${
          show
            ? "max-h-64 opacity-100"
            : "max-h-0 opacity-0 transform -translate-y-2"
        }`}
      >
        {data?.map((option) => (
          <p
            onClick={() => {
              onSelect(option.value);
              setShowField(option.label);
              setShow(false);
            }}
            key={option.label}
            className="text-[var(--dark-secondary-text)]  text-start text-[16px] p-1 cursor-pointer hover:bg-slate-200 w-full rounded"
          >
            {option.label}
          </p>
        ))}
      </div>
    </div>
  );
};
