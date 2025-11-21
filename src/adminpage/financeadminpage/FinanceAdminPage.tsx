import "./FinanceAdminPage.css";
const FinanceAdminPage = () => {
  return (
    <div className="container-financeAdmin">
      <div className="header-financeAdmin">
        <h1>การเงิน</h1>
      </div>

      <div className="navbar-dashboard-finance">
        <div className="grid-dashboard">
          <div className="wrap-grid-revenues">สรุปค่าใช้จ่ายทั้งหมด</div>
        </div>

        <div className="grid-dashboard">
          <div className="wrap-grid-revenues">รายรับทั้งหมด</div>
        </div>

        <div className="grid-dashboard">
          <div className="wrap-grid-expenses">รายจ่ายทั้งหมด</div>
        </div>
      </div>
    </div>
  );
};

export default FinanceAdminPage;
