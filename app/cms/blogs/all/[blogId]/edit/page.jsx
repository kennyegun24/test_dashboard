"use client";
import Tiptap from "@/components/tiptap/TipTap";
import React, { use, useContext, useEffect, useState } from "react";
import ImageField from "@/components/ImageField";
import DocumentField from "@/components/DocumentField";
import Button from "@/components/Button";
import SectionDivider from "@/components/SectionDivider";
import axios from "axios";
import { sendToast } from "@/lib/helper";
import { fetchUser } from "@/actions/fetchUser";
import { RequestContext } from "@/contexts/RequestLLoading";
import useSWR from "swr";
import Loading from "@/app/loading";
import Spinner from "@/components/spinner";

const page = ({ params }) => {
  const { blogId } = params;
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
  const { setLoading } = useContext(RequestContext);

  // const isBlogDetailsEmpty = (blogDetails) => {
  //   return Object.values(blogDetails).some(
  //     (value) => value === null || value === undefined || value === ""
  //   );
  // };

  const onSave = async () => {
    try {
      setLoading(true);
      const user = await fetchUser();
      console.log(blogDetails);
      // if (isBlogDetailsEmpty(blogDetails)) {
      //   setLoading(false);
      //   return sendToast({
      //     variant: "destructive",
      //     desc: "No field should be empty",
      //     title: "Empty fields detected",
      //   });
      // }
      const req = await axios.put(
        "/api/blog",
        {
          id: blogId,
          body: content,
          ...blogDetails,
          docs: null,
          cover_image:
            "https://res.cloudinary.com/drfqge33t/image/upload/v1696797490/asset22_lc0gs6.jpg",
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            userId: user?.userId,
          },
        }
      );

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
      setLoading(false);
      return sendToast({
        desc: "Blog post created",
        title: "Successful",
      });
    } catch (error) {
      setLoading(false);
      return sendToast({
        variant: "destructive",
        desc: error?.response?.data?.error || "Blog post not created",
        title: "Something went wrong",
      });
    }
  };

  const fetcher = async () => {
    try {
      const req = await axios.get(`/api/blog/${blogId}`, {});
      const res = await req.data?.blog;
      console.log(res);
      return await res;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, error, isLoading } = useSWR(blogId, fetcher);
  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <div className="flex flex-col md:w-[95%] bg-[--foreground] md:px-4 md:py-4 mb-8 py-2 px-2 rounded-[8px] m-auto w-full lg:w-[80%] xl:w-[75%] 2xl:w-[60%] min-[2500px]:w-[35%] min-[3000px]:w-[33%]">
      <InputField
        onChange={onChange}
        name={"title"}
        label={"Blog title"}
        placeholder={"Enter blog title"}
        value={data?.title}
      />
      <InputField
        onChange={onChange}
        name={"short_summary"}
        label={"Short summary"}
        placeholder={"Short keypoints to catch visitors attention"}
        value={data?.short_summary}
      />
      <Tiptap
        content={content || data?.body}
        setContent={setContent}
        onSave={onSave}
      />
      <ImageField
        blogDetails={blogDetails}
        setBlogDetails={setBlogDetails}
        id={"image_cover"}
        label={"Cover Image"}
        placeholder={"Click to upload an image here"}
      />
      <DocumentField
        blogDetails={blogDetails}
        setBlogDetails={setBlogDetails}
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
        value={data?.meta_page_title}
      />
      <InputField
        onChange={onChange}
        name={"meta_keywords"}
        label={"Predefined meta tags"}
        placeholder={"Enter meta tags"}
        value={data?.meta_keywords}
      />
      <InputField
        onChange={onChange}
        name={"key_tags"}
        label={"Key tags"}
        placeholder={"Enter meta tags... separate each with a space!"}
        value={data?.key_tags}
      />
      <InputField
        onChange={onChange}
        name={"meta_desc"}
        label={"Meta Description"}
        placeholder={
          "Why is your idea useful, who would benefit and how should it work"
        }
        value={data?.meta_desc}
      />
      <Button onSave={onSave} text={"Publish article"} />
    </div>
  );
};

export default page;

const InputField = ({ label, placeholder, onChange, name, ...props }) => {
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
        {...props}
      />
    </div>
  );
};
