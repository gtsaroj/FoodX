import React from "react";
import { TimePicker as TimePick } from "antd";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "../../index.css";
dayjs.extend(customParseFormat);

interface TimePickerProps {
  onChange: (date: Dayjs, dateString: string | string[]) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ onChange }) => (
  <div className=" ">
    <TimePick
      onChange={onChange}
      defaultOpenValue={dayjs("00:00:00", "h:mm:ss A")}
    />
  </div>
);

export default TimePicker;
