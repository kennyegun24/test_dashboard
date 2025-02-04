"use client";
import { createContext, useEffect, useState } from "react";
import { ConfigProvider } from "antd";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("dark");
  const toggle = () => {
    let mod = mode === "dark" ? "light" : "dark";
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
    localStorage.setItem("akash_crm", mod);
  };

  // useEffect(() => {
  //   document.querySelector(":root").setAttribute("color-scheme", mode);
  // }, [mode]);

  // useEffect(() => {
  //   const theme = localStorage.getItem("akash_crm")
  //     ? localStorage.getItem("akash_crm")
  //     : "dark";
  //   setMode(theme);
  // }, []);

  return (
    <ThemeContext.Provider value={{ toggle, mode }}>
      <ConfigProvider
        theme={{
          token: {
            boxShadowSecondary: "var(--shadow)",
          },
          components: {
            Tabs: {
              cardBg: "var(--background)",
              // boxShadowSecondary: "0px 10px 60px 39px rgba(130,0,130,1)",
              cardHeight: 60,
              cardPadding: "4px 22px",
              borderRadius: "1px",
              borderRadiusLG: "4px",
              colorText: "var(--primary-text-color)",
              colorBorder: "transparent",
              colorBorderSecondary: "transparent",
              // boxShadow: "0px 10px 60px 39px rgba(130,0,130,1)",
              itemSelectedColor: "var(--opposite-text)",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              boxShadowSecondary:
                "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
              colorBgElevated: "red",
            },
            Table: {
              colorBgContainer: "var(--background)",
              headerColor: "var(--primary-text-color)",
              colorText: "var(--text-color)",
              rowHoverBg: "var(--foreground)",
              rowSelectedBg: "var(--foreground)",
              borderColor: "var(--secondary-border-color)",
              headerBg: "var(--foreground)",
              headerSortActiveBg: "var(--background)",
              fixedHeaderSortActiveBg: "var(--background)",
              headerSortHoverBg: "var(--background)",
              headerFilterHoverBg: "var(--background)",
              selectionColumnWidth: 75,
              controlHeight: 20,
              controlHeightLG: 20,
              controlHeightSM: 20,
              controlHeightXS: 20,
              cardHeight: 20,
              rowExpandedBg: "#000",
            },
            Calendar: {
              colorBgContainer: "var(--foreground)",
              itemActiveBg: "var(--background)",
              fullPanelBg: "red",
              colorText: "var(--text-color)",
              colorPrimary: "var(--text-color)",
              colorSplit: "var(--secondary-border-color)",
              controlItemBgActive: "red",
              monthControlWidth: 40,
              miniContentHeight: 0,
              // paddingSM: 0,
              // paddingMD: 0,
              // paddingLG: 0,
              paddingXS: 0,
              // paddingXXS: 0,
              // paddingXL: 0,
            },
            Select: {
              optionFontSize: 12,
              // controlHeight: 25,
            },
            DatePicker: {
              colorBgContainer: "var(--background)",
              colorTextPlaceholder: "var(--text-color)",
              colorText: "var(--primary-text-color)",
              colorBgElevated: "var(--foreground)",
              colorTextHeading: "var(--text-color)",
              controlItemBgActive: "var(--background)",
              colorIcon: "var(--text-color)",
            },
            Upload: {
              colorBorder: "var(--btn_background)",
            },
            Empty: {
              colorTextDescription: "var(--text-color)",
            },
            Tabs: {
              itemColor: "var(--primary-text-color)",
              colorBorderSecondary: "var(--primary-text-color)",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
// export default wrapper.useWrappedStore(ThemeProvider);
