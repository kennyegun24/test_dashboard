"use client";
import { Cloud } from "lucide-react";
import { useState } from "react";

const ImageField = ({ label, placeholder, id }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  return (
    <div className="flex flex-col gap-2 my-4">
      <span className="text-[.8rem] font-[600]">{label}</span>
      <label className="flex gap-3 items-stretch" htmlFor={id}>
        <div className="flex items-center border border-dashed border-[--btn_background] px-4 py-[0.2rem] rounded-sm w-[50%] md:w-[40%] flex-col">
          <Cloud size={14} />
          <span className="text-[0.7rem]">{placeholder}</span>
        </div>
        <button className="text-[#fff] text-[0.7rem] bg-[--btn_background] px-6 w-[25%] md:w-[15%] rounded-[6px] flex items-center justify-center">
          Upload
        </button>
      </label>
      <div>
        {selectedImage && (
          <>
            <div className={""}>
              <img
                src={selectedImage && URL.createObjectURL(selectedImage)}
                height={75}
                width={75}
                alt="selected image"
                className={"h-[50px] w-[50px] object-cover"}
              />
            </div>
          </>
        )}
      </div>

      <input
        hidden
        className="hidden"
        type="file"
        name=""
        accept="image/*"
        id={id}
        onChange={(e) => setSelectedImage(e.target.files[0])}
      />
    </div>
  );
};

export default ImageField;
