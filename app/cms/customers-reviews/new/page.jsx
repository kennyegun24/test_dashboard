"use client";
import Button from "@/components/Button";
import ImageField from "@/components/ImageField";
import { TextArea } from "@/components/TextArea";
import InputField from "@/components/TextInput";
import React from "react";

const page = () => {
  const onSave = () => {};
  return (
    <div className="flex flex-col md:w-[95%] bg-[--foreground] md:px-4 md:py-4 mb-8 py-2 px-2 rounded-[8px] m-auto w-full lg:w-[80%] xl:w-[75%] 2xl:w-[60%] min-[2500px]:w-[35%] min-[3000px]:w-[33%]">
      <InputField label={"Client's name"} placeholder={"Enter client's name"} />
      <TextArea
        label={"Client's review"}
        placeholder={"What the client said"}
      />
      <HashTags
        label={"Hashtags"}
        optional={true}
        placeholder={"Hashtags client used!"}
      />
      <ImageField
        label={"Client's image"}
        placeholder={"Place client's image here"}
        id={"client's image"}
      />
      <Button onSave={onSave} text={"Save"} />
    </div>
  );
};

export default page;

const HashTags = ({ label, placeholder, optional }) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label htmlFor="" className="text-[.8rem] font-[600]">
        {label}
        {optional && (
          <span className="text-[.65rem] ml-[.25rem] text-red-500 font-[400]">
            (optional)
          </span>
        )}
      </label>
      <input
        type="text"
        name=""
        id=""
        className="bg-transparent md:w-[80%] text-[.8rem] resize-none border border-[--border-color] px-4 py-2 rounded-[6px]"
        placeholder={placeholder}
      />
    </div>
  );
};
