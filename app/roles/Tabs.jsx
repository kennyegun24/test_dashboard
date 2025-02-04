"use client";
import React from "react";
import { Tabs } from "antd";
import NewRole from "./_components/NewRole";
import Permissions from "./_components/Permissions";

const items = [
  {
    key: "1",
    label: "Add New",
    children: <NewRole />,
  },
  {
    key: "2",
    label: "Permissions",
    children: <Permissions />,
  },
];
const RolesTabs = () => {
  return (
    <>
      <Tabs
        defaultActiveKey="1"
        items={items}
        tabBarStyle={{
          position: "sticky",
          top: "4rem",
          background: "var(--background)",
          zIndex: 999,
          // width: "100%",
        }}
        indicator={{
          size: (origin) => origin - 10,
          align: "center",
        }}
      />
    </>
  );
};
export default RolesTabs;
