"use client";
import React from "react";
import Button from "./Button";
import auth from "@/public/auth.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AccessRestricted = () => {
  const router = useRouter();
  const onClick = () => {
    router.push("/");
  };
  return (
    <div className="fixed top-0 left-0 z-[999] h-full w-full restricted-backdrop flex items-center justify-center">
      <section className="m-auto w-[300px] md:w-[450px] min-h-[350px] bg-[--background] p-4 flex flex-col md:flex-row items-center gap-3 rounded-md">
        <Image src={auth} className="md:w-[150px] md:h-[150px] " />
        <div className="flex flex-col gap-1 items-center md:items-start">
          <h4 className="text-[.9rem] font-bold">Access Denied</h4>
          <p className="text-[.7rem] md:block hidden">
            You do not have permission to view this page, contact admin for
            permission.
          </p>
          <p className="text-[.7rem] text-center md:hidden">
            You do not have permission to view this page, contact admin for
            permission.
          </p>
          <Button
            text={"Homepage"}
            className={"w-fit text-[.7rem] md:mx-0 mx-auto"}
            onSave={onClick}
          />
        </div>
      </section>
    </div>
  );
};

export default AccessRestricted;
