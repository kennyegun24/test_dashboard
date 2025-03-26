"use client";
import React, { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";
import { RequestContext } from "@/contexts/RequestLLoading";
import { login } from "@/actions/login";
import { sendToast } from "@/lib/helper";

const AuthForm = () => {
  const [userInput, setUserInput] = useState({ password: "", email: "" });
  const { setLoading, loading } = useContext(RequestContext);
  const loginUser = async (e) => {
    setLoading(true);
    e.preventDefault();
    // startTransition(() => {
    //   login(userInput).then((err) => {
    //     console.log(err);
    //     err?.error && setErrMessage(JSON.parse(err?.error));
    //     setLoading(false);
    //   });
    // });
    try {
      const req = await login(userInput);

      if (req.zodError) {
        const Err = () => (
          <p className="whitespace-pre text-red-500">{req.zodError}</p>
        );
        setLoading(false);
        return sendToast({
          desc: <Err />,
          title: "Login not successful",
          // variant: "destructive",
        });
      }
      if (req.error) {
        setLoading(false);
        return sendToast({
          desc: req.error,
          title: "Login not successful",
          variant: "destructive",
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const onChange = (e) => {
    setUserInput((p) => ({ ...p, [e.target.name]: e.target.value }));
  };
  return (
    <div className="flex-col items-center flex gap-4">
      <div className="logo_bg" />
      <form
        onSubmit={loginUser}
        className="mb-8 bg-[--foreground] rounded-[1rem] box_shadow w-[310px] md:w-[400px] py-10 px-[1.5rem] flex flex-col gap-[2rem]"
      >
        <section className="flex flex-col gap-2">
          <h2 className="text-[20px] md:text-[22px] font-semibold text-center">
            Welcome Back to AJL Webcraft
          </h2>
          <p className="text-center text-[.75rem] text-[--primary-text-color]">
            Seamlessly integrating it, business, digital marketing, and tech
            development expertise to drive business success
          </p>
        </section>
        {/* <section className="flex items-center justify-between">
          <p className="flex items-center border-2 border-[--secondary-border-color] h-[2.4rem] gap-2 text-[14px] justify-center rounded-full w-[82%]">
            <FcGoogle />
            Sign in with Google
          </p>
          <div className="w-[15%] border-2 border-[--secondary-border-color] h-[2.4rem] flex items-center justify-center rounded-[12px]">
            <div className="h-fit w-fit bg-[--white] rounded-full">
              <FaFacebook color="blue" />
            </div>
          </div>
        </section> */}
        <p className="or_horizontal flex justify-center text-[14px]">OR</p>
        <section className="flex gap-4 flex-col">
          <input
            onChange={onChange}
            disabled={loading}
            className="px-4 py-2 bg-[--background] text-[15px] rounded-full"
            placeholder="Enter an email address"
            type="text"
            name="email"
          />
          <input
            className="px-4 py-2 bg-[--background] text-[15px] rounded-full"
            placeholder="Password"
            type="text"
            disabled={loading}
            onChange={onChange}
            name="password"
          />
          <Link
            href={"/auth/forgot-password"}
            className="md:text-[13px] text-[13px] ml-auto text-[--green-color]"
          >
            Forgot Password?
          </Link>
          <button
            disabled={loading}
            className="bg-[--green_background] text-[--white] py-2 rounded-[6px]"
          >
            Sign In
          </button>
        </section>
      </form>
    </div>
  );
};

export default AuthForm;
