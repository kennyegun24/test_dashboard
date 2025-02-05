"use client";
import InputField from "@/components/TextInput";
import React, { useState } from "react";
import { ColorPicker, Space } from "antd";
import Button from "@/components/Button";
import axios from "axios";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import { sendToast } from "@/lib/helper";
import { useDispatch } from "react-redux";
import { fetchRoles } from "@/store/roles";
import ColorDemo from "./ColorDemo";

const NewRole = () => {
  const [role, setRole] = useState({
    name: "",
    color: "",
  });

  const dispatch = useDispatch();
  const onNameChange = (e) => {
    setRole((p) => ({ ...p, name: e.target.value }));
  };

  const onSave = async () => {
    if (!role.name.trim()) {
      return sendToast({
        variant: "destructive",
        title: "Role name should not be empty",
      });
    } else if (!role.color.trim()) {
      return sendToast({
        variant: "destructive",
        title: "Role color should not be empty",
      });
    }
    try {
      const req = await axios.post(`${BACKEND_API_ROUTE}/roles`, {
        ...role,
      });
      dispatch(fetchRoles());
      sendToast({
        title: "Role Created",
        desc: `Role ${role.name} was successfully created`,
      });
    } catch (error) {
      return sendToast({
        variant: "destructive",
        title: "Something went wrong",
        desc: error.response.data.error || "Role not created",
      });
    }
  };
  return (
    <div className="text-[--primary-text-color] w-full">
      <InputField
        onChange={onNameChange}
        value={role.name}
        name={"name"}
        placeholder={"Role name"}
        label={"Role Name"}
        divClass={"gap-2"}
      />

      <section className="mt-8 flex flex-col gap-4">
        <div className="">
          <h5 className="font-[700]">Role Color</h5>
          <p className="text-[.7rem]">Choose a color for easy identification</p>
        </div>
        <ColorDemo setRole={setRole} />
      </section>
      <div className="w-[30%] mx-auto mt-16">
        <Button onSave={onSave} text={"Add Role"} className={"w-full"} />
      </div>
    </div>
  );
};

export default NewRole;
