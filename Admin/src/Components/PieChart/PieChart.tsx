import { PieChart, useDrawingArea } from "@mui/x-charts";
import data from "../../data.json";
import { Tooltip, styled } from "@mui/material";
import { useEffect } from "react";

export const PieChartAnalytics = () => {
  const { categoryData } = data;

  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 20,
  }));

  function PieCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
  }

  


  const handleMouseHover = (event: MouseEvent) => {
    const cell = document.getElementsByClassName(event.classes.cell)
    console.log(cell)
  }

  return (
    <div className="w-full py-6 h-[350px] sm:h-[430px]">
      <h1 className="text-xl tracking-wider px-3 ">Top Food Categories</h1>
      <div className="w-full h-full ">
        <PieChart
           sx={{cursor:"pointer"}}
          series={
            [
              {
                data: categoryData?.map((data, index) => ({
                  value: data.products,
                  label: data.categoryname,
                  id: index,
                  color: data.color,
                })),

                highlightScope:{fade:"series", highlight:"item"},
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: -90,
                endAngle: 180,
              
              },
          
            ]

          }
     
          slotProps={{
            legend: {
              position: { horizontal: "right", vertical: "middle" }, itemMarkWidth: 15, itemMarkHeight: 15, labelStyle: {
                fontSize: 17,
                letterSpacing: 1
          }}}}
        >

        </PieChart>
      </div>
    </div>
  );
};
