import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: "100px", textAlign: "center" }}>
      <Result
        status="404"
        title={<span style={{ fontSize: 42 }}>404</span>}
        subTitle={<span style={{ fontSize: 24 }}>ขออภัย หน้าที่คุณเยี่ยมชมไม่มีอยู่</span>}
        extra={
          <Button
            style={{ fontSize: 24, padding: "20px " }}
            type="primary"
            onClick={() => {
              navigate("/");
            }}
          >
            ย้อนกลับไปยังหน้าหลัก
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;
