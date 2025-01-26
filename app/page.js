import { BACKEND_API_ROUTE } from "@/utils/api_route";
import MainDashboard from "./MainDashboard";

const page = async () => {
  const fetchMetrics = await fetch(
    `${BACKEND_API_ROUTE}/sales/expenses/metrics`,
    {
      cache: "no-store",
    }
  );
  const metricsData = await fetchMetrics.json();
  const metricsResponse = await metricsData?.data;

  const fetchMap = await fetch(`${BACKEND_API_ROUTE}/visits/region`, {
    cache: "no-store",
  });
  const mapData = await fetchMap.json();
  const mapResponse = await mapData?.data;

  const fetchLeads = await fetch(`${BACKEND_API_ROUTE}/leads-management`, {
    cache: "no-store",
  });
  const leadsData = await fetchLeads.json();
  const leadsResponse = await leadsData.data;
  return (
    <MainDashboard
      metrics={metricsResponse}
      maps={mapResponse}
      leads={leadsResponse}
    />
  );
};

export default page;
