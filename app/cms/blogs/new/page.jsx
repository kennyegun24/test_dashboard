"use client";
import Tiptap from "@/components/tiptap/TipTap";
import React, { useState } from "react";
import ImageField from "@/components/ImageField";
import DocumentField from "@/components/DocumentField";
import Button from "@/components/Button";
import SectionDivider from "@/components/SectionDivider";
import axios from "axios";
import { sendToast } from "@/lib/helper";

const page = () => {
  const [content, setContent] = useState(null);
  const [blogDetails, setBlogDetails] = useState({
    title: null,
    short_summary: null,
    cover_image: null,
    docs: null,
    meta_page_title: null,
    meta_desc: null,
    key_tags: null,
    meta_keywords: null,
  });
  const onChange = (e) => {
    setBlogDetails((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const onSave = async () => {
    try {
      const req = await axios.post("/api/blog", {
        body: content,
        ...blogDetails,
        cover_image:
          "https://res.cloudinary.com/drfqge33t/image/upload/v1696797490/asset22_lc0gs6.jpg",
      });

      setBlogDetails({
        title: null,
        short_summary: null,
        cover_image: null,
        docs: null,
        meta_page_title: null,
        meta_desc: null,
        key_tags: null,
        meta_keywords: null,
      });
      return sendToast({
        desc: "Blog post created",
        title: "Successful",
      });
    } catch (error) {
      return sendToast({
        variant: "destructive",
        desc: error?.response?.data?.error || "Blog post not created",
        title: "Something went wrong",
      });
    }
  };
  return (
    <div className="flex flex-col md:w-[95%] bg-[--foreground] md:px-4 md:py-4 mb-8 py-2 px-2 rounded-[8px] m-auto w-full lg:w-[80%] xl:w-[75%] 2xl:w-[60%] min-[2500px]:w-[35%] min-[3000px]:w-[33%]">
      <InputField
        onChange={onChange}
        name={"title"}
        label={"Blog title"}
        placeholder={"Enter blog title"}
      />
      <InputField
        onChange={onChange}
        name={"short_summary"}
        label={"Short summary"}
        placeholder={"Short keypoints to catch visitors attention"}
      />
      <Tiptap content={content} setContent={setContent} onSave={onSave} />
      <ImageField
        id={"image_cover"}
        label={"Cover Image"}
        placeholder={"Click to upload an image here"}
      />
      <DocumentField
        id={"document"}
        label={"Documents"}
        placeholder={"Click to upload documents here"}
      />
      <SectionDivider text={"Meta Information"} />
      <InputField
        onChange={onChange}
        name={"meta_page_title"}
        label={"Page title"}
        placeholder={"How to create a CRM"}
      />
      <InputField
        onChange={onChange}
        name={"meta_keywords"}
        label={"Predefined meta tags"}
        placeholder={"Enter meta tags"}
      />
      <InputField
        onChange={onChange}
        name={"key_tags"}
        label={"Key tags"}
        placeholder={"Enter meta tags... separate each with a space!"}
      />
      <InputField
        onChange={onChange}
        name={"meta_desc"}
        label={"Meta Description"}
        placeholder={
          "Why is your idea useful, who would benefit and how should it work"
        }
      />
      <Button onSave={onSave} text={"Publish article"} />
    </div>
  );
};

export default page;

const InputField = ({ label, placeholder, onChange, name }) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label htmlFor="" className="text-[.8rem] font-[600]">
        {label}
      </label>
      <input
        type="text"
        name={name}
        id=""
        className="bg-transparent md:w-[80%] text-[.8rem] border border-[--border-color] px-4 py-2 rounded-[6px]"
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};
