import { ColorPicker, Space } from "antd";
import React from "react";

const ColorDemo = ({ setRole }) => (
  <Space
    direction="vertical"
    style={{ color: "var(--primary-text-color)" }}
    styles={{ color: "var(--primary-text-color)" }}
  >
    <ColorPicker
      onChangeComplete={(e) =>
        setRole((p) => ({ ...p, color: e.toHexString() }))
      }
      defaultValue="#1677ff"
      size="large"
      showText={(c) => (
        <p className="text-[--primary-text-color] text-sm">{c.toHexString()}</p>
      )}
      // className="z-[999999]"
      style={{
        background: "var(--foreground)",
        color: "var(--primary-text-color)",
        border: "none",
        fontWeight: 600,
      }}
    />
  </Space>
);

export default ColorDemo;
