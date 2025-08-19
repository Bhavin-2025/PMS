import React from "react";

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-base ">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="rounded-2xl p-3 border border-gray-200 w-[448px]"
      />
    </div>
  );
};

export default InputField;
