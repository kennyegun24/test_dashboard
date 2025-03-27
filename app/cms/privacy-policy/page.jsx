"use client";
import { fetchUser } from "@/actions/fetchUser";
import Button from "@/components/Button";
import Tiptap from "@/components/tiptap/TipTap";
import { RequestContext } from "@/contexts/RequestLLoading";
import { sendToast } from "@/lib/helper";
import axios from "axios";
import React, { useContext, useState } from "react";

const page = () => {
  const { setLoading, loading } = useContext(RequestContext);
  const [content, setContent] = useState(null);
  const onSave = async () => {
    const user = await fetchUser();
    setLoading(true);

    try {
      const req = await axios.post(
        "/api/privacy_policy",
        {
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            userId: user?.userId,
          },
        }
      );
      setLoading(false);
      return sendToast({
        desc: "Privacy policy content updated",
        title: "Successful",
      });
    } catch (error) {
      setLoading(false);
      return sendToast({
        variant: "destructive",
        desc: error?.response?.data?.error || "Privacy policy not updated",
        title: "Something went wrong",
      });
    }
  };
  return (
    <div className="flex flex-col md:w-[95%] bg-[--foreground] md:px-4 md:py-4 mb-8 py-2 px-2 rounded-[8px] m-auto w-full lg:w-[80%] xl:w-[75%] 2xl:w-[60%] min-[2500px]:w-[35%] min-[3000px]:w-[33%]">
      <Tiptap content={content} setContent={setContent} />
      <Button onSave={onSave} text={"Publish"} />
    </div>
  );
};

export default page;
