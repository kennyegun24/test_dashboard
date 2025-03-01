"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Activity from "./_components/activity/Activity";
import Emails from "./_components/emails/Emails";
import { useRouter, useSearchParams } from "next/navigation";
import NewTask from "./_components/task/NewTask";
import Meetings from "./_components/Meetings";
import Calendar from "./_components/calendar/Calendar";

export default function TabsDemo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  return (
    <Tabs defaultValue={query || "activity"} className="w-full h-full">
      <TabsList className="grid w-full grid-cols-3 bg-[--foreground] sticky top-[4.8vh]">
        <TabsTrigger
          onClick={() => router.push("/management/leads?q=activity")}
          value="activity"
        >
          Activity
        </TabsTrigger>
        {/* <TabsTrigger
          onClick={() => router.push("/management/leads?q=emails")}
          value="emails"
        >
          Emails
        </TabsTrigger> */}
        <TabsTrigger
          onClick={() => router.push("/management/leads?q=task")}
          value="task"
        >
          Task
        </TabsTrigger>
        {/* <TabsTrigger
          onClick={() => router.push("/management/leads?q=meetings")}
          value="meetings"
        >
          Meetings
        </TabsTrigger> */}
        <TabsTrigger
          onClick={() => router.push("/management/leads?q=calendar")}
          value="calendar"
        >
          Calendar
        </TabsTrigger>
      </TabsList>
      <TabsContent value="activity">
        <Activity />
      </TabsContent>
      {/* <TabsContent value="emails" className="max-w-full">
        <Emails />
      </TabsContent> */}
      <TabsContent value="task" className="max-w-full">
        <NewTask />
      </TabsContent>
      {/* <TabsContent value="meetings" className="max-w-full">
        <Meetings />
      </TabsContent> */}
      <TabsContent value="calendar" className="max-w-full calendar-component">
        <Calendar />
      </TabsContent>
      {/*<TabsContent value="password"></TabsContent> */}
    </Tabs>
  );
}
