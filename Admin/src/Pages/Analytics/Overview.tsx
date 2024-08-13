import { Filter } from "lucide-react";
import Revenue from "../../Components/Analytics/DailyAnalytics";
import { MonthlyOrderChart } from "../../Components/BarChart/BarChart.tsx";
import { PieChartAnalytics } from "../../Components/PieChart/PieChart";
import {
  MonthlyOrderLinechart,
  MonthlyRevenueChart,
} from "../../Components/LineChart/LineChart";
import { Button } from "../../Components/Common/Button/Button";
import { useState } from "react";
import { Dayjs } from "dayjs";

const Overview: React.FC = () => {
  const [dateRange, setDateRange] = useState<{
    startDate: Dayjs | undefined;
    endDate: Dayjs | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

  const handleDateChange = (startDate: Dayjs, endDate: Dayjs) => {
    setDateRange({ startDate, endDate });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-5">
      <div>
        <Revenue />
      </div>
      <div className="flex flex-wrap items-center justify-between w-full gap-5 px-5 py-5">
        <div className="w-full h-full lg:max-w-[550px] flex flex-col items-center justify-center border rounded-md px-2 py-0 min-w-[400px] flex-grow">
          <MonthlyOrderChart
            dateRange={dateRange as { startDate: Dayjs; endDate: Dayjs }}
            height={400}
          />
        </div>

        <div className="w-full lg:max-w-[500px] min-w-[200px] border p-2 rounded-md">
          <MonthlyOrderLinechart
            dateRange={dateRange as { startDate: Dayjs; endDate: Dayjs }}
          />
        </div>
      </div>
      <div className="flex items-center flex-wrap justify-start w-full gap-3 px-5 ">
        <div className="w-full lg:max-w-[600px] border p-2 rounded-md">
          <MonthlyRevenueChart />
        </div>
        <div className="flex  relative justify-center items-center flex-grow border rounded w-[400px] ">
          <PieChartAnalytics />
        </div>
      </div>
    </div>
  );
};

export default Overview;
