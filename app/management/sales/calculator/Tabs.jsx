"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import Manual from "./_components/Manual";
import Automatic from "./_components/Automatic";

export default function TabsDemo({
  revenueData,
  setRevenueData,
  processedJSON,
  setProcessedJSON,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  return (
    <Tabs defaultValue={query || "manual"} className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-[--foreground]">
        <TabsTrigger
          onClick={() => router.push("/management/sales/calculator?q=manual")}
          value="manual"
        >
          Manual Calculator
        </TabsTrigger>
        <TabsTrigger
          onClick={() =>
            router.push("/management/sales/calculator?q=automatic")
          }
          value="automatic"
        >
          Automatic Calculator
        </TabsTrigger>
      </TabsList>
      <TabsContent value="manual">
        <Manual
          revenueData={revenueData}
          processedJSON={processedJSON}
          setProcessedJSON={setProcessedJSON}
          setRevenueData={setRevenueData}
        />
      </TabsContent>
      <TabsContent value="automatic" className="max-w-full">
        <Automatic
          revenueData={revenueData}
          processedJSON={processedJSON}
          setProcessedJSON={setProcessedJSON}
          setRevenueData={setRevenueData}
        />
      </TabsContent>
    </Tabs>
  );
}
