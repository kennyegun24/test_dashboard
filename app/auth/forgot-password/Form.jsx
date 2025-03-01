import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";

const AuthForm = () => {
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
          <Inputs />
          <button className="bg-[--deep_green] text-[--white] text-[14px] py-2 rounded-[6px]">
            Send Instructions
          </button>
        </section>
      </div>
    </div>
  );
};

export default AuthForm;

const Inputs = () => {
  return (
    <>
      <input
        className="px-4 py-[0.75rem] bg-[--auth_bg] text-[14px] rounded-full"
        placeholder="Enter an email address"
        type="text"
      />
    </>
  );
};
