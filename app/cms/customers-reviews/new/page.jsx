"use client";
import { fetchUser } from "@/actions/fetchUser";
import Button from "@/components/Button";
import ImageField from "@/components/ImageField";
import { TextArea } from "@/components/TextArea";
import InputField from "@/components/TextInput";
import { RequestContext } from "@/contexts/RequestLLoading";
import { sendToast } from "@/lib/helper";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import { handleUploadToCloudinary } from "@/utils/cloudinary";
import axios from "axios";
import React, { useContext, useState } from "react";

const page = () => {
  const { setLoading } = useContext(RequestContext);
  const [review, setReview] = useState({
    name: "",
    review: "",
    cover_image: null,
  });
  const onSave = async ({}) => {
    setLoading(true);
    if (!review.name || !review.review || !review.cover_image) {
      setLoading(false);
      return sendToast({
        variant: "destructive",
        title: "Parameters invalid",
        desc: "Client name, Client review and Image should not be empty.",
      });
    }
    const user = await fetchUser();
    const imageUrl = await handleUploadToCloudinary(review.cover_image);

    try {
      const updated = await axios.post(
        `${BACKEND_API_ROUTE}/reviews`,
        {
          clientName: review.name,
          clientReview: review.review,
          clientImage: imageUrl,
          // "https://res.cloudinary.com/drfqge33t/image/upload/v1745830957/freepik__background__19650_cqvfwu.png",
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            userId: user?.userId,
          },
        }
      );
      if (updated.status === 201) {
        sendToast({
          title: "Successful",
          desc: "Client review added successfully",
        });
      }
    } catch (error) {
      console.log(error);
      sendToast({
        variant: "destructive",
        title: "Update failed",
        desc: error?.response?.data?.error || "Could not add review.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col md:w-[95%] bg-[--foreground] md:px-4 md:py-4 mb-8 py-2 px-2 rounded-[8px] m-auto w-full lg:w-[80%] xl:w-[75%] 2xl:w-[60%] min-[2500px]:w-[35%] min-[3000px]:w-[33%]">
      <InputField
        onChange={(e) => setReview((p) => ({ ...p, name: e.target.value }))}
        label={"Client's name"}
        placeholder={"Enter client's name"}
      />
      <TextArea
        onChange={(e) => setReview((p) => ({ ...p, review: e.target.value }))}
        label={"Client's review"}
        placeholder={"What the client said"}
      />
      {/* <HashTags
        label={"Hashtags"}
        optional={true}
        placeholder={"Hashtags client used!"}
      /> */}
      <ImageField
        label={"Client's image"}
        placeholder={"Place client's image here"}
        id={"client's image"}
        blogDetails={review}
        setBlogDetails={setReview}
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
