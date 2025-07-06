"use client";
import React from "react";
import { Empty } from "antd";
const EmptyComponent = () => (
  <Empty
    description="No record found"
    className="fill-[red]"
    image={Empty.PRESENTED_IMAGE_SIMPLE}
  />
);
export default EmptyComponent;
