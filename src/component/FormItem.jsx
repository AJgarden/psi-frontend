import React from "react";
import { Typography } from "antd";

const FormItem = ({
  required,
  align = "center",
  title,
  content,
  message,
  error,
}) => {
  return (
    <div style={{ display: "flex", alignItems: align }}>
      <div style={{ marginRight: 8, width: 80, textAlign: "right" }}>
        {required && (
          <Typography.Text type="danger" style={{ marginRight: 5 }}>
            *
          </Typography.Text>
        )}
        <Typography.Text>{title}</Typography.Text>
      </div>
      <div style={{ width: "calc(100% - 80px)", position: "relative" }}>
        {content}
        {error && (
          <span
            style={{
              color: "red",
              position: "absolute",
              width: "100%",
              left: 0,
              top: "100%",
              fontSize: "12px",
            }}
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
};
export default FormItem;
