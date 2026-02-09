import TextField from "@mui/material/TextField";
import { useState } from "react";

export default function UserIdPicker({ addUserId }) {
  const [value, setValue] = useState("");
  const submit = () => {
    addUserId(value);
    setValue("");
  };

  return (
    <TextField
      label="Add member by userId"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          submit();
        }
      }}
      fullWidth
    />
  );
}
