import { Filter } from "lucide-react";
import Revenue from "../../Components/Analytics/DailyAnalytics";
import { MonthlyOrderChart } from "../../Components/BarChart/BarChart";
import { PieChartAnalytics } from "../../Components/PieChart/PieChart";
import { WeekReveneuChart } from "../../Components/LineChart/LineChart";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import { DropDown } from "../../Components/Common/DropDown/DropDown";
import { DatePickerDemo } from "../../Components/DatePicker/DatePicker";
import { Button } from "../../Components/Common/Button/Button";

const Overview = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-5">
      <div>
        <Revenue />
      </div>
      <div className="flex flex-wrap items-center justify-between w-full gap-5 px-5 py-5">
        <div className="w-full h-full lg:max-w-[550px] flex flex-col items-center justify-center border rounded-md px-2 py-5 min-w-[400px] flex-grow">
          <p className="w-full px-5 text-xl text-[var(--dark-text)] tracking-wider gap-2 flex items-center justify-between">
            Top Products
            <div>
              <Button
                parent={
                  <button
                    className="flex w-full duration-150 hover:text-[var(--dark-text)] text-[var(--dark-secondary-text)] items-center gap-1.5 p-2 rounded 
               justify-center"
                  >
                    <Filter className="size-5" />
                    <span className=" text-[17px] tracking-wider ">Filter</span>
                  </button>
                }
                children={["Last month", <DatePickerDemo />]}
                onSelect={(value) => console.log(value)}
              />
            </div>
          </p>
          <MonthlyOrderChart height={400} />
        </div>

        <div className="w-full lg:max-w-[500px] min-w-[200px] border p-2 rounded-md">
          <WeekReveneuChart />
        </div>
      </div>
      <div className="flex items-center flex-wrap justify-start w-full gap-3 px-5 ">
        <div className="w-full lg:max-w-[600px] border p-2 rounded-md">
          <WeekReveneuChart />
        </div>
        <div className="flex  relative justify-center items-center flex-grow border rounded w-[400px] ">
          <PieChartAnalytics />
        </div>
      </div>
    </div>
  );
};

export default Overview;
