"use client";
import { cn } from "@/lib/utils";
import React from "react";

const Button = ({ onSave, text, className }) => {
  return (
    <button
      onClick={onSave}
      className={cn(
        "text-[.8rem] bg-[--btn_background] rounded-[8px] px-4 py-2 text-[#fff] mt-4 w-[30%] mx-auto",
        className
      )}
    >
      {text}
    </button>
  );
};

export default Button;
