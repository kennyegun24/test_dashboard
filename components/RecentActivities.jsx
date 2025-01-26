"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { kFormatter } from "@/lib/helper";
import { format } from "date-fns";
import useSWR from "swr";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import Spinner from "./spinner";
import EmptyComponent from "./Empty";

const Filter = ({ setFilter }) => {
  return (
    <Select onValueChange={(e) => setFilter(e)}>
      <SelectTrigger className="w-fit min-w-[120px]">
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent className="z-[999999]">
        <SelectItem value="recent">Recent</SelectItem>
        <SelectItem value="oldest">Oldest</SelectItem>
        <SelectItem value="audits">Audits</SelectItem>
        <SelectItem value="revenue">Revenue</SelectItem>
        <SelectItem value="teams">Teams</SelectItem>
      </SelectContent>
    </Select>
  );
};

const RecentActivities = () => {
  const [filter, setFilter] = useState("");
  const fetcher = async () => {
    const fetchData = await fetch(
      `${BACKEND_API_ROUTE}/audit-log?filter=${filter}`,
      {
        cache: "no-store",
      }
    );
    const data = await fetchData.json();
    return await data.data;
  };
  const { data, error, isLoading } = useSWR(
    `activities-logs ${filter}`,
    fetcher,
    {
      refreshInterval: null,
      errorRetryInterval: 5000,
      revalidateIfStale: false,
      revalidateOnMount: true,
      revalidateOnFocus: false,
      errorRetryCount: 1,
    }
  );
  console.log(data);
  return (
    <section className="w-full">
      <div className="px-4 sticky top-0 py-2 bg-[--foreground] flex items-center justify-between">
        <h3 className="text-[1.1rem] font-bold">Recent Activities</h3>
        <Filter setFilter={setFilter} />
      </div>
      {isLoading ? (
        <section className="flex items-center justify-center w-full h-[50vh] md:h-[40vh] xl:h-[70vh] 2xl:h-[38vh]">
          <Spinner />
        </section>
      ) : data?.length === 0 ? (
        <section className="flex items-center justify-center w-full h-[50vh] md:h-[40vh] xl:h-[70vh] 2xl:h-[38vh]">
          <EmptyComponent />
        </section>
      ) : (
        <Activities data={data} />
      )}
    </section>
  );
};

export default RecentActivities;

const Activities = ({ data }) => {
  return (
    <section className="text-[--primary-text-color]">
      {data?.map((e, _) => (
        <div key={_}>
          <div key={_} className="px-4 py-3">
            {e.role && (
              <div className="flex flex-col gap-2">
                <p className="text-[.85rem]">
                  <span className="font-semibold text-[.9rem]">
                    Role Invite:{" "}
                  </span>
                  {e.name} has been invited to the team as a
                  <span className="text-[--btn_background]"> {e.role}</span>
                </p>
                <p className="text-[.7rem]">{e.date}</p>
              </div>
            )}
            {e.resource === "LOGO" && (
              <div className="flex flex-col gap-2">
                <p className="text-[.85rem]">
                  <span className="font-semibold text-[.9rem]">
                    Audit log:{" "}
                  </span>
                  {e.name} updated the company Logo
                </p>
                <p className="text-[.7rem]">
                  {format(new Date(e.timestamp), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            )}
            {e.resource === "COMPANY NAME" && (
              <div className="flex flex-col gap-2">
                <p className="text-[.85rem]">
                  <span className="font-semibold text-[.9rem]">
                    Audit log:{" "}
                  </span>
                  {e.name} updated the company Name to {e.details.companyName}
                </p>
                <p className="text-[.7rem]">
                  {format(new Date(e.timestamp), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            )}
            {e.action === "SALE_MARKED_PENDING" && (
              <div className="flex flex-col gap-2">
                <p className="text-[.85rem]">
                  <span className="font-semibold text-[.9rem]">
                    Revenue log:{" "}
                  </span>
                  a ${kFormatter(e.details.projectValue)} project is pending{" "}
                  {e.details.projectName}
                </p>
                <p className="text-[.7rem]">
                  {format(new Date(e.timestamp), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            )}
            {e.action === "SALE_UPDATED" && (
              <div className="flex flex-col gap-2">
                <p className="text-[.85rem]">
                  <span className="font-semibold text-[.9rem]">
                    Revenue log:{" "}
                  </span>
                  {e.details.projectName} project is being processed
                </p>
                <p className="text-[.7rem]">
                  {format(new Date(e.timestamp), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            )}
            {e.action === "SALE_CANCELLED" && (
              <div className="flex flex-col gap-2">
                <p className="text-[.85rem]">
                  <span className="font-semibold text-[.9rem]">
                    Revenue log:{" "}
                  </span>
                  {e.details.projectName} project has been cancelled
                </p>
                <p className="text-[.7rem]">
                  {format(new Date(e.timestamp), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            )}
            {e.action === "SALE_COMPLETED" && (
              <div className="flex flex-col gap-2">
                <p className="text-[.85rem]">
                  <span className="font-semibold text-[.9rem]">
                    Revenue log:{" "}
                  </span>
                  {e.details.projectName} project has generated $
                  {e.details.projectValue}
                </p>
                <p className="text-[.7rem]">
                  {format(new Date(e.timestamp), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            )}
            {e.resource === "FAQ" && (
              <div className="flex flex-col gap-2">
                <p className="text-[.85rem]">
                  <span className="font-semibold text-[.9rem]">
                    Audit log:{" "}
                  </span>
                  {e.name} just updated the frequently Asked Questions
                </p>
                <p className="text-[.7rem]">
                  {format(new Date(e.timestamp), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            )}
            {e.resource === "PRIVACY_POLICY" && (
              <div className="flex flex-col gap-2">
                <p className="text-[.85rem]">
                  <span className="font-semibold text-[.9rem]">
                    Audit log:{" "}
                  </span>
                  {e.name} just updated the Privacy Policy
                </p>
                <p className="text-[.7rem]">
                  {format(new Date(e.timestamp), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            )}
            {e.resource === "TERMS_OF_SERVICE" && (
              <div className="flex flex-col gap-2">
                <p className="text-[.85rem]">
                  <span className="font-semibold text-[.9rem]">
                    Audit log:{" "}
                  </span>
                  {e.name} just updated the Terms of Service
                </p>
                <p className="text-[.7rem]">
                  {format(new Date(e.timestamp), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            )}
            {e.resource === "BLOG" && (
              <div className="flex flex-col gap-2">
                <p className="text-[.85rem]">
                  <span className="font-semibold text-[.9rem]">
                    Audit log:{" "}
                  </span>
                  {e.name} just created a new Blog titled{" "}
                  {e.details.title?.slice(0, 15)}...
                </p>
                <p className="text-[.7rem]">
                  {format(new Date(e.timestamp), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            )}
            {e.action === "ROLE_INVITE" && (
              <div className="flex flex-col gap-2">
                <p className="text-[.85rem]">
                  <span className="font-semibold text-[.9rem]">
                    Team Invite:{" "}
                  </span>
                  {e.details.name} just got invited as a{" "}
                  {e.details.role?.join(", ")?.length > 15
                    ? e.details.role?.join(", ")?.slice(0, 15) + "..."
                    : e.details.role?.join(", ")}
                </p>
                <p className="text-[.7rem]">
                  {format(new Date(e.timestamp), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            )}
            {e.action === "ROLE_CHANGE" && (
              <div className="flex flex-col gap-2">
                <p className="text-[.85rem]">
                  <span className="font-semibold text-[.9rem]">
                    Team Invite:{" "}
                  </span>
                  {e.details.name} role changed to{" "}
                  {e.details.role?.join(", ")?.length > 15
                    ? e.details.role?.join(", ")?.slice(0, 15) + "..."
                    : e.details.role?.join(", ")}
                </p>
                <p className="text-[.7rem]">
                  {format(new Date(e.timestamp), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            )}
            {e.action === "ROLE_DELETE" && (
              <div className="flex flex-col gap-2">
                <p className="text-[.85rem]">
                  <span className="font-semibold text-[.9rem]">
                    Team Invite:{" "}
                  </span>
                  {e.details.name} just got removed from the team
                </p>
                <p className="text-[.7rem]">
                  {format(new Date(e.timestamp), "MMM d, yyyy h:mm a")}
                </p>
              </div>
            )}
          </div>
          <hr />
        </div>
      ))}
    </section>
  );
};
