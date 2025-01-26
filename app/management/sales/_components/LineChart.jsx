"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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

const chartConfig = {
  views: {
    label: "Revenue",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
};

const generateMonthRanges = () => {
  const months = [
    { month: "January", no: 1 },
    { month: "February", no: 2 },
    { month: "March", no: 3 },
    { month: "April", no: 4 },
    { month: "May", no: 5 },
    { month: "June", no: 6 },
    { month: "July", no: 7 },
    { month: "August", no: 8 },
    { month: "September", no: 9 },
    { month: "October", no: 10 },
    { month: "November", no: 11 },
    { month: "December", no: 12 },
  ];
  const monthRanges = [];
  for (let i = 0; i < months.length; i++) {
    const startMonth = months[i];
    const endMonth = months[(i + 1) % months.length]; // Wrap around to January
    monthRanges.push({
      startMonthName: startMonth.month,
      startMonthNumber: startMonth.no,
      endMonthName: endMonth.month,
      endMonthNumber: endMonth.no,
    });
  }
  return monthRanges;
};

const SelectMonth = ({ setTimeFrame, timeFrame }) => {
  const monthRanges = generateMonthRanges();

  const onChange = (value) => {
    const [startMonth, endMonth] = value.split(",");
    setTimeFrame((prev) => ({
      ...prev,
      startMonth,
      endMonth,
    }));
  };

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2024; year <= currentYear; year++) {
    years.push(year);
  }

  const onChangeYear = (value) => {
    setTimeFrame((prev) => ({
      ...prev,
      year: value,
    }));
  };

  return (
    <div className="flex gap-1">
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
      {timeFrame.year && (
        <Select onValueChange={onChange} className="max-w-[80px]">
          <SelectTrigger className="max-w-[100px] text-[.8rem]">
            <SelectValue placeholder="From - To" />
          </SelectTrigger>
          <SelectContent>
            {monthRanges.map(
              (
                {
                  startMonthName,
                  startMonthNumber,
                  endMonthName,
                  endMonthNumber,
                },
                index
              ) => (
                <SelectItem
                  key={index}
                  value={`${timeFrame.year}-${startMonthNumber},${timeFrame.year}-${endMonthNumber}`}
                  className="flex gap-2 flex-row"
                >
                  <div className="flex items-center pr-2 text-[.8rem]">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{`${startMonthName} - ${endMonthName}`}</span>
                  </div>
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

const YearlyMonthly = ({ setTimeFrame }) => {
  const onChange = (e) => {
    setTimeFrame((p) => ({
      ...p,
      year: null,
      startMonth: null,
      endMonth: null,
      timeFrame: e,
    }));
  };
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-fit text-[.8rem]">
        <SelectValue placeholder="Time frame" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="daily" className="text-[.8rem]">
          Daily
        </SelectItem>
        <SelectItem value="monthly" className="text-[.8rem]">
          Monthly
        </SelectItem>
        <SelectItem value="yearly" className="text-[.8rem]">
          Yearly
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default function Component() {
  const [activeChart, setActiveChart] = React.useState("revenue");
  const [timeFrame, setTimeFrame] = React.useState({
    timeFrame: "monthly",
    startMonth: null,
    endMonth: null,
    year: null,
  });
  const fetcher = async () => {
    const fetchData = await fetch(
      `${BACKEND_API_ROUTE}/sales/trends?timeframe=${timeFrame.timeFrame}&startMonth=${timeFrame.startMonth}&endMonth=${timeFrame.endMonth}`,
      {
        cache: "no-store",
      }
    );
    const data = await fetchData.json();
    return await data?.data;
  };
  const { data, error, isLoading } = useSWR(
    `trenffdfssdfds ${timeFrame.startMonth || timeFrame.timeFrame}`,
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
    <Card className="h-full">
      <CardHeader className="flex flex-col md:items-center space-y-0 border-b p-0 px-2 w-full md:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-2 py-5 sm:py-6">
          <CardTitle>Revenue Trends</CardTitle>
        </div>
        <div className="flex gap-3">
          {timeFrame.timeFrame === "daily" && (
            <SelectMonth setTimeFrame={setTimeFrame} timeFrame={timeFrame} />
          )}
          <YearlyMonthly setTimeFrame={setTimeFrame} />
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {isLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
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
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="revenue"
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
        )}
      </CardContent>
    </Card>
  );
}
