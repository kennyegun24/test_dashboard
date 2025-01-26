"use client";
import Button from "@/components/Button";
import Tiptap from "@/components/tiptap/TipTap";
import { sendToast } from "@/lib/helper";
import axios from "axios";
import React, { useState } from "react";

const page = () => {
  const [content, setContent] = useState(null);
  const onSave = async () => {
    try {
      const req = await axios.post("/api/terms_of_service", {
        content: content,
      });
      return sendToast({
        desc: "Terms and conditions content updated",
        title: "Successful",
      });
    } catch (error) {
      return sendToast({
        variant: "destructive",
        desc: "Terms and conditions not updated",
        title: "Something went wrong",
      });
    }
  };
  return (
    <div className="flex flex-col md:w-[95%] bg-[--foreground] md:px-4 md:py-4 mb-8 py-2 px-2 rounded-[8px] m-auto w-full lg:w-[80%] xl:w-[75%] 2xl:w-[60%] min-[2500px]:w-[35%] min-[3000px]:w-[33%]">
      <Tiptap content={content} setContent={setContent} onSave={onSave} />
      <Button onSave={onSave} text={"Publish"} />
    </div>
  );
};

export default page;
