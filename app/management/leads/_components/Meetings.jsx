import {
  BatteryWarning,
  Calendar,
  FileWarningIcon,
  LucideMailWarning,
  Plus,
  TriangleAlert,
  Video,
} from "lucide-react";
import React from "react";

const Meetings = () => {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-[1.1rem] font-[700]">Meetings</h2>
        <CreateMeetingCard />
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-[1.1rem] font-[700]">Upcoming Meetings</h2>
        <UpcomingMeetings />
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-[1.1rem] font-[700]">History</h2>
        <HistoryCards />
      </section>
    </div>
  );
};

export default Meetings;

const CreateMeetingCard = () => {
  return (
    <button className="shadows border-2 flex flex-col gap-4 border-[--secondary-border-color] w-[300px] rounded-md p-4">
      <span className="h-10 w-10 flex items-center justify-center bg-[#F04438] rounded-md ">
        <Calendar className="" size={18} />
      </span>
      <p className="font-[700] text-[.9rem]">Schedule</p>
    </button>
  );
};

const UpcomingMeetings = () => {
  return (
    <section className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
      {fakeArr.map((e, _) => (
        <div className="shadows rounded-md py-4 flex flex-col gap-4">
          <div className="px-4 flex flex-col gap-4">
            <h3 className="text-[.95rem] font-semibold">Design Sprint</h3>
            <p className="text-[.8rem] text-[--primary-text-color]">
              Nov 10, 11:30am - 01:20pm
            </p>
            <p className="text-[.8rem] text-[#F04438] flex items-center gap-2">
              <TriangleAlert size={18} /> Meeting for all
            </p>
          </div>
          <hr className="border-[--secondary-border-color]" />
          <div className="px-4 flex items-center gap-2">
            <p className="text-[.7rem] px-2 py-1 rounded-full border border-[--secondary-border-color]">
              Meeting
            </p>
            <p className="text-[.7rem] px-2 py-1 rounded-full border border-[--secondary-border-color]">
              Design
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

const fakeArr = Array.from({ length: 7 });

const HistoryCards = () => {
  return (
    <section className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]">
      {fakeArr.map((e, _) => (
        <section className="flex shadows p-3 items-end justify-between">
          <div className="flex gap-4">
            <div className="flex flex-col items-center w-12 overflow-hidden border border-[--secondary-border-color] rounded-md min-h-8">
              <span className="bg-[--foreground] text-center w-full text-sm">
                Nov
              </span>
              <span className="bg-red-900 w-full text-center text-xl">9</span>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-[.95rem] font-semibold">Agenda Review</h4>
              <p className="text-[.75rem]">02:00am - 03:00pm</p>
            </div>
          </div>
          <div className="px-4 flex items-center gap-2">
            <p className="text-[.7rem] px-2 py-1 rounded-full border border-[--secondary-border-color]">
              Meeting
            </p>
            <p className="text-[.7rem] px-2 py-1 rounded-full border border-[--secondary-border-color]">
              Design
            </p>
          </div>
        </section>
      ))}
    </section>
  );
};
