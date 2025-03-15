import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React from "react";

type CircleLoadingProps = {
  open: boolean;
};

const CircleLoading: React.FC<CircleLoadingProps> = ({ open }) => {
  if (!open) return <></>;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: 9999,
      }}
    >
      <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
    </div>
  );
};

export default CircleLoading;
