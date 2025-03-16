"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CollapsibleDemo } from "./Activities";

const Activity = () => {
  const [tasks, setTasks] = useState({
    allTasks: [],
    recentTasks: [],
  });
  const [sortVal, setSortVal] = useState("weekly");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const makeRequest = async () => {
      setLoading(true);
      const user = await fetchUser();
      try {
        const req = await axios.get(
          `${BACKEND_API_ROUTE}/tasks?range=${sortVal}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              userId: user?.userId,
            },
          }
        );
        if (req.status === 201) {
          const data = await req.data;
          const allTasks = await data.allTasks;
          const recentTasks = await data.recentTasks;
          setTasks({
            allTasks,
            recentTasks,
          });
          console.log(recentTasks);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    return () => {
      makeRequest();
    };
  }, [sortVal]);

  if (loading)
    return (
      <div className="w-full h-[50vh] items-center flex justify-center">
        <Spinner />
      </div>
    );
  return (
    <div className="flex flex-col gap-4 mt-4">
      <section className="flex flex-col gap-2">
        <h3 className="text-[.9rem] font-[600]">Upcoming Activities</h3>
        {tasks.recentTasks.map((e) => {
          return <CollapsibleDemo data={e} />;
        })}
      </section>
      <div className="flex items-center gap-4">
        <SelectDemo setSortVal={setSortVal} />
        {/* <div className="w-[100px] flex items-center justify-center h-9 bg-[--foreground] rounded-md">
          <h5 className="mx-auto text-[14px]">Me</h5>
        </div> */}
      </div>
      <section className="flex flex-col gap-2">
        <h3 className="text-[.9rem] font-[600]">Activity History</h3>
        {tasks.allTasks.map((e) => {
          return <CollapsibleDemo data={e} />;
        })}
      </section>
    </div>
  );
};

export default Activity;

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import Spinner from "@/components/spinner";
import { fetchUser } from "@/actions/fetchUser";

export function SelectDemo({ className, setSortVal }) {
  return (
    <Select onValueChange={(e) => setSortVal(e)}>
      <SelectTrigger
        className={cn("w-[180px] border-[--secondary-border-color]", className)}
      >
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent className="bg-[--background] text-[--text-color] border-[--secondary-border-color]">
        <SelectGroup>
          {/* <SelectLabel>Fruits</SelectLabel> */}
          {/* <SelectItem value="apple">Today</SelectItem> */}
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="last_month">Last month</SelectItem>
          <SelectItem value="last_3months">Last 3 months</SelectItem>
          <SelectItem value="last_6months">Last 6 months</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
