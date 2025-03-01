"use client";

import * as React from "react";
import { ArrowDown, Calendar, ChevronDown, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";

export function CollapsibleDemo({ data }) {
  const [isOpen, setIsOpen] = React.useState(false);
  function formatDueDate(dueDate) {
    const date = new Date(dueDate);

    if (isToday(date)) {
      return `Today, ${format(date, "hh:mm a")}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, "hh:mm a")}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, "hh:mm a")}`;
    } else {
      return format(date, "EEEE, hh:mm a"); // Example: "Monday, 12:00 PM"
    }
  }
  const priorityColor =
    data.priority === "high"
      ? "bg-red-400"
      : data.priority === "critical"
      ? "bg-red-700"
      : data.priority === "medium"
      ? "bg-yellow-500"
      : "white";
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2 text-[--primary-text-color] bg-[--foreground] rounded-sm py-3 px-2"
    >
      <div className="flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <CollapsibleTrigger className="" asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? "" : "rotate-[-90deg]"
                } `}
              />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
          <h4 className="text-[0.75rem] md:text-[0.8rem] font-semibold">
            Task <span className="text-[.75rem]">created</span>{" "}
            {data?.assigned_to?.full_name}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="md:text-[.75rem] text-[0.7rem] opacity-[0.6]">
            Due:
          </span>
          <Calendar size={14} />
          <p className="md:text-[.75rem] text-[0.7rem]">
            {formatDueDate(data?.due_date || null)}
          </p>
        </div>
      </div>
      <hr className="border-[--secondary-border-color]" />
      <div className="flex flex-col gap-3 w-[90%] ml-auto pt-[1rem]">
        <h3 className="text-[.9rem] font-[700]">{data?.task_header}</h3>
        <p className="text-[.8rem] opacity-[0.7]">{data?.description}</p>
      </div>
      <CollapsibleContent>
        <section className="flex items-center gap-6 w-[90%] mx-auto border divide-x divide-[--secondary-border-color] border-[--secondary-border-color] py-2 rounded-md mt-4 justify-between">
          <div className="flex flex-col items-center w-[50%]">
            <h5 className="opacity-[0.7] text-[.8rem] ">Task Priority</h5>
            <p className="text-[.9rem] font-semibold flex items-center gap-1">
              <span className={`h-3 w-3 ${priorityColor}`} /> {data.priority}
            </p>
          </div>
          <div className="flex flex-col items-center w-[50%]">
            <h5 className="opacity-[0.7] text-[.8rem]">Assigned to</h5>
            <p className="text-[.9rem] font-semibold">
              {data?.assigned_to?.full_name}
            </p>
          </div>
        </section>
      </CollapsibleContent>
    </Collapsible>
  );
}
