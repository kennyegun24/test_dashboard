"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWR from "swr";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import Spinner from "@/components/spinner";
import EmptyComponent from "@/components/Empty";

const chartConfig = {
  views: {
    label: "Page Views",
  },
  average: {
    label: "Average",
    color: "hsl(var(--chart-1))",
  },
  minDuration: {
    label: "Minimum",
    color: "hsl(var(--chart-2))",
  },
  maxDuration: {
    label: "Maximum",
    color: "hsl(var(--chart-3))",
  },
};

const SwitchChart = ({ setActiveChart }) => {
  const onChange = (e) => {
    setActiveChart(e);
  };
  return (
    <Select defaultValue="average" onValueChange={onChange}>
      <SelectTrigger className="w-fit text-[.8rem]">
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className="text-[.8rem]" value="average">
          Average
        </SelectItem>
        <SelectItem className="text-[.8rem]" value="maxDuration">
          Highs
        </SelectItem>
        <SelectItem className="text-[.8rem]" value="minDuration">
          Lows
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default function WebsietTraffic() {
  const [activeChart, setActiveChart] = React.useState("average");

  const fetcher = async () => {
    const fetchData = await fetch(`${BACKEND_API_ROUTE}/tracking`, {
      cache: "no-store",
    });
    const data = await fetchData.json();
    return await data;
  };
  const { data, error, isLoading } = useSWR(`trackings`, fetcher, {
    refreshInterval: null,
    errorRetryInterval: 5000,
    revalidateIfStale: false,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    errorRetryCount: 1,
  });
  return (
    <Card className="h-full shadows bg-[--foreground]">
      <CardHeader className="flex flex-col items-center space-y-0 border-b p-0 px-2 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Website Traffic Trends</CardTitle>
        </div>
        <div className="flex gap-3">
          <SwitchChart setActiveChart={setActiveChart} />
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-4 h-full">
        {isLoading ? (
          <div className="md:min-h-[250px] h-[200px] w-full flex items-center justify-center">
            <Spinner />
          </div>
        ) : data?.length === 0 ? (
          <div className="md:min-h-[250px] h-[200px] w-full flex items-center justify-center">
            <EmptyComponent />
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <LineChart
                accessibilityLayer
                data={data}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  dataKey={activeChart}
                  tickLine={true}
                  tickMargin={8}
                  width={23}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px] bg-[--background]"
                      nameKey="average"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                />
                <Line
                  dataKey={activeChart}
                  type="monotone"
                  stroke={`var(--color-${activeChart})`}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>

            <div className="leading-none text-center text-muted-foreground pb-4 pt-6 text-[.6rem]">
              {activeChart} website traffic
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
