import React from "react";
import RolesTabs from "./Tabs";
import ExistingRoles from "./ExistingRoles";

const page = () => {
  return (
    <section className="md:w-[95%] lg:w-[92%] 2xl:w-[90%] min-[2200px]:w-[75%] min-[2700px]:w-[60%] w-full md:py-8 py-4 px-4 md:px-0 mx-auto">
      <section className="flex justify-between items-stretch w-full h-full bg-[--background] z-[999]">
        <div className="min-w-[10%] pr-4 sticky top-[5rem] h-full border-r border-r-[--secondary-border-color] min-h-[80vh]">
          <ExistingRoles />
        </div>
        <div className="w-[85%]">
          <RolesTabs />
        </div>
      </section>
    </section>
  );
};

export default page;
