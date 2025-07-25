import { Cloud } from "lucide-react";

const DocumentField = ({
  label,
  placeholder,
  id,
  blogDetails,
  setBlogDetails,
}) => {
  const onChange = (e) => {
    const convertToArray = Array.from(e.target.files);
    setBlogDetails((prev) => ({ ...prev, docs: e.target.files[0] }));
  };
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
        {blogDetails?.docs && (
          <div>
            {/* {blogDetails?.docs.map((e, _) => (
              <p key={_} className="text-[--btn_background] text-[0.7rem]">
                {e.name}
              </p>
            ))} */}
            <p className="text-[--btn_background] text-[0.7rem]">
              {blogDetails.docs.name}
            </p>
          </div>
        )}
      </div>

      <input
        hidden
        className="hidden"
        type="file"
        name=""
        accept=".pdf, .docx, .xlsx, .doc, .xls"
        multiple
        id={id}
        onChange={(e) => onChange(e)}
      />
    </div>
  );
};

export default DocumentField;
