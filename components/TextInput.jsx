import { cn } from "@/lib/utils";

const InputField = ({
  label,
  placeholder,
  onChange,
  divClass,
  name,
  className,
  value,
  type = "text",
  disabled,
}) => {
  return (
    <div className={cn("flex flex-col gap-1 mb-4", divClass)}>
      <label htmlFor="" className="text-[.8rem] font-[600]">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id=""
        className={cn(
          "bg-transparent md:w-[80%] text-[.8rem] border border-[--border-color] px-4 py-2 rounded-[6px]",
          className
        )}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default InputField;
