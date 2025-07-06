import Image from "next/image";
import React from "react";
// import auth_bg from "@/public/auth_bg.jpeg";
import auth_bg from "@/public/auth-img.png";
const LeftSide = () => {
  return (
    <div className="h-full relative">
      <Image
        className="h-full w-full object-cover"
        src={auth_bg}
        style={{
          maskImage: "linear-gradient(to top, transparent, #fff)",
          WebkitMaskImage: "linear-gradient(to top, transparent, #fff)",
        }}
      />
      <div className="absolute top-[50%] transform translate-y-[-50%] p-8 2xl:pl-[10%] mb-8">
        <h3 className="text-[42px] text-[#fff] font-[700] mb-8 w-[85%]">
          Welcome to AJL Webcraft, multifaceted consulting firm,
        </h3>
        <p className="leading-[28px] text-[#fff]">
          Seamlessly integrating it, business, digital marketing, and tech
          development expertise to drive business success
        </p>
      </div>
    </div>
  );
};

export default LeftSide;
