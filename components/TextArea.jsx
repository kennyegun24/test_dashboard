import { cn } from "@/lib/utils";
import React from "react";

export const TextArea = ({
  label,
  placeholder,
  name,
  id,
  className,
  onChange = () => {},
}) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label htmlFor="" className="text-[.8rem] font-[600]">
        {label}
      </label>
      <textarea
        type="text"
        rows={10}
        name={name}
        id=""
        className={cn(
          "bg-transparent md:w-[80%] text-[.8rem] resize-none border border-[--border-color] px-4 py-2 rounded-[6px]",
          className
        )}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};
