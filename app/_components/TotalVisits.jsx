"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Calendar } from "lucide-react";
import useSWR from "swr";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import Spinner from "@/components/spinner";
import EmptyComponent from "@/components/Empty";

const chartConfig = {
  views: {
    label: "Visits",
  },
  totalVisits: {
    label: "Visits",
    color: "hsl(var(--chart-blue))",
  },
};

const currentYear = new Date().getFullYear();
const years = [];
for (let year = 2024; year <= currentYear; year++) {
  years.push(year);
}

const YearlyMonthly = ({ setTimeFrame, timeFrame }) => {
  const onChange = (e) => {
    setTimeFrame((p) => ({
      ...p,
      year: null,
      timeFrame: e,
    }));
  };
  const onChangeYear = (value) => {
    setTimeFrame((prev) => ({
      ...prev,
      year: value,
    }));
  };
  return (
    <div className="flex gap-1">
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-fit text-[.8rem]">
          <SelectValue placeholder="Time frame" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="monthly" className="text-[.8rem]">
            Monthly
          </SelectItem>
          <SelectItem value="yearly" className="text-[.8rem]">
            Yearly
          </SelectItem>
        </SelectContent>
      </Select>
      {timeFrame.timeFrame === "monthly" && (
        <Select onValueChange={onChangeYear} className="max-w-[80px]">
          <SelectTrigger className="max-w-[80px] w-fit text-[.8rem]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year, index) => (
              <SelectItem className="text-[.8rem]" key={index} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default function TotalVisits() {
  const [activeChart, setActiveChart] = React.useState("totalVisits");
  const [timeFrame, setTimeFrame] = React.useState({
    timeFrame: "monthly",
    year: new Date().getFullYear(),
  });
  const fetcher = async () => {
    const fetchData = await fetch(
      `${BACKEND_API_ROUTE}/visits/totalVisits?timeframe=${timeFrame.timeFrame}&year=${timeFrame.year}`,
      {
        cache: "no-store",
      }
    );
    const data = await fetchData.json();
    return await data;
  };
  const { data, error, isLoading } = useSWR(
    `totaVisits ${timeFrame.year}${timeFrame.timeFrame}`,
    fetcher,
    {
      refreshInterval: null,
      errorRetryInterval: 5000,
      revalidateIfStale: false,
      revalidateOnMount: true,
      revalidateOnFocus: false,
      errorRetryCount: 1,
    }
  );
  return (
    <Card className="h-full shadows bg-[--foreground]">
      <CardHeader className="flex flex-col items-center space-y-0 border-b p-0 px-2 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total Visits</CardTitle>
        </div>
        <div className="flex gap-3">
          <YearlyMonthly setTimeFrame={setTimeFrame} timeFrame={timeFrame} />
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-0 sm:pt-4 sm:pb-4 h-full">
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
              className="aspect-auto md:h-[290px] h-[200px] w-full"
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
                  dataKey="_id"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date();
                    date.setMonth(value - 1);
                    return date.toLocaleString("default", { month: "short" });
                  }}
                />
                <YAxis
                  dataKey={"totalVisits"}
                  tickLine={true}
                  tickMargin={8}
                  width={23}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px] bg-[--background]"
                      nameKey="views"
                      labelFormatter={(value, p) => {
                        const type = p[0]?.payload?.type;
                        const month = p[0]?.payload?._id;
                        const date = new Date();
                        if (type === "monthly") {
                          date.setMonth(month - 1);
                          return date.toLocaleString("default", {
                            month: "long",
                          });
                        }
                        date.setFullYear(month);
                        return date.toLocaleString("default", {
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
              {timeFrame.timeFrame} website traffic
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
