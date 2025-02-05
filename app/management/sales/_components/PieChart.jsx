"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { formatNumberCommas } from "@/utils/generalHelpers";
import EmptyComponent from "@/components/Empty";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  "Web Development": {
    label: "Web dev",
    color: "hsl(var(--chart-1))",
  },
  "Web Designer": {
    label: "UI/UX",
    color: "hsl(var(--chart-2))",
  },
  Hosting: {
    label: "Hosting",
    color: "hsl(var(--chart-3))",
  },
  "3D Designer": {
    label: "3D desgnr",
    color: "hsl(var(--chart-4))",
  },
  "Graphics Designer": {
    label: "Graphics",
    color: "hsl(var(--chart-5))",
  },
  Others: {
    label: "Others",
    color: "hsl(var(--chart-6))",
  },
  "Domain Name": {
    label: "Domain",
    color: "hsl(var(--chart-7))",
  },
};

const PieChartComponent = ({ data }) => {
  const dynamicChartData = data?.map((item) => ({
    ...item,
    fill: chartConfig[item._id]?.color || "hsl(var(--default-chart-color))",
  }));
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-4">
        <CardTitle>Expenses Breakdown</CardTitle>
      </CardHeader>
      {data?.length === 0 ? (
        <div className="md:min-h-[250px] h-[200px] w-full flex items-center justify-center">
          <EmptyComponent />
        </div>
      ) : (
        <>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active) {
                      const name = payload[0]?.payload?._id;
                      const color = payload[0]?.payload?.fill;
                      const value = payload[0]?.payload?.totalCost;
                      return (
                        <div className="flex items-center gap-2 bg-[--foreground] px-3 py-2">
                          <div
                            style={{ background: color }}
                            className={`h-3 w-3`}
                          />
                          <p className="text-[.7rem]">{name}</p>
                          <p className="text-[.7rem] font-bold">{value}</p>
                        </div>
                      );
                    }
                  }}
                />
                <Pie
                  className="mb-2"
                  labelLine={false}
                  label={({ payload, ...props }) => {
                    return (
                      <text
                        cx={props.cx}
                        cy={props.cy}
                        x={props.x}
                        y={props.y}
                        textAnchor={props.textAnchor}
                        dominantBaseline={props.dominantBaseline}
                        fill="var(--primary-text-color)"
                        className="text-[--text-color] text-[.7rem]"
                      >
                        {formatNumberCommas(payload.totalCost)}
                      </text>
                    );
                  }}
                  data={dynamicChartData}
                  dataKey="totalCost"
                />
                <ChartLegend
                  content={<ChartLegendContent nameKey="_id" />}
                  className="-translate-y-2 text-[.65rem] mt-4 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="mt-4 flex-col text-[--primary-text-color] gap-2 text-[.6rem]">
            <div className="flex items-center gap-2 font-medium leading-none">
              All expenses spent to complete each other{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default PieChartComponent;
