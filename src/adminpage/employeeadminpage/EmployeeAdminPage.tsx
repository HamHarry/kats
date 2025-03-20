import { useCallback, useEffect, useState } from "react";
import "./EmployeeAdminPage.css";
import { CloseCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Employees } from "../../model/employee.type";
import { useAppDispatch } from "../../stores/store";
import { getAllEmployees } from "../../stores/slices/employeeSlice";
import CircleLoading from "../../shared/circleLoading";

const EmployeeAdminPage = () => {
  const [employeeData, setEmployeeData] = useState<Employees[]>([]);
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState<boolean>(false);
  const [userDataRef] = useState(employeeData);
  const navigate = useNavigate();
  const dispath = useAppDispatch();

  const fetchAllEmployee = useCallback(async () => {
    try {
      setIsEmployeeLoading(true);
      const { data: employeesRes = [] } = await dispath(
        getAllEmployees()
      ).unwrap();

      setEmployeeData(employeesRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsEmployeeLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllEmployee();
  }, [fetchAllEmployee]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const newValue = userDataRef.filter((item) => {
      const valueName = item.name.toLowerCase().includes(value);
      const valuePhone = item.tel.toLowerCase().includes(value);
      return valueName || valuePhone;
    });
    setEmployeeData(newValue);
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
        <h1>Employees</h1>
      </div>
      <div className="search-employee">
        <input type="text" placeholder="Search..." onChange={handleSearch} />
        <button
          onClick={() => {
            navigate("/admin/employee/create");
          }}
        >
          สร้าง
        </button>
      </div>
      <div className="wrap-container-employeeAdmin">
        {employeeData.map((item, index) => {
          return (
            <div key={index} className="grid-employee">
              <div className="employee-content">
                <img src={item.image} alt="profile" />
                <div className="wrap-employee-content">
                  <div className="text-p">
                    <p>
                      ตำแหน่ง:{" "}
                      {`${
                        item.staffRole === 0
                          ? "หัวหน้า"
                          : item.staffRole === 1
                          ? "ผู้ดูแลระบบ"
                          : item.staffRole === 2
                          ? "ช่างล้างรถ"
                          : "ช่างพ่นสี"
                      }`}
                    </p>
                    <div className="icon">
                      <i
                        className="fa-solid fa-pen-to-square"
                        // onClick={() => {
                        //   if (item._id) {
                        //     navigate(`/admin/employee/edit/${item._id}`);
                        //   }
                        // }}
                      ></i>
                      <i
                        className="fa-solid fa-trash-can"
                        onClick={() => {
                          setOpenDialogConfirm(true);
                        }}
                      ></i>
                    </div>
                  </div>
                  <p>ชื่อ: {item.name}</p>
                  <p>โทรศัพท์: {item.tel}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {rederDialogConfirm()}
      <CircleLoading open={isEmployeeLoading} />
    </div>
  );
};

export default EmployeeAdminPage;
