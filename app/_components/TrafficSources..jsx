"use client";

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
import EmptyComponent from "@/components/Empty";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  Africa: {
    label: "Africa",
    color: "hsl(var(--chart-1))",
  },
  Antarctica: {
    label: "Antarctica",
    color: "hsl(var(--chart-2))",
  },
  Europe: {
    label: "Europe",
    color: "hsl(var(--chart-3))",
  },
  "South America": {
    label: "South America",
    color: "hsl(var(--chart-4))",
  },
  "North America": {
    label: "North America",
    color: "hsl(var(--chart-5))",
  },
  Oceania: {
    label: "Oceania",
    color: "hsl(var(--chart-6))",
  },
  Asia: {
    label: "Asia",
    color: "hsl(var(--chart-7))",
  },
};
const TrafficSources = ({ sources }) => {
  const dynamicChartData = sources?.map((item) => ({
    ...item,
    fill:
      chartConfig[item.continent]?.color || "hsl(var(--default-chart-color))",
  }));
  return (
    <Card className="flex flex-col bg-[--foreground] h-full">
      <CardHeader className="items-center pb-4">
        <CardTitle>Traffic Sources</CardTitle>
      </CardHeader>
      {sources?.length === 0 ? (
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
                      const name = payload[0]?.payload?.continent;
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
                  content={<ChartLegendContent nameKey="continent" />}
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

export default TrafficSources;
