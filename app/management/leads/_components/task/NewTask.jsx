"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React from "react";
import { DatePickerDemo } from "./TimeDatePicker";

const NewTask = () => {
  return (
    <div className="flex flex-col gap-6 bg-[--foreground] px-4 py-6 w-full">
      <section className="flex flex-col gap-2">
        <h2 className="text-[1.8rem] font-[700]">Create Task</h2>
        <p className="text-[.9rem] text-[--primary-text-color]">
          Create new task
        </p>
      </section>
      <hr className="border-[--secondary-border-color]" />
      <form action="">
        <section className="grid-cols-[repeat(auto-fill,_minmax(320px,_1fr))] gap-6 grid">
          <div className="w-full flex flex-col gap-2">
            <label className="text-[0.9rem] font-[700]" htmlFor="">
              Task
            </label>
            <SelectDemo className={"w-full"} />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="text-[0.9rem] font-[700]" htmlFor="">
              Task header
            </label>
            <input
              type="text"
              placeholder="Prepare quote for..."
              className={
                "w-full px-4 bg-transparent rounded-sm border border-[--secondary-border-color] text-sm py-2"
              }
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="text-[0.9rem] font-[700]" htmlFor="">
              Priority
            </label>
            <SelectDemo className={"w-full"} />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="text-[0.9rem] font-[700]" htmlFor="">
              Assigned to
            </label>
            <SelectDemo className={"w-full"} />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="text-[0.9rem] font-[700]" htmlFor="">
              Due date
            </label>
            <DatePickerDemo />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="text-[0.9rem] font-[700]" htmlFor="">
              Description
            </label>
            <textarea
              rows={10}
              className="resize-none bg-transparent border border-[--secondary-border-color]"
            />
          </div>
        </section>
      </form>
    </div>
  );
};

export default NewTask;

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
