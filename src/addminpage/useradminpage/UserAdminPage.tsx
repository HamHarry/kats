import { useState } from "react";
import "./UserAdminPage.css";
import { CloseCircleFilled } from "@ant-design/icons";
import { employeeTest } from "../../data/MockUpEmployees";

export interface Employees {
  id?: string;
  position: string;
  name: string;
  phone: string;
  image: string;
}

const UserAdminPage = () => {
  const [userData, setUserData] = useState<Employees[]>(employeeTest);
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const [userDataRef] = useState(userData);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const newValue = userDataRef.filter((item) => {
      const valueUsername = item.position.toLowerCase().includes(value);
      const valueName = item.name.toLowerCase().includes(value);
      const valuePhone = item.phone.toLowerCase().includes(value);
      return valueUsername || valueName || valuePhone;
    });
    setUserData(newValue);
  };

  const rederDialogConfirm = () => {
    return (
      <dialog open={openDialogConfirm}>
        <div className="container-DialogConfirm">
          <div className="wrap-container-DialogConfirm">
            <div className="container-DialogConfirm-Navbar">
              <CloseCircleFilled
                className="icon-close"
                onClick={() => {
                  setOpenDialogConfirm(false);
                }}
              />
            </div>
            <h1>ยืนยันการลบ</h1>
            <div className="btn-DialogConfirm-Navbar">
              <button
                type="submit"
                className="btn-submit-dialogConfirm"
                onClick={() => {
                  setOpenDialogConfirm(false);
                }}
              >
                ยืนยัน
              </button>
              <button className="btn-edit-dialogConfirm">ยกเลิก</button>
            </div>
          </div>
        </div>
      </dialog>
    );
  };

  return (
    <div className="container-employeeAdmin">
      <div className="header-employeeAdmin">
        <h1>Employee</h1>
      </div>
      <div className="search-employee">
        <input type="text" placeholder="Search..." onChange={handleSearch} />
        <button>สร้าง</button>
      </div>
      <div className="wrap-container-employeeAdmin">
        {userData.map((item, index) => {
          return (
            <div key={index} className="grid-employee">
              <div className="employee-content">
                <div className="text-p">
                  <p>ตำแหน่ง: {item.position}</p>
                  <div className="icon">
                    <i className="fa-solid fa-pen-to-square"></i>
                    <i
                      className="fa-solid fa-trash-can"
                      onClick={() => {
                        setOpenDialogConfirm(true);
                      }}
                    ></i>
                  </div>
                </div>
                <p>ชื่อ: {item.name}</p>
                <p>โทรศัพท์: {item.phone}</p>
              </div>
            </div>
          );
        })}
      </div>
      {rederDialogConfirm()}
    </div>
  );
};

export default UserAdminPage;
