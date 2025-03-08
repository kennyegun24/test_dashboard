import React from "react";
import { Calendar as AntDCalendar } from "antd";
import { format } from "date-fns";
import { toZonedTime, format as formatWithTZ } from "date-fns-tz";
import useSWR from "swr";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Mail, Phone } from "lucide-react";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import axios from "axios";
import AccessRestricted from "@/components/AccessRestricted";
import { getUserSession } from "@/lib/getUserSession";
import { fetchUser } from "@/actions/fetchUser";
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const serviceColors = {
  "Website Development": "var(--web_development)",
  "Graphic Design": "var(--graphic_design)",
  "UI/UX Design": "var(--web_design)",
  "Mobile Development": "var(--mobile_development)",
  Ecommerce: "var(--ecommerce)",
  "Automation Scripts": "var(--automation_scripts)",
  "Cyber Security": "var(--cyber_security)",
  "3D Modelling": "var(--3d_modelling)",
  "Website Maintainance": "var(--website_maintainance)",
  "Payment Integrations": "var(--others)",
};

const serviceTextColors = {
  "Web Development": "var(--calendar-text-color)",
};

const startZonedTime = (event) => {
  return toZonedTime(new Date(event.startTime), timeZone);
};

const endZonedTime = (event) => {
  return toZonedTime(new Date(event.endTime), timeZone);
};

const Calendar = () => {
  const fetcher = async () => {
    // try {
    const user = await fetchUser();
    const fetchData = await axios.get(`${BACKEND_API_ROUTE}/book_schedule`, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
        userId: user?.userId,
      },
    });
    const data = await fetchData.data;
    return data?.appointments;
    // } catch (error) {
    //   console.log(error);
    //   return error;
    // }
  };
  const { data, error, isLoading } = useSWR(`calendar`, fetcher, {
    refreshInterval: null,
    errorRetryInterval: 5000,
    revalidateIfStale: false,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    errorRetryCount: 1,
  });

  console.log(error?.status);

  if (isLoading) return null;

  const dateCellRender = (value) => {
    const currentDate = format(
      toZonedTime(value.toDate(), timeZone),
      "yyyy-MM-dd"
    );

    const events = data?.filter((event) => {
      const eventDate = format(startZonedTime(event), "yyyy-MM-dd");
      return eventDate === currentDate;
    });

    if (events?.length > 0) {
      const backgroundColor = serviceColors[events[0].service] || "#ffffff";
      const textColor = serviceTextColors["Web Development"] || "#ffffff";

      return (
        <Popover>
          <div
            style={{
              minHeight: "100%",
              width: "100%",
              color: textColor,
              textAlign: "start",
            }}
          >
            <PopoverTrigger asChild>
              <ul className="events w-full flex flex-col gap-3">
                {events.map((event, index) => {
                  return (
                    <div key={index}>
                      <li
                        style={{ backgroundColor }}
                        className={`z-[-1] bg-[${backgroundColor}] rounded-sm min-h-[80px] flex flex-col justify-between pb-4 gap-1 w-full`}
                      >
                        <div className="px-2 flex flex-col gap-1">
                          <p className="whitespace-pre overflow-hidden text-ellipsis max-w-[100%] text-[#000] text-[.65rem] font-[700]">
                            {event.name}
                          </p>
                          <p className="whitespace-pre overflow-hidden text-ellipsis text-[.58rem]">
                            {event.service}
                          </p>
                        </div>
                        <p className="text-[.55rem] px-2 font-[500]">
                          {formatWithTZ(startZonedTime(event), "p", {
                            timeZone,
                          })}
                          {formatWithTZ(endZonedTime(event), "p", { timeZone })}
                        </p>
                      </li>
                    </div>
                  );
                })}
              </ul>
            </PopoverTrigger>
            <PopoverContent className="overflow-y-auto max-h-[50vh] hide_scrollbar flex flex-col gap-6 min-w-[350px]">
              {events.map((event, index) => (
                <AppointmentDetails event={event} key={index} />
              ))}
            </PopoverContent>
          </div>
        </Popover>
      );
    }

    return null;
  };

  return (
    <>
      {error?.status === 401 && <AccessRestricted />}
      <AntDCalendar cellRender={dateCellRender} fullscreen={true} />
    </>
  );
};

export default Calendar;

const AppointmentDetails = ({ event }) => {
  return (
    <div className="space-y-4 min-w-full">
      <div className="flex items-center gap-2">
        <div className="h-[40px] w-[40px] bg-black rounded-full" />
        <div className="">
          <h4 className="font-semibold text-sm">{event.name}</h4>
          <p className="text-[.7rem] text-muted-foreground items-start flex gap-2">
            <span className="text-[.7rem] flex items-center gap-1 text-muted-foreground">
              <Mail size={12} />
              {event.email}
            </span>
            <span className="text-[.7rem] flex gap-1 items-center text-muted-foreground">
              <Phone size={12} /> {event.phone || "Not added"}
            </span>
          </p>
        </div>
      </div>
      <hr />
      <div className="flex items-center gap-4">
        <p className="text-[.8rem] flex flex-col text-muted-foreground">
          <span className="font-semibold">Service</span>
          <span className="text-[.7rem]">{event.service}</span>
        </p>
        <p className="text-[.8rem] flex flex-col text-muted-foreground">
          <span className="font-semibold">Country</span>
          <span className="text-[.7rem]">{event.country}</span>
        </p>
      </div>
      <p className="text-[.8rem] flex flex-col text-muted-foreground">
        <span className="font-semibold">Additional Information</span>
        <span className="text-[.7rem]">
          {event.additional_info || "No additional details provided."}
        </span>
      </p>

      <div className="flex items-center gap-4">
        <p className="text-[.8rem] flex flex-col text-muted-foreground">
          <span className="font-semibold">Start time</span>
          <span className="text-[.7rem]">
            {formatWithTZ(startZonedTime(event), "MMMM dd, yyyy p z", {
              timeZone,
            })}
          </span>
        </p>
        <p className="text-[.8rem] flex flex-col text-muted-foreground">
          <span className="font-semibold">End time</span>
          <span className="text-[.7rem]">
            {formatWithTZ(endZonedTime(event), "MMMM dd, yyyy p z", {
              timeZone,
            })}
          </span>
        </p>
      </div>
    </div>
  );
};
