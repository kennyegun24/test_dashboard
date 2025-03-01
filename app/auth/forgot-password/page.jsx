import React from "react";
import LeftSide from "../LeftSide";
import AuthForm from "./Form";

const page = () => {
  return (
    <div className="flex h-[100vh] bg-[--auth_bg]">
      <section className="xl:w-[40%] min-[1800px]:w-[30%] min-[2400px]:w-[30%] lg:w-[50%] hidden lg:block min-h-[100vh]">
        <LeftSide />
      </section>
      <section className="xl:w-[60%] min-[1800px]:w-[70%] min-[2400px]:w-[70%] w-full lg:w-[50%] flex justify-center items-center min-h-[100vh]">
        <AuthForm />
      </section>
    </div>
  );
};

export default page;
