"use client";
import React, { useState } from "react";
import logo from "@/public/logo.png";
import Image from "next/image";
import InputField from "@/components/TextInput";
import SectionDivider from "@/components/SectionDivider";
import Button from "@/components/Button";
import { v4 as uuidv4 } from "uuid";
import { FaPlus } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { TextArea } from "@/components/TextArea";
import axios from "axios";
import { sendToast } from "@/lib/helper";
import { fetchUser } from "@/actions/fetchUser";

const page = () => {
  const [contents, setContents] = useState({
    logo: null,
    company_name: "",
    phone: "",
    email: "",
    socials: {
      whatsapp: null,
      facebook: null,
      linkedin: null,
      youtube: null,
      twitter: null,
    },
  });
  const onChangeLogo = (e) => {
    if (e.target.name === "logo") {
      console.log(e.target.files[0]);
      setContents((prev) => ({
        ...prev,
        logo: e.target.files[0],
      }));
    }
  };
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name in contents.socials) {
      setContents((prev) => ({
        ...prev,
        socials: {
          ...prev.socials,
          [name.toLowerCase()]: value,
        },
      }));
    } else {
      setContents((prev) => ({
        ...prev,
        [name.toLowerCase()]: value,
      }));
    }
  };
  const onSaveLogoName = async () => {
    const user = await fetchUser();
    try {
      const formData = new FormData();
      formData.append("file", contents.logo);
      console.log(logo);
      const logoReq = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = await logoReq.data.url;
      const req = await axios.post(
        "/api/crm_content",
        {
          logo: imageUrl,
          company_name: contents.company_name,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            userId: user?.userId,
          },
        }
      );

      setContents((p) => ({
        ...p,
        logo: null,
        company_name: "",
      }));
      return sendToast({
        desc: "Company name and logo updated",
        title: "Successful",
      });
    } catch (error) {
      console.log(error);
      return sendToast({
        variant: "destructive",
        // desc: error?.response?.data?.error || "Company data not updated",
        desc: "Company data not updated",
        title: "Something went wrong",
      });
    }
  };
  const onSaveContact = async () => {
    const user = await fetchUser();
    try {
      const req = await axios.post(
        "/api/crm_content",
        {
          phone: contents.phone,
          email: contents.email,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            userId: user?.userId,
          },
        }
      );

      setContents((p) => ({
        ...p,
        phone: "",
        email: "",
      }));
      return sendToast({
        desc: "Company contacts updated",
        title: "Successful",
      });
    } catch (error) {
      return sendToast({
        variant: "destructive",
        desc: error?.response?.data?.error || "Company contact not updated",
        title: "Something went wrong",
      });
    }
  };
  const onSaveSocials = async () => {
    try {
      const socialsArray = Object.entries(contents.socials).map(
        ([platform, url]) => ({
          platform,
          url,
        })
      );
      const user = await fetchUser();

      const req = await axios.post(
        "/api/crm_content",
        {
          socials: socialsArray,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            userId: user?.userId,
          },
        }
      );

      setContents((p) => ({
        ...p,
        socials: {
          whatsapp: null,
          facebook: null,
          linkedin: null,
          youtube: null,
          twitter: null,
        },
      }));
      return sendToast({
        desc: "Company socials updated",
        title: "Successful",
      });
    } catch (error) {
      return sendToast({
        variant: "destructive",
        desc: error?.response?.data?.error || "Company data not updated",
        title: "Something went wrong",
      });
    }
  };
  return (
    <div className="flex flex-col md:w-[95%] bg-[--foreground] md:px-4 md:py-4 mb-8 py-2 px-4 rounded-[8px] m-auto w-full lg:w-[80%] xl:w-[75%] 2xl:w-[60%] min-[2500px]:w-[35%] min-[3000px]:w-[33%]">
      <section className="w-full mt-4">
        <FlexContainer>
          <div className="flex flex-col gap-1">
            <h3 className="text-[.9rem] font-[700]">Website Logo</h3>
            <p className="text-[.7rem] text-[--primary-text-color]">
              Manage your website logo
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src={logo}
              className="h-[80px] rounded-sm w-[80px] object-contain border-dashed border border-[--border-color]"
              name="logo"
            />
            <input
              onChange={onChangeLogo}
              type="file"
              className="hidden"
              name="logo"
              id="replace-logo"
            />
            <label
              className="border-dashed border border-[--btn_background] rounded-sm text-[.75rem] px-6 py-2"
              htmlFor="replace-logo"
            >
              Replace Logo
            </label>
          </div>
        </FlexContainer>
        <div className="w-[60%] mt-4">
          <InputField
            onChange={onChange}
            label={"Company's Name"}
            name={"company_name"}
            placeholder={"Enter new company name..."}
          />
        </div>
        <Button onSave={onSaveLogoName} text={"Save"} />
      </section>
      <SectionDivider text={"Contact Information"} />
      <section className="w-[60%]">
        <InputField
          onChange={onChange}
          label={"Phone number"}
          name={"phone"}
          placeholder={"Enter new phone number..."}
        />
        <InputField
          onChange={onChange}
          label={"Email address"}
          name={"email"}
          placeholder={"Enter new email address..."}
        />
        <Button onSave={onSaveContact} text={"Save"} />
      </section>
      <SectionDivider text={"Social Accounts"} />
      <section className="w-[60%]">
        {Object.keys(contents.socials).map((social) => (
          <InputField
            key={social}
            onChange={onChange}
            label={social.charAt(0).toUpperCase() + social.slice(1)}
            name={social}
            placeholder={`Enter ${social} profile link...`}
            value={contents.socials[social]}
          />
        ))}
        <Button onSave={onSaveSocials} text={"Save"} />
      </section>
      <SectionDivider text={"Frequently asked questions"} />
      <section className="w-[60%]">
        <FAQS />
      </section>

      <SectionDivider text={"About me section"} />
      <section className="w-[60%]">
        <ABOUT_ME />
      </section>
    </div>
  );
};

export default page;

const FAQS = () => {
  const newFq = {
    id: uuidv4(),
    question: "",
    answer: "",
  };
  const [faq, setFaq] = useState([
    {
      id: uuidv4(),
      question: "",
      answer: "",
    },
  ]);
  const onDelete = (id) => {
    const newArray = faq.filter((e) => e.id != id);
    setFaq(newArray);
  };

  const onChange = (e, id) => {
    const { name, value } = e.target;
    setFaq((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [name]: value } : item))
    );
  };

  const onSaveFaqs = async () => {
    const user = await fetchUser();

    try {
      const response = await axios.post(
        "/api/faq",
        { faqs: faq },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            userId: user?.userId,
          },
        }
      );

      setFaq({
        ...newFq,
      });
      return sendToast({
        desc: "FAQs updated",
        title: "Successful",
      });
    } catch (error) {
      return sendToast({
        variant: "destructive",
        desc: error?.response?.data?.error || "FAQs not updated",
        title: "Something went wrong",
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {faq.map((item) => {
        return (
          <div key={item.id} className="flex items-start gap-2">
            <div className="w-[70%] flex flex-col gap-2">
              <input
                type="text"
                name="question"
                value={item.question}
                onChange={(e) => onChange(e, item.id)}
                placeholder="Enter title"
                className="bg-transparent md:w-[80%] text-[.8rem] border border-[--border-color] px-4 py-2 rounded-[6px]"
              />
              <textarea
                name="answer"
                value={item.answer}
                onChange={(e) => onChange(e, item.id)}
                placeholder="Enter description"
                className="bg-transparent md:w-[80%] text-[.8rem] resize-none border border-[--border-color] px-4 py-2 rounded-[6px]"
                rows={5}
              />
            </div>
            <button
              onClick={() => onDelete(item.id)}
              className="bg-red-500 rounded-sm flex py-2 px-6 justify-center items-center"
            >
              <IoTrashOutline />
            </button>
          </div>
        );
      })}
      <button
        className="h-[30px] w-[55px] rounded-sm border-dashed border"
        onClick={() => setFaq([...faq, newFq])}
      >
        <FaPlus size={14} className="m-auto" />
      </button>
      <Button onSave={onSaveFaqs} text={"Save faqs"} className={"mx-0"} />
    </div>
  );
};

const ABOUT_ME = () => {
  const [aboutMe, setAboutMe] = useState({
    header: null,
    body: null,
  });

  const onSaveAboutMe = async () => {
    const user = await fetchUser();

    try {
      const response = await axios.post(
        "/api/about_me",
        {
          header: aboutMe.header,
          body: aboutMe.body,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            userId: user?.userId,
          },
        }
      );

      setAboutMe({
        header: null,
        body: null,
      });
      return sendToast({
        desc: "About me updated",
        title: "Successful",
      });
    } catch (error) {
      return sendToast({
        variant: "destructive",
        desc: error?.response?.data?.error || "About me not updated",
        title: "Something went wrong",
      });
    }
  };

  const onChange = (e) => {
    setAboutMe((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <>
      <InputField
        onChange={onChange}
        name={"header"}
        label={"About me header"}
        placeholder={"Change about me section header text"}
      />
      <TextArea
        onChange={onChange}
        name={"body"}
        label={"About me"}
        placeholder={"Change about me section text"}
      />
      <Button onSave={onSaveAboutMe} text={"Update About me"} />
    </>
  );
};

const FlexContainer = ({ children }) => (
  <section className="flex md:items-center md:justify-between md:flex-row flex-col gap-2 md:gap-0">
    {children}
  </section>
);
