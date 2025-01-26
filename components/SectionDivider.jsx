import React from "react";

const SectionDivider = ({ text }) => {
  return (
    <div className="mt-6 mb-3">
      <h4 className="text-[.95rem] font-[700]">{text}</h4>
      <hr className="m-0 border-[--secondary-border-color]" />
    </div>
  );
};

export default SectionDivider;
