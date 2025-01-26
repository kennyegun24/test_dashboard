import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="md:w-[95%] lg:w-[92%] flex flex-col items-start justify-between 2xl:w-[90%] min-[2200px]:w-[75%] min-[2700px]:w-[60%] w-full md:py-8 py-4 px-4 md:px-0 mx-auto">
      <section className="flex flex-col md:flex-row items-start justify-between w-full">
        <div className="flex flex-col gap-4 w-full md:w-[68%]">
          <div className="flex items-center gap-4 w-full">
            <Skeleton className="h-[150px] md:w-[250px] w-1/2 rounded-xl" />
            <Skeleton className="h-[150px] md:w-[250px] w-1/2 rounded-xl" />
            <Skeleton className="h-[150px] hidden md:block w-[250px] rounded-xl" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-[240px] w-full md:w-[40%] rounded-xl" />
            <Skeleton className="h-[240px] hidden md:block w-[60%] rounded-xl" />
          </div>
          <Skeleton className="h-[50vh] w-[100%] rounded-xl" />
        </div>
        <Skeleton className="h-[80vh] hidden md:block w-[30%] rounded-xl" />
      </section>
    </div>
  );
};

export default Loading;
