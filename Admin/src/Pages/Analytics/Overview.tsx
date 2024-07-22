import { Filter } from "lucide-react";
import Revenue from "../../Components/Analytics/DailyAnalytics";
import { MonthlyOrderChart } from "../../Components/BarChart/BarChart";
import { PieChartAnalytics } from "../../Components/PieChart/PieChart";
import { WeekReveneuChart } from "../../Components/LineChart/LineChart";

const Overview = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-5">
      <div>
        <Revenue />
      </div>
      <div className="flex flex-wrap items-center justify-between w-full gap-5 px-5 py-5">
        <div className="w-full h-full lg:max-w-[550px] flex flex-col items-center justify-center border rounded-md px-2 py-5 min-w-[400px] flex-grow">
          <p className="w-full px-5 text-xl text-[var(--dark-text)] tracking-wider gap-2s flex items-center justify-between">
            Top Products
            <span className="text-xs  text-[var(--dark-secondary-text)] cursor-pointer flex gap-1 items-center justify-center">
              <Filter size={15} />
              Filter
            </span>
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
        <div className="flex flex-col justify-between items-center flex-grow border w-full lg:max-w-[400px] ">
          <PieChartAnalytics />
        </div>
      </div>
    </div>
  );
};


export default Overview;
