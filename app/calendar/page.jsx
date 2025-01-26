"use client";
import { TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import { DatePickerDemo } from "../management/leads/_components/task/TimeDatePicker";
import { format } from "date-fns";

const Calendar = () => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  // // console.log(selectedDateTime);
  const date = new Date(selectedDateTime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const mins = date.getMinutes();
  const secs = date.getSeconds();
  console.log(
    year +
      "-" +
      String(month).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0") +
      "T" +
      String(hour).padStart(2, "0") +
      ":" +
      String(mins).padStart(2, "0") +
      ":" +
      String(secs).padStart(2, "0")
  );

  return (
    <section className="flex flex-col gap-4 md:w-[80%] md:py-4 mb-8 py-2 rounded-[8px] m-auto w-full lg:w-[70%] xl:w-[50%] 2xl:w-[40%] min-[2500px]:w-[32%] min-[3000px]:w-[27%] bg-[--foreground]">
      <h1 className="text-[1.5rem] font-[700] md:px-4 md:px-2 px-4">
        Meeting Scheduler
      </h1>

      <section className="mt-8 flex flex-col gap-4 md:px-2 px-4">
        <section className="w-full flex md:flex-row gap-1 flex-col items-center justify-between">
          <h5 className="md:w-1/2 w-full text-[.9rem] ">Full Name</h5>
          <div className="md:w-1/2 w-full">
            <input
              placeholder="Your full name"
              type="text"
              className="bg-transparent py-1 px-4 text-[.8rem] border border-[--secondary-border-color] rounded-sm w-4/6"
              name=""
              id=""
            />
          </div>
        </section>
        <section className="w-full flex md:flex-row gap-1 flex-col items-center justify-between">
          <h5 className="md:w-1/2 w-full text-[.9rem] ">Email address</h5>
          <div className="md:w-1/2 w-full">
            <input
              placeholder="example@gmail.com"
              type="email"
              className="bg-transparent py-1 px-4 text-[.8rem] border border-[--secondary-border-color] rounded-sm w-4/6"
              name=""
              id=""
            />
          </div>
        </section>
        <section className="w-full flex md:flex-row gap-1 flex-col items-center justify-between">
          <h5 className="md:w-1/2 w-full text-[.9rem] ">Meeting Date</h5>
          <div className="md:w-1/2 w-full">
            <span className="justify-self-start rounded-full px-4 py-1 bg-red-500 text-[.8rem]">
              {selectedDateTime
                ? format(selectedDateTime, "dd, MMMM yyyy")
                : "Set time below"}
            </span>
          </div>
        </section>
        <section className="w-full flex md:flex-row gap-1 flex-col items-center justify-between">
          <h5 className="md:w-1/2 w-full text-[.9rem] ">Meeting Time</h5>
          <div className="md:w-1/2 w-full">
            {/* <span className="justify-self-start rounded-full px-6 py-1 bg-green-500 text-[.8rem]">
              1:30PM
            </span> */}
            <DatePickerDemo
              selectedDateTime={selectedDateTime}
              setSelectedDateTime={setSelectedDateTime}
              className={
                "justify-self-start rounded-full px-6 py-1 bg-green-500 text-[.7em] text-[--text-color]"
              }
            />
          </div>
        </section>
      </section>
      <hr className="border-[--secondary-border-color]" />
      <section className="mt-6 flex flex-col gap-2 md:px-2 px-4">
        <h5 className="text-[.9rem] font-[700]">Description</h5>
        <textarea
          name=""
          rows={5}
          className="resize-none bg-transparent w-full rounded-sm border border-[--secondary-border-color] px-4 py-2 text-[.8rem]"
          id=""
          placeholder="What I should know before the meeting"
        />
      </section>

      <hr className="border-[--secondary-border-color]" />

      <section className="mt-6 flex flex-col gap-2 md:px-2 px-4">
        <h5 className="text-[.9rem] font-[700]">Meeting Attendees</h5>

        <div className="flex gap-6">
          <p className="text-[.8rem] flex items-center gap-2 font-[700]">
            You{" "}
            <span className="text-[.7rem] font-[400]">(emily@gmail.com)</span>
          </p>
          <p className="text-[.8rem] font-[700]">AJL Webcraft</p>
          <hr className="border-[--secondary-border-color]" />
        </div>
      </section>

      <hr className="border-[--secondary-border-color]" />

      <section className="mt-6 flex flex-col gap-2 md:px-2 px-4">
        <h5 className="text-[.9rem] font-[700]">Schedule Information</h5>
        <section className="w-full flex md:flex-row gap-1 flex-col items-center justify-between">
          <h5 className="md:w-1/2 w-full text-[.8rem] ">Duration (minutes)</h5>
          <div className="md:w-1/2 w-full">
            <span className="justify-self-start rounded-full px-4 py-1 bg-red-500 text-[.8rem]">
              30 mins
            </span>
          </div>
        </section>
      </section>
      <hr className="border-[--secondary-border-color]" />

      <section className="mt-6 flex gap-2 md:px-2 p-4 bg-[--yellow-bg-transparent]">
        <TriangleAlert className="text-[#F04438]" />
        <div className="flex flex-col gap-2">
          <h3 className="font-[700] text-[.9rem]">
            Select time, day. Duration of every meeting is automatically set at
            30minutes
          </h3>
          <p className="text-[.8rem]">
            Don't forget to input your legal Names and also your email address
            for us to reach you back
          </p>
        </div>
      </section>

      <button className="ml-auto md:mr-2 mr-4 px-4 py-2 text-[.9rem] bg-[--btn_background] mt-4 rounded-md">
        Schedule Meeting
      </button>
    </section>
  );
};

export default Calendar;
