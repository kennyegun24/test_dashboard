"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";
import { Input } from "antd";

const AuthForm = () => {
  return (
    <div className="flex-col items-center flex gap-4">
      <div className="logo_bg" />
      <div className="mb-8 bg-[--auth_secondary_bg] rounded-[1rem] box_shadow w-[100%]  md:w-[400px] py-10 px-[1.5rem] flex flex-col gap-[2rem]">
        <section className="flex flex-col gap-2">
          <h2 className="text-[20px] md:text-[24px]">Change your password</h2>
          <p className="text-[14px]">
            Kindly use a strong password combination to secure your account
          </p>
          <p className="text-[14px]">
            Don&apos;t have an account?{" "}
            <Link href={"/auth/register"} className="text-[--deep_green_trns]">
              Sign up
            </Link>
          </p>
        </section>
        <section className="flex gap-4 flex-col">
          <Inputs />
          <button className="bg-[--deep_green] text-[--white] text-[14px] py-2 rounded-[6px]">
            Change Password
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
      <Input.Password
        placeholder="OTP code sent to your mail..."
        style={{ background: "var(--auth_bg)", color: "var(--light_text)" }}
      />
      <Input.Password
        placeholder="Input new password"
        style={{ background: "var(--auth_bg)", color: "var(--light_text)" }}
      />
      <Input.Password
        // className="px-4 py-[0.75rem] bg-[--auth_bg] text-[14px] rounded-full"
        style={{ background: "var(--auth_bg)", color: "var(--light_text)" }}
        placeholder="Confirm password"
        type="password"
      />
    </>
  );
};
