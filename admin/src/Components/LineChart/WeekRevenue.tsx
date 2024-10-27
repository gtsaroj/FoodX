import { LineChart } from "@mui/x-charts";


const WeekRevenue = () => {
  console.log(window.outerWidth);

  return (
    <div className="flex flex-col items-start justify-center gap-3 px-5 py-7">
      <div className="flex items-center justify-between w-full gap-3 px-5">
        <p className="text-xl font-normal text-[var(--dark-text)]">
          Weekly Revenue
        </p>
        <p className="text-sm text-[var(--dark-text)]">Filter</p>
      </div>
      <div>
        <LineChart
          xAxis={[
            {
              data: [1, 2, 3, 5, 8, 10],
            },
          ]}
          series={[
            {
              data: [2, 5.5, 2, 8.5, 1.5, 5],
            },
          ]}
          width={700}
          height={300}
          grid={{ vertical: true, horizontal: true }}
        />
      </div>
    </div>
  );
};

export default WeekRevenue;
