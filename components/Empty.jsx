"use client";
import React from "react";
import { Empty } from "antd";
const EmptyComponent = () => (
  <Empty description="No record found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
);
export default EmptyComponent;
