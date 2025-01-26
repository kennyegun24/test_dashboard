"use client";
import MetricCards from "@/components/MetricCards";
import { ChartNoAxesColumnIncreasing, ListChecks } from "lucide-react";
import { MdOutlinePeopleAlt } from "react-icons/md";
import React, { useState } from "react";
import LineChart from "./_components/LineChart";
import PieChart from "./_components/PieChart";
import RecentTransactions from "./_components/RecentTransactions";
import RecentActivities from "@/components/RecentActivities";

const SalesPage = ({ metrics, pieData, transactions }) => {
  const [show, setShow] = useState(false);

  return (
    <section className="md:w-[95%] lg:w-[92%] flex flex-col items-start justify-between 2xl:w-[90%] min-[2200px]:w-[75%] min-[2700px]:w-[60%] w-full md:py-8 py-4 px-4 md:px-0 mx-auto">
      <section className="flex flex-col md:flex-row items-start justify-between w-full">
        <section className="flex gap-8 w-full md:w-[58vw] xl:w-[70%]">
          <section className="flex flex-col items-start gap-8 w-[100%]">
            <div className="grid md:grid-cols-[repeat(auto-fill,_minmax(40%,_1fr))] xl:grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] w-full grid-cols-[repeat(auto-fill,_minmax(40%,_1fr))] gap-3">
              <MetricCards
                Icon={MdOutlinePeopleAlt}
                amount={metrics?.totalClients}
                header={"Total Clients"}
                percent={metrics?.clientPercentage}
                color={"var(--blue)"}
              />
              <MetricCards
                Icon={ChartNoAxesColumnIncreasing}
                amount={metrics?.totalRevenue}
                header={"Total Revenue"}
                percent={metrics?.revenuePercentage}
                color={"var(--btn_background)"}
              />
              <MetricCards
                Icon={ListChecks}
                amount={metrics?.completedProjects}
                header={"Completed Projects"}
                percent={metrics?.projectsPercentage}
                color={"var(--purple)"}
              />
            </div>
            <div className="w-full xl:flex-row flex-col flex xl:justify-between">
              <section className="xl:w-[60%] w-full h-full">
                <LineChart />
              </section>
              <section className="xl:w-[38%] w-full h-full">
                <PieChart data={pieData} />
              </section>
            </div>
          </section>
        </section>

        <div className="fixed bottom-4 left-[50%] translate-x-[-50%] z-[99991] w-[40%] md:hidden">
          <button
            onClick={() => setShow((p) => !p)}
            className="text-[.7rem] bg-[--deep_green_background] rounded-full px-2 w-full py-1"
          >
            {show ? "Hide" : "Show activities"}
          </button>
        </div>

        <section
          className={`md:block z-[990] flex items-center h-[100vh] md:h-fit px-3 md:px-0 bg-[--black-transparent-bg] top-0 md:top-[8vh] md:left-0 left-0 w-full ease-in-out duration-300 md:sticky fixed md:w-[30vw] xl:w-[28%] rounded-lg ${
            !show && "left-[-100%]"
          } `}
        >
          <section
            className={`w-full top-[20vh] bg-[--foreground] overflow-y-auto max-h-[60vh] md:max-h-[50vh] xl:max-h-[78vh] 2xl:max-h-[45vh] hide_scrollbar
        `}
          >
            <RecentActivities />
          </section>
        </section>
      </section>
      <section className="mt-12 max-w-[calc(100vw-2rem)] bg-[--foreground] md:px-4 md:py-6 px-2 py-3 rounded-lg">
        <RecentTransactions data={transactions} />
      </section>
    </section>
  );
};

export default SalesPage;
