import OTP from "@/components/OTP";
import React from "react";
import LeftSide from "../LeftSide";
import ResendCode from "./_components/ResendCode";

const page = () => {
  console.log("first");
  return (
    <div className="flex h-[100vh]">
      <section className="xl:w-[40%] min-[1800px]:w-[30%] min-[2400px]:w-[30%] lg:w-[50%] hidden lg:block min-h-[100vh]">
        <LeftSide />
      </section>
      <section className="xl:w-[60%] min-[1800px]:w-[70%] min-[2400px]:w-[70%] w-full lg:w-[50%] flex justify-center items-center min-h-[100vh] flex flex-col gap-2">
        <OTP />
        <ResendCode />
      </section>
    </div>
  );
};

export default page;
