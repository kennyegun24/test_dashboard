import React from "react";

import SalesPage from "./SalesPage";
import { BACKEND_API_ROUTE } from "@/utils/api_route";

const page = async () => {
  const fetchMetrics = await fetch(
    `${BACKEND_API_ROUTE}/sales/expenses/metrics`,
    {
      cache: "no-store",
    }
  );

  const metricsData = await fetchMetrics.json();
  const metricsResponse = await metricsData?.data;

  const fetchRevenueTrendsPie = await fetch(
    `${BACKEND_API_ROUTE}/sales/expenses`,
    {
      cache: "no-store",
    }
  );
  const revenueData = await fetchRevenueTrendsPie.json();
  const revenueTrendsPie = await revenueData?.data;

  const fetchRecentTransactions = await fetch(
    `${BACKEND_API_ROUTE}/sales/transactions`,
    {
      cache: "no-store",
    }
  );
  const transactionsData = await fetchRecentTransactions.json();
  const transactionTable = await transactionsData?.data;

  return (
    <SalesPage
      metrics={metricsResponse}
      pieData={revenueTrendsPie}
      transactions={transactionTable}
    />
  );
};

export default page;
