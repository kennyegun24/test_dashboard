"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import EmptyComponent from "@/components/Empty";
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  Pending: {
    label: "Pending",
    color: "hsl(var(--chart-1))",
  },
  Cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-2))",
  },
  "In Progress": {
    label: "In Progress",
    color: "hsl(var(--chart-3))",
  },
  Completed: {
    label: "Completed",
    color: "hsl(var(--chart-4))",
  },
};
const LeadManagement = ({ leads }) => {
  const dynamicChartData = leads?.map((item) => ({
    ...item,
    fill: chartConfig[item.status]?.color || "hsl(var(--default-chart-color))",
  }));
  return (
    <Card className="flex flex-col bg-[--foreground] h-full">
      <CardHeader className="items-center pb-4">
        <CardTitle>Leads Management</CardTitle>
      </CardHeader>
      {leads?.length === 0 ? (
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
                      const name = payload[0]?.payload?.status;
                      const color = payload[0]?.payload?.fill;
                      const value = payload[0]?.payload?.count;
                      return (
                        <div className="flex items-center gap-2 bg-[--background] px-3 py-2">
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
                        className="text-[--text-color]"
                      >
                        {payload.count}
                      </text>
                    );
                  }}
                  data={dynamicChartData}
                  dataKey="count"
                />
                <ChartLegend
                  content={<ChartLegendContent nameKey="status" />}
                  className="-translate-y-2 text-[.55rem] mt-4 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="mt-4 flex-col gap-2 text-[.7rem]">
            <div className="leading-none text-muted-foreground text-[.6rem]">
              Showing total visitors for every month
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default LeadManagement;
