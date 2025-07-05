"use client";
import React, { useContext, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import { sendToast } from "@/lib/helper";
import { RequestContext } from "@/contexts/RequestLLoading";

const AuthForm = () => {
  const [email, setEmail] = useState(null);
  const { setLoading, loading } = useContext(RequestContext);

  const sendReq = async () => {
    setLoading(true);
    try {
      if (!email)
        return sendToast({
          variant: "destructive",
          title: "Unsuccessful",
          desc: "Email should be present",
        });
      const req = await axios.post(
        `${BACKEND_API_ROUTE}/teams/auth/reset-password`,
        {
          email,
        }
      );
      console.log(await req.data?.message);
      return sendToast({
        // variant: "destructive",
        title: req.data?.message || "Successful",
        desc: "Check your mail for further instructions",
      });
    } catch (error) {
      console.log(error.response.data.error);
      return sendToast({
        variant: "destructive",
        title: error.response.status || "404 Error",
        desc: error.response.data.error || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col items-center flex gap-4">
      <div className="logo_bg" />
      <div className="mb-8 bg-[--auth_secondary_bg] rounded-[1rem] box_shadow w-[100%]  md:w-[400px] py-10 px-[1.5rem] flex flex-col gap-[2rem]">
        <section className="flex flex-col gap-2">
          <h2 className="text-[20px] md:text-[24px]">Forgot your password</h2>
          <p className="text-[14px]">
            Enter the email address associated with your TemplatOF account
          </p>
          <p className="text-[14px]">
            Don&apos;t have an account?{" "}
            <Link href={"/auth/register"} className="text-[--deep_green_trns]">
              {" "}
              Sign up
            </Link>
          </p>
        </section>
        <section className="flex gap-4 flex-col">
          <Inputs setEmail={setEmail} email={email} />
          <button
            onClick={sendReq}
            className="bg-[--deep_green_background] text-[--white] text-[14px] py-2 rounded-[6px]"
          >
            Send Instructions
          </button>
        </section>
      </div>
    </div>
  );
};

export default AuthForm;

const Inputs = ({ email, setEmail }) => {
  return (
    <>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-[0.75rem] bg-[--auth_bg] text-[14px] rounded-full border border-[--primary-text-color]"
        placeholder="Enter an email address"
        type="text"
      />
    </>
  );
};
