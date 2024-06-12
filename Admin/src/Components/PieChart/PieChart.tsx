import { PieChart } from "@mui/x-charts";
import Select from "react-select";
import { selectOptions } from "../LineChart/data";

export default function ResponsiveChartExample() {
  return (
    <div className="lg:w-[400px] flex flex-col py-2  items-start px-2 justify-center w-full h-[300px] sm:h-[400px] rounded bg-[var(--light-background)]  ">
      <h2 className="text-xl text-[var(--primary-color)] ">
        Daily Orders
      </h2>
      {/* Using a plain div with inline styles */}
      <PieChart
        sx={{ cursor: "pointer" }}
        series={[
          {
            data: [
              { value: 450, label: "Momo", id: 1 },
              { value: 400, label: "Pizza", id: 2 },
              { value: 350, label: "Cold Drinks", id: 3 },
              { value: 250, label: "Hot Drinks", id: 4 },
              { value: 150, label: "Burger", id: 5 },
              { value: 450, label: "others", id: 6 },
            ],
            innerRadius: 30,
            outerRadius: 100,
            paddingAngle: 3,
            cornerRadius: 5,
          },
        ]}
        slotProps={{
          legend: {
            labelStyle: { fontSize: "12px" },
            itemMarkHeight: 10,
            itemMarkWidth: 10,
            direction: "row",
            position: { vertical: "bottom", horizontal: "middle" },
          },
        }}
        skipAnimation
      ></PieChart>
    </div>
  );
}

export const PieChartAnalytics = () => {
  return (
    <div className=" p-2 w-full px-2 py-2 sm:h-[400px] h-[500px] bg-[var(--light-background)] flex flex-col gap-7 items-end justify-center ">
            <h2 className="w-full text-left pb-4 text-xl text-[var(--primary-color)] ">
        Monthly & Weekly  Order
      </h2>

      <button className="sm:w-[200px] pb-5 w-full cursor-pointer">
        <Select className="" options={selectOptions}></Select>
      </button>
      <PieChart
        sx={{ cursor: "pointer" }}
        series={[
          {
            data: [
              { value: 450, label: "Momo", id: 1 },
              { value: 400, label: "Pizza", id: 2 },
              { value: 350, label: "Cold Drinks", id: 3 },
              { value: 250, label: "Hot Drinks", id: 4 },
              { value: 150, label: "Burger", id: 5 },
              { value: 450, label: "others", id: 6 },
            ],
            innerRadius: 30,
            outerRadius: 100,
            paddingAngle: 3,
            cornerRadius: 5,
          },
        ]}
        slotProps={{
          legend: {
            labelStyle: { fontSize: "12px" },
            itemMarkHeight: 10,
            itemMarkWidth: 10,
            direction: "row",
            position: { vertical: "bottom", horizontal: "right" },
          },
        }}
        skipAnimation
      ></PieChart>
    </div>
  );
};
