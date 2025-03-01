"use client";
import React, { useEffect, useState } from "react";

const ResendCode = () => {
  const [time, setTime] = useState(60 * 1000);

  useEffect(() => {
    if (time > 0) {
      const timer = setTimeout(() => {
        setTime(time - 1000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [time]);

  const formatTime = () => {
    const secs = parseInt(Math.floor(time / 1000));
    const mins = parseInt(Math.floor(secs / 60));
    const hrs = parseInt(Math.floor(mins / 60));
    const days = parseInt(Math.floor(hrs / 24));

    let seconds = String(secs % 60).padStart(2, "0");
    let minutes = String(mins % 60).padStart(2, "0");
    let hours = String(hrs % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  return (
    <div>
      <p className="text-center mx-auto mt-4 text-[14px] md:text-[16px]">
        Didn&apos;t receive code?{" "}
        {time > 0 ? (
          <span className="text-gray-500 font-bold">{formatTime()}</span>
        ) : (
          <span className="text-[--green_color] font-bold">resend code</span>
        )}
      </p>
    </div>
  );
};

export default ResendCode;
