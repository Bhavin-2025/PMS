import React from "react";
import { DatePicker } from "antd";

const DueDatePicker = ({ onChange }) => {
  return (
    <DatePicker
      className="custom-date-select"
      onChange={onChange}
      needConfirm
    />
  );
};

export default DueDatePicker;
