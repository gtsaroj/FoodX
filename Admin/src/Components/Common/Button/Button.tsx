import React, {
  ChangeEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Selector } from "../../Selector/Selector";
import { id } from "date-fns/locale";

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
    setCheckedState((prevState) => ({
      ...prevState,
      [id]: isChecked,
    }));
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
        className={`flex border    flex-col items-start gap-5  p-2  z-[100]  duration-100 absolute ${
          show
            ? "visible translate-y-0 opacity-100 "
            : "invisible -translate-y-2 opacity-0 "
        } flex-col shadow-sm w-full  shadow-[#0000000e] items-start justify-center gap-1 bg-[var(--light-foreground)]  rounded `}
      >
        <div className="flex flex-col w-full items-start justify-center  gap-3">
          <h1 className="text-[18px] tracking-wider ">Types</h1>
          <div className="w-full  flex items-center justify-around gap-5">
            {types?.map(
              (data) =>
                checkFn &&
                data.value && (
                  <div
                    key={data.id}
                    className="w-full flex items-center justify-start gap-2 cursor-pointer"
                  >
                    <input
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        handleCheckboxChange(
                          data.id,
                          data.value,
                          event.target.checked
                        );
                      }}
                      checked={checkedState[data.id] || false}
                      type="checkbox"
                      className="w-4 h-4 "
                      ref={reference as any}
                    />
                    <span className=" text-[17px] tracking-wide ">
                      {" "}
                      {data.label}
                    </span>
                  </div>
                )
            )}
          </div>
        </div>
        <div className="flex w-full flex-col items-start justify-center  gap-3">
          <div className="w-full flex items-center justify-between px-2">
            <h1 className="text-[18px] tracking-wider ">Sort By</h1>
            <div className="w-[150px] h-[50px]">
              <Selector
                categoryOption={[
                  { label: "Low to High", value: "asc" },
                  { label: "High to Low", value: "desc" },
                ]}
                setField={(type) => sortFn(type as "asc" | "desc")}
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
                    className="flex items-center cursor-pointer justify-start gap-2"
                  >
                    <input
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        handleCheckboxChange(
                          data.id,
                          data.value,
                          event.target.checked
                        );
                      }}
                      checked={checkedState[data.id] || false}
                      type="checkbox"
                      className="w-4 h-4"
                      ref={reference as any}
                    />
                    <span className=" text-[17px] tracking-wide ">
                      {" "}
                      {data.label}
                    </span>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
