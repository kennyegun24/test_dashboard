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
import React, { useContext, useEffect, useState } from "react";
import { DatePickerDemo } from "./TimeDatePicker";
import InputField from "@/components/TextInput";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import axios from "axios";
import Button from "@/components/Button";
import { sendToast } from "@/lib/helper";
import { fetchUser } from "@/actions/fetchUser";
import { RequestContext } from "@/contexts/RequestLLoading";

const NewTask = () => {
  const [details, setDetails] = useState({});
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const { setLoading, loading } = useContext(RequestContext);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = await fetchUser();
    try {
      await axios.post(
        `${BACKEND_API_ROUTE}/tasks`,
        {
          ...details,
          due_date: selectedDateTime,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            userId: user?.userId,
          },
        }
      );
      sendToast({
        title: "Task created",
        desc: "New task has been created and assigned to a team member",
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
      sendToast({
        desc: "Something went wrong",
        variant: "destructive",
      });
    }
  };
  const onChange = (e) => {
    setLoading(false);
    setDetails((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex flex-col gap-6 bg-[--foreground] px-4 py-6 w-full">
      <section className="flex flex-col gap-2">
        <h2 className="text-[1.8rem] font-[700]">Create Task</h2>
        <p className="text-[.9rem] text-[--primary-text-color]">
          Create new task
        </p>
      </section>
      <hr className="border-[--secondary-border-color]" />
      <form className="flex flex-col gap-2" action="">
        <section className="grid-cols-[repeat(auto-fill,_minmax(320px,_1fr))] gap-6 grid">
          <InputField
            value={details?.task_name}
            onChange={onChange}
            className={"border-[--secondary-border-color] md:w-[100%]"}
            label={"Task name"}
            placeholder={"Enter task name"}
            name={"task_name"}
          />
          <InputField
            value={details?.task_header}
            onChange={onChange}
            className={"border-[--secondary-border-color] md:w-[100%]"}
            label={"Task header"}
            placeholder={"Enter task header"}
            name={"task_header"}
          />
          <div className="w-full flex flex-col gap-2">
            <label className="text-[0.9rem] font-[700]" htmlFor="">
              Priority
            </label>
            <PrioritySelect setDetails={setDetails} className={"w-full"} />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="text-[0.9rem] font-[700]" htmlFor="">
              Assigned to
            </label>
            <SelectTeamMembers setDetails={setDetails} className={"w-full"} />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="text-[0.9rem] font-[700]" htmlFor="">
              Due date
            </label>
            <DatePickerDemo
              selectedDateTime={selectedDateTime}
              setSelectedDateTime={setSelectedDateTime}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="text-[0.9rem] font-[700]" htmlFor="">
              Description
            </label>
            <textarea
              onChange={onChange}
              name="description"
              rows={10}
              className="resize-none bg-transparent border border-[--secondary-border-color]"
            />
          </div>
        </section>
        <Button onSave={submit} className={"mx-auto"} text={"Create task"} />
      </form>
    </div>
  );
};

export default NewTask;

function SelectTeamMembers({ className, setDetails }) {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchTeam = await fetch(`${BACKEND_API_ROUTE}/teams`, {
          cache: "no-store",
        });
        const teamsData = await fetchTeam.json();
        const teamTable = (await teamsData?.data) || [];
        setTeamMembers(teamTable);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <Select
      onValueChange={(e) => setDetails((p) => ({ ...p, assigned_to: e }))}
    >
      <SelectTrigger
        className={cn("w-[180px] border-[--secondary-border-color]", className)}
      >
        <SelectValue placeholder="Select team member" />
      </SelectTrigger>
      <SelectContent className="bg-[--background] text-[--text-color] border-[--secondary-border-color]">
        <SelectGroup>
          {/* <SelectLabel>Fruits</SelectLabel> */}
          {teamMembers.map((e) => (
            <SelectItem value={e._id}>{e.full_name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function PrioritySelect({ className, setDetails }) {
  return (
    <Select onValueChange={(e) => setDetails((p) => ({ ...p, priority: e }))}>
      <SelectTrigger
        className={cn("w-[180px] border-[--secondary-border-color]", className)}
      >
        <SelectValue placeholder="priorities" />
      </SelectTrigger>
      <SelectContent className="bg-[--background] text-[--text-color] border-[--secondary-border-color]">
        <SelectGroup>
          <SelectItem value="critical">Critical</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

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
