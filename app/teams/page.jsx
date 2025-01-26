import MetricCards from "@/components/MetricCards";
import React from "react";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { RoleDistributionChart } from "./_components/RolesDistributionChart";
import TeamMembers from "./_components/TeamList";
import { BACKEND_API_ROUTE } from "@/utils/api_route";

const page = async () => {
  const fetchTeamMembers = await fetch(`${BACKEND_API_ROUTE}/teams`, {
    cache: "no-store",
  });
  const teamsData = await fetchTeamMembers.json();
  const teamTable = await teamsData?.data;

  const fetchRoles = await fetch(
    `${BACKEND_API_ROUTE}/teams/roles-distribution`,
    {
      cache: "no-store",
    }
  );
  const rolesData = await fetchRoles.json();
  const roles = await rolesData?.data;
  return (
    <section className="md:w-[95%] lg:w-[92%] flex flex-col items-start justify-between 2xl:w-[90%] min-[2200px]:w-[75%] min-[2700px]:w-[60%] w-full md:py-8 py-4 px-4 md:px-0 mx-auto">
      <section className="flex gap-8 w-full items-stretch">
        <section className="flex flex-col gap-8 w-full">
          <section className="w-full flex justify-between md:flex-row flex-col flex-stretch">
            <section className="md:w-[38%] w-full h-full">
              <MetricCards
                Icon={MdOutlinePeopleAlt}
                amount={teamTable.length}
                header={"Total team members"}
                percent={35.5}
                color={"var(--blue)"}
                displayText={false}
              />
            </section>
            <section className="md:w-[60%] w-[calc(100vw-2rem)]">
              <RoleDistributionChart data={roles} />
            </section>
          </section>
        </section>
      </section>
      <section className="mt-12 max-w-[calc(100vw-2rem)] mx-auto bg-[--foreground] md:px-4 md:py-6 px-2 py-3 rounded-lg">
        <TeamMembers data={teamTable} />
      </section>
    </section>
  );
};

export default page;
