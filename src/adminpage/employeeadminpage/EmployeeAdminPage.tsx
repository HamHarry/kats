import { useCallback, useEffect, useState } from "react";
import "./EmployeeAdminPage.css";
import { useNavigate } from "react-router-dom";
import { Employees } from "../../model/employee.type";
import { useAppDispatch } from "../../stores/store";
import {
  deleteEmployeeById,
  getAllEmployees,
} from "../../stores/slices/employeeSlice";
import CircleLoading from "../../shared/circleLoading";
import { Modal } from "antd";

const EmployeeAdminPage = () => {
  const [employeeData, setEmployeeData] = useState<Employees[]>([]);
  const [selectEmployeeById, setSelectEmployeeById] = useState<string>();
  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] =
    useState<boolean>(false);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState<boolean>(false);
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

  const deleted = async () => {
    try {
      console.log(selectEmployeeById);

      if (!selectEmployeeById) return;

      setIsEmployeeLoading(true);
      await dispath(deleteEmployeeById(selectEmployeeById)).unwrap();

      setOpenDialogConfirmDelete(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsEmployeeLoading(false);
      fetchAllEmployee();
    }
  };

  const rederDialogConfirmDelete = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogDelete"
        open={openDialogConfirmDelete}
        onCancel={() => setOpenDialogConfirmDelete(false)}
      >
        <h1>ยืนยันการลบ</h1>

        <div className="btn-DialogDelete-Navbar">
          <button
            type="button"
            onClick={() => {
              deleted();
              setOpenDialogConfirmDelete(false);
            }}
          >
            ยืนยัน
          </button>
          <button
            onClick={() => {
              setOpenDialogConfirmDelete(false);
            }}
          >
            ยกเลิก
          </button>
        </div>
      </Modal>
    );
  };

  return (
    <div className="container-employeeAdmin">
      <div className="header-employeeAdmin">
        <h1>Employees</h1>
      </div>
      <div className="search-employee">
        <input type="text" placeholder="Search..." />
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
                          setOpenDialogConfirmDelete(true);
                          setSelectEmployeeById(item._id);
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
      {rederDialogConfirmDelete()}
      <CircleLoading open={isEmployeeLoading} />
    </div>
  );
};

export default EmployeeAdminPage;
