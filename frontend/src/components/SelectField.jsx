import React from "react";
import { Select, Space } from "antd";

/**
 * Generic SelectField Component
 *
 * Props:
 * - options (array) : [{label, value, emoji?, desc?}]
 * - placeholder (string) : Placeholder text
 * - mode (string) : "multiple", "tags", or undefined
 * - value (array|string) : Controlled value from parent
 * - onChange (function) : Callback when value changes
 * - showExtra (boolean) : Show emoji/desc or just label
 */
const SelectField = ({
  options = [],
  placeholder = "Select option",
  mode,
  value,
  onChange,
}) => {
  return (
    <Select
      className="custom-select"
      mode={mode}
      style={{ width: "100%" }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      options={options}
      optionRender={(option) => <Space>{option.data.label}</Space>}
    />
  );
};

export default SelectField;
