"use client";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

const Activity = () => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* <div className="w-[50%] py-5 bg-[--foreground] rounded-md" /> */}
      <div className="flex items-center gap-4">
        <SelectDemo />
        {/* <SelectDemo className={"w-[100px]"} /> */}
        <div className="w-[100px] flex items-center justify-center h-9 bg-[--foreground] rounded-md">
          <h5 className="mx-auto text-[14px]">Me</h5>
        </div>
      </div>
      <section className="flex flex-col gap-2">
        <h3 className="text-[.9rem] font-[600]">Upcoming Activities</h3>
        {/* <div className="h-[300px] bg-[--foreground] rounded-md w-full" /> */}
        <CollapsibleDemo />
        <CollapsibleDemo />
        <CollapsibleDemo />
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="text-[.9rem] font-[600]">Activity History</h3>
        <CollapsibleDemo />
        <CollapsibleDemo />
        <CollapsibleDemo />
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CollapsibleDemo } from "./Activities";

export function SelectDemo({ className }) {
  return (
    <Select>
      <SelectTrigger
        className={cn("w-[180px] border-[--secondary-border-color]", className)}
      >
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent className="bg-[--background] text-[--text-color] border-[--secondary-border-color]">
        <SelectGroup>
          {/* <SelectLabel>Fruits</SelectLabel> */}
          <SelectItem value="apple">Today</SelectItem>
          <SelectItem value="banana">Weekly</SelectItem>
          <SelectItem value="blueberry">Last month</SelectItem>
          <SelectItem value="grapes">Last 3 months</SelectItem>
          <SelectItem value="pineapple">Last 6 months</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
