"use client";
import React, { useEffect, useState } from "react";
import TabsDemo from "./Tabs";
import { Download } from "lucide-react";
import LoadingCalculator from "./LoadingCalculator";
import { kFormatter, sendToast } from "@/lib/helper";
import axios from "axios";
import { fetchUser } from "@/actions/fetchUser";

const page = () => {
  const [projectNums, setProjectNums] = useState({
    projectsValue: 0,
    expenses: 0,
    totalRevenue: 0,
    loading: true,
  });
  const [processedJSON, setProcessedJSON] = useState([]);
  console.log(processedJSON);
  const saveToDatabase = async () => {
    try {
      const user = await fetchUser();

      const req = await axios.post(
        "/api/sales",
        {
          sales: processedJSON,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            userId: user?.userId,
          },
        }
      );
      const res = await req.data;
      return sendToast({
        desc: "Sales successfully updated",
        title: "Upload successful",
      });
    } catch (error) {
      console.log(error);
      return sendToast({
        variant: "destructive",
        desc: error?.response?.data?.error || "Error uploading to database.",
        title: "Something went wrong",
      });
    }
  };

  return (
    <section className="flex flex-col gap-4 md:flex-row md:w-[95%] items-start md:px-0 md:py-4 mb-8 py-2 px-2 rounded-[8px] m-auto w-full lg:w-[88%] xl:w-[75%] 2xl:w-[60%] min-[2500px]:w-[40%] min-[3000px]:w-[37%]">
      <section className="max-w-[calc(100vw-1rem)] md:w-[65%] w-full flex flex-row gap-4 flex-col min-h-[calc(100vh-8rem)]">
        <TabsDemo
          setProcessedJSON={setProcessedJSON}
          processedJSON={processedJSON}
          revenueData={projectNums}
          setRevenueData={setProjectNums}
        />
      </section>
      <section className="md:w-[38%] lg:w-[30%] py-2 min-h-[calc(50vh-8rem)] bg-[--foreground] hidden md:flex">
        <GeneratedRevenueCalculator
          onSave={saveToDatabase}
          data={projectNums}
        />
      </section>
    </section>
  );
};

export default page;

const GeneratedRevenueCalculator = ({ data, onSave }) => {
  if (data?.loading)
    return (
      <div className="m-auto">
        <LoadingCalculator />
      </div>
    );
  return (
    <div className="w-full relative pb-12">
      <h4 className="text-sm text-center pb-4">Generated Revenue</h4>
      <div className="flex flex-col h-[80%] justify-between gap-8">
        <section className="w-full flex flex-col gap-2 pl-2">
          <p className="flex gap-4 text-[.7rem] justify-between">
            <span className="w-[30%]">ID:</span>{" "}
            <span className="w-[65%]">#765322</span>
          </p>
          <p className="flex gap-4 text-[.7rem] justify-between">
            <span className="w-[30%]">Name:</span>
            <span className="w-[65%]">Kenny Elias</span>
          </p>
          <p className="flex gap-4 text-[.7rem] justify-between">
            <span className="w-[30%]"> Value:</span>{" "}
            <span className="w-[65%]">
              $
              {data?.projectsValue > 999
                ? kFormatter(data?.projectsValue)
                : data?.projectsValue?.toFixed(2)}
            </span>
          </p>
          <p className="flex gap-4 text-[.7rem] justify-between">
            <span className="w-[30%]">Expenses:</span>{" "}
            <span className="w-[65%]">
              $
              {data?.expenses > 999
                ? kFormatter(data?.expenses)
                : data?.expenses?.toFixed(2)}
            </span>
          </p>
          <p className="flex gap-4 text-[.7rem] justify-between">
            <span className="w-[30%]">Date:</span>{" "}
            <span className="w-[65%]">07-12-2024</span>
          </p>
          <p className="flex gap-4 text-[.7rem] justify-between">
            <span className="">Note:</span>
            <span className="text-[.7rem] w-[80%] ">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Temporibus
            </span>
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <p className="text-center w-[60%] mx-auto text-[.7rem]">
            Your total revenue based on the information provided is:
          </p>
          <p className="text-center text-[--btn_background] font-semibold text-[1.5rem]">
            $
            {data?.totalRevenue > 999
              ? kFormatter(data?.totalRevenue)
              : data?.totalRevenue?.toFixed(2)}
          </p>
          <button
            onClick={onSave}
            className="border-[--btn_background] border rounded-md text-[--btn_background] py-1 px-2 flex gap-2 mx-auto text-[.7rem]"
          >
            <Download size={14} /> Save to database
          </button>
        </section>
      </div>
      <p className="text-[.6rem] absolute bottom-0 text-center left-[50%] transform translate-x-[-50%] pt-8">
        Calculate new revenue
      </p>
    </div>
  );
};
