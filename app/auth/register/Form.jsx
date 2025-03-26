"use client";
import React, { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import { signUpSchema } from "@/lib/zod";
import { sendToast } from "@/lib/helper";
import { RequestContext } from "@/contexts/RequestLLoading";

const AuthForm = () => {
  const { setLoading, loading } = useContext(RequestContext);
  const redirect = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");
  const [password, setPassword] = useState({
    terms: false,
    password: "",
  });
  const reg = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validateFields = signUpSchema.safeParse({
      email: email || "",
      password: password.password,
      token,
    });
    if (!validateFields.success) {
      const errMssg = JSON.parse(validateFields.error.message)
        .map((e) => e.message)
        .join("\n");
      const Err = () => (
        <p className="whitespace-pre text-red-500">{errMssg}</p>
      );
      sendToast({
        desc: <Err />,
        title: "Password set not successful",
      });
      setLoading(false);
      return;
    }
    try {
      const req = await axios.post(`${BACKEND_API_ROUTE}/teams/auth/register`, {
        password: password.password,
        code: token,
        email: email,
      });
      setLoading(false);
      return redirect.push("/auth/login");
    } catch (error) {
      setLoading(false);
      return sendToast({
        desc: "Something went wrong",
        title: "UnSuccessful",
      });
    }
  };
  const onChange = (e) => {
    if (e.target.type === "checkbox") {
      setPassword((p) => ({ ...p, [e.target.name]: e.target.checked }));
    } else {
      setPassword((p) => ({ ...p, [e.target.name]: e.target.value }));
    }
  };
  console.log(password);
  return (
    <div className="flex-col items-center flex gap-4">
      <div className="logo_bg" />
      <form
        onSubmit={reg}
        onChange={onChange}
        className="mb-8 bg-[--auth_secondary_bg] rounded-[1rem] box_shadow w-[100%]  md:w-[400px] py-10 px-[1.5rem] flex flex-col gap-[2rem]"
      >
        <section className="flex flex-col gap-2">
          <h2 className="text-[20px] md:text-[24px]">
            Get Started with an Account
          </h2>
          <p className="text-[14px]">
            Have an account?{" "}
            <Link href={"/auth/login"} className="text-[--deep_green_trns]">
              {" "}
              Sign in
            </Link>
          </p>
        </section>
        {/* <section className="flex items-center justify-between">
          <p className="flex items-center border-2 border-[--auth_border] h-[2.4rem] gap-2 text-[14px] justify-center rounded-full w-[82%]">
            <FcGoogle />
            Sign up with Google
          </p>
          <div className="w-[15%] border-2 border-[--auth_border] h-[2.4rem] flex items-center justify-center rounded-[12px]">
            <div className="h-fit w-fit bg-[--white] rounded-full">
              <FaFacebook color="blue" />
            </div>
          </div>
        </section> */}
        {/* <p className="or_horizontal flex justify-center text-[14px]">OR</p> */}
        <section className="flex gap-4 flex-col">
          <Inputs />
          <span className="text-[12px] px-2 text-[--light_text]">
            At least 8 letters, with one uppercase, one lowercase, one special
            character and one digit.
          </span>
          {/* <CheckBoxes /> */}
          <button className="bg-[--btn_background] text-[--white] py-2 rounded-[6px]">
            Sign Up
          </button>
        </section>
      </form>
    </div>
  );
};

export default AuthForm;

const Inputs = () => {
  return (
    <>
      <input
        className="px-4 py-[0.75rem] bg-[--auth_bg] text-[14px] rounded-full border-[--secondary-border-color] border"
        placeholder="Set password"
        type="text"
        name="password"
      />
    </>
  );
};

const CheckBoxes = () => {
  return (
    <>
      <div className="flex gap-2">
        <input name="terms" type="checkbox" id="terms_service" />
        <label
          htmlFor="terms_service"
          className="text-[12px] text-[--text_color]"
        >
          I agree to AJL Webcraft{" "}
          <Link className="text-[--green_color]" href={"/terms&conditions"}>
            Terms of use
          </Link>{" "}
          and
          <Link className="text-[--green_color]" href={"/privacy_policy"}>
            Privacy Policy
          </Link>
        </label>
      </div>
      {/* <div className="flex gap-2">
        <input type="checkbox" id="terms_service" />
        <label
          htmlFor="terms_service"
          className="text-[12px] text-[--text_color]"
        >
          I agree to Stripo Terms of use and Privacy Policy
        </label>
      </div> */}
    </>
  );
};
