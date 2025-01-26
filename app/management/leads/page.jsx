import React from "react";
import Tab from "./Tabs";
import RecentActivities from "@/components/RecentActivities";

const page = () => {
  return (
    <section className="flex flex-col gap-4 md:flex-row md:w-[95%] md:px-0 md:py-4 mb-8 py-2 px-2 rounded-[8px] m-auto w-full lg:w-[92%] xl:w-[85%] 2xl:w-[90%] min-[2500px]:w-[40%] min-[3000px]:w-[38%]">
      <section className="max-w-[calc(100vw-1rem)] md:max-w-[75%] md:w-[65%] flex flex-row gap-4 flex-col min-h-[calc(100vh-8rem)]">
        <Tab />
      </section>
      <section className="md:w-[33%] xl:w-[28%] top-0 md:top-[8vh] sticky bg-[--foreground] overflow-y-auto max-h-[60vh] md:max-h-[50vh] xl:max-h-[78vh] 2xl:max-h-[45vh] hide_scrollbar">
        <RecentActivities />
      </section>
    </section>
  );
};

export default page;
