import { cn } from "@/lib/utils";
import { formatNumberCommas } from "@/utils/generalHelpers";
import { TrendingUp, Users } from "lucide-react";
import React from "react";
import EmptyComponent from "./Empty";

const MetricCards = ({
  Icon,
  header,
  amount,
  percent,
  color,
  displayText = true,
}) => {
  return (
    <div className="flex shadows rounded-lg text-[--primary-text-color] flex-col gap-4 mx-auto md:mx-0 w-full bg-[--foreground]">
      {!amount || !percent || !header ? (
        <div className="h-full w-full flex items-center justify-center">
          <EmptyComponent />
        </div>
      ) : (
        <>
          <section className="px-2 py-3 flex flex-col md:gap-0 gap-2 md:flex-row md:justify-between items-start">
            <div className="flex flex-col gap-2">
              <h5 className="flex gap-1 items-center text-[.8rem]">
                <Icon size={16} color={color} />{" "}
                <span className="">{header}</span>
              </h5>
              <p className="font-bold text-xl">{formatNumberCommas(amount)}</p>
            </div>
            <div
              className={cn(
                "flex items-center rounded-[6px] gap-1 p-[.1rem]",
                percent > 0
                  ? "bg-[--green_background] text-[--green-color]"
                  : "bg-[--red_background] text-[--red-color]"
              )}
            >
              <TrendingUp size={14} />
              <p className="text-[.57rem]">{formatNumberCommas(percent)}%</p>
            </div>
          </section>
          {displayText && (
            <p className="text-[.8rem] py-4 px-2 bg-[--background]">
              Data within the last month
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default MetricCards;
