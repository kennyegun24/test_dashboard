"use client";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { Input } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { sendToast } from "@/lib/helper";
import axios from "axios";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import { RequestContext } from "@/contexts/RequestLLoading";

const AuthForm = () => {
  const { setLoading, loading } = useContext(RequestContext);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const sendReq = async () => {
    setLoading(true);
    console.log("click");
    console.log(password);
    try {
      if (!password.newPassword || password.newPassword.trim() === "") {
        sendToast({
          variant: "destructive",
          desc: "Password should not be empty",
          title: "Something went wrong",
        });
        return;
      }

      if (password.newPassword !== password.confirmPassword) {
        sendToast({
          variant: "destructive",
          desc: "Password and confirm password do not match",
          title: "Mismatch",
        });
        return;
      }

      const req = await axios.post(
        `${BACKEND_API_ROUTE}/teams/auth/change-password`,
        {
          email,
          otp: token,
          newPassword: password.newPassword,
        }
      );
      console.log(await req.data?.message);
      sendToast({
        // variant: "destructive",
        title: req.data?.message || "Successful",
        desc: "Password changed!",
      });
      router.push("/auth/login");
    } catch (error) {
      return sendToast({
        variant: "destructive",
        title: error.response.status || "404 Error",
        desc: error.response.data.error || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };
  console.log(email);
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
          <Inputs setPassword={setPassword} email={email} token={token} />
          <button
            onClick={sendReq}
            className="bg-[--deep_green_background] text-[--white] text-[14px] py-2 rounded-[6px]"
          >
            Change Password
          </button>
        </section>
      </div>
    </div>
  );
};

export default AuthForm;

const Inputs = ({ email, token, setPassword }) => {
  return (
    <>
      <Input
        placeholder="Email address..."
        disabled
        value={email}
        style={{ background: "var(--auth_bg)", color: "var(--light_text)" }}
      />
      <Input.Password
        disabled
        value={token}
        placeholder="OTP code sent to your mail..."
        style={{ background: "var(--auth_bg)", color: "var(--light_text)" }}
      />
      <Input.Password
        onChange={(e) =>
          setPassword((p) => ({ ...p, newPassword: e.target.value }))
        }
        placeholder="Input new password"
        style={{ background: "var(--auth_bg)", color: "var(--light_text)" }}
      />
      <Input.Password
        onChange={(e) =>
          setPassword((p) => ({ ...p, confirmPassword: e.target.value }))
        }
        // className="px-4 py-[0.75rem] bg-[--auth_bg] text-[14px] rounded-full"
        style={{ background: "var(--auth_bg)", color: "var(--light_text)" }}
        placeholder="Confirm password"
        type="password"
      />
    </>
  );
};
