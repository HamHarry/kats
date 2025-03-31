import { Controller, useForm } from "react-hook-form";
import "./CreateWithdrawAdminPage.css";
import { useNavigate } from "react-router-dom";
import { FinanceData, PaymentCategory } from "../../model/finance.type";

const initWithdrawForm: FinanceData = {
  number: 0,
  ownerName: "",
  category: "",
  date: "",
  datePrice: "",
  amount: 0,
  section: PaymentCategory.WITHDRAW,
  detel: "",
};

const CreateWithdrawAdminPage = () => {
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm({
    defaultValues: initWithdrawForm,
  });

  const onSubmit = async (value: FinanceData) => {
    const body = {
      ...value,
    };

    console.log(body);
  };

  return (
    <div className="container-CreateWithdrawAdminPage">
      <div className="header-CreateWithdrawAdminPage">
        <h1>Create Withdraw</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="btn-CreateWithdrawAdminPage">
          <button
            type="button"
            onClick={() => {
              navigate("/admin/withdraw");
            }}
          >
            ย้อนกลับ
          </button>
          <button
            type="submit"
            onClick={() => {
              navigate("/admin/withdraw");
            }}
          >
            ยืนยัน
          </button>
        </div>

        <div className="wrap-container-CreateWithdrawAdminPage">
          <div className="inputEmployee">
            <h2>พนักงาน</h2>
            <Controller
              control={control}
              name="ownerName"
              render={({ field }) => {
                return <input {...field} type="text" />;
              }}
            />
          </div>

          <div className="inputDetel">
            <h2>รายละเอียด</h2>
            <div className="input-owner-detel">
              <Controller
                control={control}
                name="ownerName"
                render={({ field }) => {
                  return (
                    <input {...field} type="text" placeholder="หัวข้อ..." />
                  );
                }}
              />

              <Controller
                control={control}
                name="detel"
                render={({ field }) => {
                  return (
                    <textarea
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      {...field}
                      placeholder="รายละเอียด..."
                    />
                  );
                }}
              />
            </div>
          </div>

          <div className="inputDate">
            <h2>วันที่สร้าง</h2>
            <Controller
              control={control}
              name="date"
              render={({ field }) => {
                return <input {...field} type="text" />;
              }}
            />
          </div>

          <div className="wrap-inputList">
            <h2>รายการ</h2>
            <div className="inputList">
              <Controller
                control={control}
                name="ownerName"
                render={({ field }) => {
                  return <input {...field} type="text" />;
                }}
              />

              <Controller
                control={control}
                name="ownerName"
                render={({ field }) => {
                  return <input {...field} type="text" />;
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateWithdrawAdminPage;
