import { useNavigate } from "react-router-dom";
import "./WithdrawAdminPage.css";
import { Button, Dropdown, Space, Table, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import CircleLoading from "../../shared/circleLoading";
import { useAppDispatch } from "../../stores/store";
import { getAllExpenses } from "../../stores/slices/expenseSlice";
import { EmployeeData } from "../../model/employee.type";
import { CategoryDetail } from "../../model/finance.type";
import dayjs from "dayjs";

const WithdrawAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const [withdrawData, setWithdrawData] = useState([]);
  const [isExpenseLoading, setIsExpenseLoading] = useState<boolean>(false);

  const fetchAllExpense = useCallback(async () => {
    try {
      setIsExpenseLoading(true);
      const { data: ExpensesRes = [] } = await dispath(
        getAllExpenses()
      ).unwrap();

      console.log(ExpensesRes);

      setWithdrawData(ExpensesRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsExpenseLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllExpense();
  }, [fetchAllExpense]);

  const columns = [
    { title: "เลขที่", dataIndex: "number", key: "number" },
    {
      title: "ผู้สร้างเอกสาร",
      dataIndex: "employee",
      key: "employee",
      render: (employee: EmployeeData) => {
        return <Typography>{employee.name}</Typography>;
      },
    },
    { title: "หัวข้อ", dataIndex: "ownerName", key: "ownerName" },
    {
      title: "หมวดหมู่",
      dataIndex: "section",
      key: "section",
      render: (section: number) => {
        return (
          <Typography>
            {section === 0 ? "ค่าใช้จ่าย" : "เบิกเงินเดือน"}
          </Typography>
        );
      },
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "date",
      key: "date",
      render: (date: string) => {
        const formattedDate = date ? dayjs(date).format("DD/MM/YYYY") : "-";
        return <Typography>{formattedDate}</Typography>;
      },
    },
    { title: "วันที่ชำระเงิน", dataIndex: "datePrice", key: "datePrice" },
    {
      title: "รวมยอดค่าใช้จ่าย",
      dataIndex: "categorys",
      key: "categorys",
      render: (categorys: CategoryDetail[]) => {
        const total = categorys.reduce((prev, item) => {
          return prev + item.amount;
        }, 0);

        return <Typography>{total}</Typography>;
      },
    },
  ];

  const handleMenuClick = (item: any) => {
    if (!item) return;

    if (item.key === "createWithdraw") {
      return navigate(`/admin/withdraw/${item.key}`);
    } else {
      navigate(`/admin/salary/${item.key}`);
    }
  };

  const items = [
    {
      label: "สร้างค่าใช้จ่าย",
      key: "createWithdraw",
    },
    {
      label: "เบิกเงินเดือน",
      key: "createSalaryAdvance",
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <div className="container-WithdrawAdminPage">
      <div className="header-WithdrawAdminPage">
        <h1>Withdraw & Salary</h1>
      </div>

      <div className="create-withdraw">
        <div className="btn-create-withdraw">
          <Dropdown menu={menuProps}>
            <Button>
              <Space>
                สร้าง
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
      </div>

      <div className="withdraw-content" style={{ width: "100%" }}>
        <Table
          dataSource={withdrawData}
          columns={columns}
          style={{
            border: "2px solid #2656a2",
            borderRadius: "10px",
          }}
        />
      </div>

      <CircleLoading open={isExpenseLoading} />
    </div>
  );
};

export default WithdrawAdminPage;
