import React from "react";
import "./style.css";

const RequestLoader = () => {
  return (
    <div className="h-[100vh] w-full flex justify-center fixed z-[999999] top-0 left-0 w-full bg-[--black-transparent-bg-light2] items-center">
      <div className="apinner_loader"></div>
    </div>
  );
};

export default RequestLoader;
