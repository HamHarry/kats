import { useCallback, useEffect, useState } from "react";
import "./EmployeeAdminPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { EmployeeData } from "../../model/employee.type";
import { useAppDispatch } from "../../stores/store";
import {
  deleteEmployeeById,
  getAllEmployeePaginations,
} from "../../stores/slices/employeeSlice";
import CircleLoading from "../../shared/circleLoading";
import { Modal } from "antd";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";

const EmployeeAdminPage = () => {
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [selectEmployeeById, setSelectEmployeeById] = useState<string>();
  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] =
    useState<boolean>(false);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  i18n.changeLanguage(lang);

  const fetchAllEmployee = useCallback(async () => {
    try {
      setIsEmployeeLoading(true);

      const query = {
        term: searchTerm,
      };

      const { data: employeesRes = [] } = await dispath(
        getAllEmployeePaginations(query)
      ).unwrap();

      setEmployeeData(employeesRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsEmployeeLoading(false);
    }
  }, [dispath, searchTerm]);

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

  const handleSetSearchTerm = debounce((value) => {
    setSearchTerm(value);
  }, 500);

  const rederDialogConfirmDelete = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogDelete"
        open={openDialogConfirmDelete}
        onCancel={() => setOpenDialogConfirmDelete(false)}
      >
        <h1>{t("ยืนยันการลบ")}</h1>

        <div className="btn-DialogDelete-Navbar">
          <button
            type="button"
            onClick={() => {
              deleted();
              setOpenDialogConfirmDelete(false);
            }}
          >
            {t("ยืนยัน")}
          </button>
          <button
            onClick={() => {
              setOpenDialogConfirmDelete(false);
            }}
          >
            {t("ยกเลิก")}
          </button>
        </div>
      </Modal>
    );
  };

  return (
    <div className="container-employeeAdmin">
      <div className="header-employeeAdmin">
        <h1>{t("ข้อมูลพนักงาน")}</h1>
      </div>
      <div className="search-employee">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => handleSetSearchTerm(e.target.value)}
        />
        <button
          onClick={() => {
            navigate("/admin/employee/create");
          }}
        >
          {t("สร้าง")}
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
                      {t("ตำแหน่ง")}{" "}
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
                        onClick={() => {
                          if (item._id) {
                            navigate(`/admin/employee/edit/${item._id}`);
                          }
                        }}
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
                  <p>
                    {t("ชื่อ")}: {item.name}
                  </p>
                  <p>
                    {t("โทรศัพท์")}: {item.tel}
                  </p>
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
