"use client";
import MetricCards from "@/components/MetricCards";
import RecentActivities from "@/components/RecentActivities";
import { ChartNoAxesColumnIncreasing, ListChecks } from "lucide-react";
import { MdOutlinePeopleAlt } from "react-icons/md";
import TotalVisits from "./_components/TotalVisits";
import Map from "./_components/Map";
import WebsietTraffic from "./_components/WebsiteTraffic";
import TrafficSources from "./_components/TrafficSources.";
import { useEffect, useState } from "react";
import JobCompletion from "./_components/JobCompletion";
import LeadManagement from "./_components/LeadManagement";

const MainDashboard = ({ metrics, maps, leads }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let activeTime = 0;
    let startTime = Date.now();
    let endTime = Date.now();

    const updateTimeSpent = () => {
      const now = Date.now();
      if (now - endTime <= 3000) {
        activeTime += (now - endTime) / 1000;
      }
      startTime = now;
      endTime = now;
    };

    const events = ["mousemove", "scroll", "click"];
    events.forEach((event) => {
      window.addEventListener(event, updateTimeSpent);
    });

    const handleBeforeUnload = () => {
      updateTimeSpent();
      navigator.sendBeacon(
        `/api/tracking`,
        JSON.stringify({ duration: activeTime })
      );
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateTimeSpent);
      });
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <section className="md:w-[95%] lg:w-[92%] flex flex-col md:flex-row items-start justify-between 2xl:w-[90%] min-[2200px]:w-[75%] min-[2700px]:w-[60%] w-full md:py-8 py-4 px-4 md:px-0 mx-auto">
      <section className="flex gap-8 w-full md:w-[65%] xl:w-[70%]">
        <section className="flex flex-col gap-8 w-[100%]">
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
              header={"Total Completed Projects"}
              percent={metrics?.projectsPercentage}
              color={"var(--purple)"}
            />
          </div>
          <div className="w-full xl:flex-row flex-col md:gap-0 gap-3 flex md:justify-between flex-stretch">
            <section className="xl:w-[60%] w-full h-full">
              <TotalVisits />
            </section>
            <section className="xl:w-[38%] w-full h-full">
              <Map maps={maps} />
            </section>
          </div>
          <div className="w-full xl:flex-row flex-col md:gap-0 gap-3 flex md:justify-between flex-stretch">
            <section className="xl:w-[38%] w-full h-full">
              <TrafficSources sources={maps} />
            </section>
            <section className="xl:w-[60%] w-full h-full">
              <WebsietTraffic />
            </section>
          </div>
          <div className="w-full xl:flex-row flex-col md:gap-0 gap-3 flex md:justify-between flex-stretch">
            <section className="xl:w-[60%] w-full h-full">
              <JobCompletion />
            </section>
            <section className="xl:w-[38%] w-full h-full">
              <LeadManagement leads={leads} />
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
        className={`md:block z-[9999] flex items-center h-[100vh] md:h-fit px-3 md:px-0 bg-[--black-transparent-bg] top-0 md:top-[8vh] md:left-0 left-0 w-full ease-in-out duration-300 md:sticky fixed md:w-[33%] xl:w-[28%] rounded-lg ${
          !show && "left-[-100%] ease-in-out duration-300"
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
  );
};

export default MainDashboard;
