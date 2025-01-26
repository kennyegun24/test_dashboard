"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import EmptyComponent from "@/components/Empty";

const chartConfig = {
  Admin: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  "Web Developer": {
    label: "Web dev",
    color: "hsl(var(--chart-1))",
  },
  "Web Designer": {
    label: "UI/UX",
    color: "hsl(var(--chart-2))",
  },
  "Mobile Developer": {
    label: "Hosting",
    color: "hsl(var(--chart-3))",
  },
  "3D Designer": {
    label: "3D designer",
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
  Manager: {
    label: "Domain",
    color: "hsl(var(--chart-7))",
  },
};

export function RoleDistributionChart({ data }) {
  const dynamicChartData = data.map((item, _) => ({
    ...item,
    key: _,
    fill: chartConfig[item.role]?.color || "hsl(var(--chart-1))",
  }));
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Roles distribution chart</CardTitle>
      </CardHeader>
      {data?.length === 0 ? (
        <div className="md:min-h-[250px] h-[200px] w-full flex items-center justify-center">
          <EmptyComponent />
        </div>
      ) : (
        <CardContent>
          <ChartContainer
            className="h-[200px] xl:h-[300px] w-full"
            config={chartConfig}
          >
            <BarChart
              accessibilityLayer
              data={dynamicChartData}
              margin={{
                top: 20,
              }}
              className="h-full w-full"
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="role"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  value.length > 13 ? value.slice(0, 13) + "..." : value
                }
              />
              <ChartTooltip
                cursor={false}
                // content={<ChartTooltipContent hideLabel />}
                content={({ active, payload }) => {
                  if (active) {
                    const name = payload[0]?.payload?.role;
                    const color = payload[0]?.payload?.fill;
                    const value = payload[0]?.payload?.no;
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
              <Bar dataKey="no" radius={8} fill={(d) => d.fill}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-[--primary-text-color]"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
}
