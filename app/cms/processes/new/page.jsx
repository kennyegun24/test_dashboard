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
import InputField from "@/components/TextInput";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import axios from "axios";
import Button from "@/components/Button";
import { sendToast } from "@/lib/helper";
import { fetchUser } from "@/actions/fetchUser";
import { RequestContext } from "@/contexts/RequestLLoading";

const NewProcess = () => {
  const [details, setDetails] = useState({});
  const { setLoading } = useContext(RequestContext);

  const submit = async (e) => {
    e.preventDefault();
    const steps = Array.from({ length: 3 }, (_, i) => {
      const index = i + 1;
      return {
        title: details?.[`step${index}title`]?.trim(),
        description: details?.[`step${index}description`]?.trim(),
      };
    });

    const formattedProcess = {
      sectionHeader: {
        mainTitle: details?.mainTitle?.trim(),
        subheading: details?.subHeading?.trim(),
      },
      steps,
    };

    // console.log(formattedProcess);
    setLoading(true);
    const user = await fetchUser();

    try {
      await axios.post(
        `${BACKEND_API_ROUTE}/process`,
        {
          ...formattedProcess,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            userId: user?.userId,
          },
        }
      );
      sendToast({
        title: "Processes added",
        desc: "New Processes has been added",
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      sendToast({
        desc: "Something went wrong",
        variant: "destructive",
      });
    }
  };
  const onChange = (e) => {
    setDetails((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };
  console.log(details);
  return (
    <div className="flex flex-col md:w-[95%] gap-6 bg-[--foreground] md:px-4 md:py-4 mb-8 py-2 px-2 rounded-[8px] m-auto w-full lg:w-[80%] xl:w-[60%] 2xl:w-[50%] min-[2500px]:w-[35%] min-[3000px]:w-[33%]">
      <section className="flex flex-col gap-2">
        <h2 className="text-[1.8rem] font-[700]">Service</h2>
        <p className="text-[.9rem] text-[--primary-text-color]">
          Create new process
        </p>
      </section>
      <hr className="border-[--secondary-border-color]" />
      <form className="flex flex-col gap-4" action="">
        <section className="flex-col flex">
          <h3 className="text-center font-bold">Section Header</h3>
          <div className="flex-col flex">
            <InputField
              value={details?.mainTitle}
              onChange={onChange}
              className={"border-[--secondary-border-color] md:w-[100%]"}
              label={"Main Title"}
              placeholder={"Enter main title"}
              name={"mainTitle"}
              required
            />
            <div className="w-full flex flex-col gap-2">
              <label className="text-[0.8rem] font-[700]" htmlFor="">
                Sub Heading
              </label>
              <textarea
                required
                onChange={onChange}
                name="subHeading"
                value={details?.subHeading}
                rows={3}
                className="resize-none bg-transparent border border-[--secondary-border-color]"
              />
            </div>
          </div>
        </section>

        <section className="flex-col flex">
          <h3 className="text-center font-bold">Step 1</h3>
          <div className="flex-col flex">
            <InputField
              value={details?.step1title}
              onChange={onChange}
              className={"border-[--secondary-border-color] md:w-[100%]"}
              label={"Title"}
              placeholder={"Enter title name"}
              name={"step1title"}
              required
            />
            <div className="w-full flex flex-col gap-2">
              <label className="text-[0.8rem] font-[700]" htmlFor="">
                Description
              </label>
              <textarea
                required
                onChange={onChange}
                name="step1description"
                rows={3}
                className="resize-none bg-transparent border border-[--secondary-border-color]"
              />
            </div>
          </div>
        </section>
        <section className="flex-col flex">
          <h3 className="text-center font-bold">Step 2</h3>
          <div className="flex-col flex">
            <InputField
              required
              value={details?.step2title}
              onChange={onChange}
              className={"border-[--secondary-border-color] md:w-[100%]"}
              label={"Title"}
              placeholder={"Enter title name"}
              name={"step2title"}
            />
            <div className="w-full flex flex-col gap-2">
              <label className="text-[0.8rem] font-[700]" htmlFor="">
                Description
              </label>
              <textarea
                required
                onChange={onChange}
                name="step2description"
                rows={3}
                className="resize-none bg-transparent border border-[--secondary-border-color]"
              />
            </div>
          </div>
        </section>
        <section className="flex-col flex">
          <h3 className="text-center font-bold">Step 3</h3>
          <div className="flex-col flex">
            <InputField
              required
              value={details?.step3title}
              onChange={onChange}
              className={"border-[--secondary-border-color] md:w-[100%]"}
              label={"Title"}
              placeholder={"Enter title name"}
              name={"step3title"}
            />
            <div className="w-full flex flex-col gap-2">
              <label className="text-[0.8rem] font-[700]" htmlFor="">
                Description
              </label>
              <textarea
                required
                onChange={onChange}
                name="step3description"
                rows={3}
                className="resize-none bg-transparent border border-[--secondary-border-color]"
              />
            </div>
          </div>
        </section>
        <Button onSave={submit} className={"mx-auto"} text={"Add Service"} />
      </form>
    </div>
  );
};

export default NewProcess;

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
