"use client";
import * as React from "react";
import {
  format,
  set,
  isWithinInterval,
  parseISO,
  startOfDay,
  endOfDay,
} from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Space, TimePicker } from "antd";
import dayjs from "dayjs";

const appointments = [
  {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1-123-456-7890",
    service: "Web Development",
    start: "2025-01-08T09:00:00",
    end: "2025-01-08T11:00:00",
  },
  {
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "+1-987-654-3210",
    service: "Graphic Design",
    start: "2025-01-08T13:00:00",
    end: "2025-01-08T15:00:00",
  },
];

export function DatePickerDemo({
  className,
  selectedDateTime,
  setSelectedDateTime,
}) {
  const [timeDialogOpen, setTimeDialogOpen] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleDateSelect = (date) => {
    if (date) {
      const newDateTime = selectedDateTime
        ? set(selectedDateTime, {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
          })
        : set(date, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
      setSelectedDateTime(newDateTime);
    }
  };

  const handleTimeChange = (time) => {
    if (time && selectedDateTime) {
      const [hours, minutes] = [time.hour(), time.minute()];
      const newStartDateTime = set(selectedDateTime, { hours, minutes });
      const newEndDateTime = set(newStartDateTime, { minutes: minutes + 59 });

      // Check for conflicts
      const dayAppointments = appointments.filter((appointment) => {
        const appointmentDate = parseISO(appointment.start);
        return (
          appointmentDate >= startOfDay(newStartDateTime) &&
          appointmentDate <= endOfDay(newStartDateTime)
        );
      });

      const isConflict = dayAppointments.some((appointment) =>
        isWithinInterval(newStartDateTime, {
          start: parseISO(appointment.start),
          end: parseISO(appointment.end),
        })
      );

      if (isConflict) {
        setError("The selected time overlaps with an existing appointment.");
        return;
      }

      setSelectedDateTime(newStartDateTime);
      setError(""); // Clear error
    }
  };

  // // console.log(selectedDateTime);
  // const date = new Date(selectedDateTime);
  // const year = date.getFullYear();
  // const month = date.getMonth() + 1;
  // const day = date.getDate();
  // const hour = date.getHours();
  // const mins = date.getMinutes();
  // const secs = date.getSeconds();
  // console.log(
  //   year +
  //     "-" +
  //     String(month).padStart(2, "0") +
  //     "-" +
  //     String(day).padStart(2, "0") +
  //     "T" +
  //     String(hour).padStart(2, "0") +
  //     ":" +
  //     String(mins).padStart(2, "0") +
  //     ":" +
  //     String(secs).padStart(2, "0")
  // );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            className
              ? className
              : `w-[280px] justify-start text-left font-normal ${
                  !selectedDateTime && "text-muted-foreground"
                }`
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDateTime ? (
            format(selectedDateTime, "PPP p")
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDateTime}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <Dialog open={timeDialogOpen} onOpenChange={setTimeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Clock className="mr-2 h-4 w-4" />
                {selectedDateTime ? format(selectedDateTime, "p") : "Set time"}
                {/* {selectedDateTime && selectedDateTime} */}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set time</DialogTitle>
              </DialogHeader>
              <Space wrap>
                <TimePicker
                  defaultValue={dayjs(selectedDateTime || new Date())}
                  onChange={(value) => handleTimeChange(value)}
                  format="HH:mm"
                />
              </Space>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </DialogContent>
          </Dialog>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// import React from "react";
// import { TimePicker } from "antd";
// import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// dayjs.extend(customParseFormat);
// const onChange = (time, timeString) => {
//   console.log(time, timeString);
// };
// export const DatePickerDemo = () => (
//   <TimePicker
//     onChange={onChange}
//     defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
//   />
// );
