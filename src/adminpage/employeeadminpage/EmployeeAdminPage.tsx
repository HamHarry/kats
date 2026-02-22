import { useCallback, useEffect, useState } from "react";
import "./EmployeeAdminPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { EmployeeData } from "../../model/employee.type";
import { useAppDispatch } from "../../stores/store";
import {
  getAllEmployeePaginations,
  isDeleteEmployeeById,
} from "../../stores/slices/employeeSlice";
import CircleLoading from "../../shared/circleLoading";
import { Modal, Tooltip } from "antd";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  employeeDataSelector,
  userInfoSelector,
} from "../../stores/slices/authSlice";
import { getImagePath } from "../../shared/utils/common";
import { DeleteStatus } from "../../model/delete.type";

const EmployeeAdminPage = () => {
  const myEmployeeData = useSelector(employeeDataSelector);
  const userInfo = useSelector(userInfoSelector);

  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [selectEmployeeById, setSelectEmployeeById] = useState<EmployeeData>();
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

      const query = { term: searchTerm };

      const { data: employeesRes = [] } = await dispath(
        getAllEmployeePaginations(query),
      ).unwrap();

      const filteredemployees = employeesRes.filter((item: EmployeeData) => {
        return item.delete === DeleteStatus.ISNOTDELETE;
      });

      setEmployeeData(filteredemployees);
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
      setIsEmployeeLoading(true);
      if (!selectEmployeeById?._id) return;

      const data: EmployeeData = {
        ...selectEmployeeById,
        delete: DeleteStatus.ISDELETE,
      };

      await dispath(isDeleteEmployeeById(data)).unwrap();

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

  return (
    <div className="container-employeeAdmin">
      {/* Header */}
      <div className="header-employeeAdmin">
        <h1>{t("ข้อมูลพนักงาน")}</h1>
      </div>

      {/* Search Bar */}
      <div className="search-employee">
        <input
          type="text"
          placeholder="Search… (Name, Phone)"
          onChange={(e) => handleSetSearchTerm(e.target.value)}
        />
        <button
          type="button"
          onClick={() => navigate("/admin/employee/create")}
        >
          + {t("สร้าง")}
        </button>
      </div>

      {/* Card Grid */}
      <div className="wrap-container-employeeAdmin">
        {employeeData.length === 0 && !isEmployeeLoading && (
          <div className="employee-empty">
            <svg
              width="48"
              height="48"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p>ไม่มีข้อมูลพนักงาน</p>
          </div>
        )}

        {employeeData.map((item, index) => (
          <div key={index} className="grid-employee">
            {/* Card Header */}
            <div className="employee-card-header">
              <div className="employee-avatar">
                <img
                  src={getImagePath("profile", userInfo?.dbname, item?.image)}
                  alt="profile"
                />
              </div>

              <div className="employee-header-meta">
                <p className="employee-name">
                  {item.firstName} {item.lastName}
                </p>
                <p className="employee-role">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {item.employmentInfo?.role?.name ?? "—"}
                </p>
              </div>

              <span className="role-badge">
                {item.employmentInfo?.role?.name ?? t("พนักงาน")}
              </span>
            </div>

            {/* Card Body */}
            <div className="employee-card-body">
              <div className="employee-info-grid">
                <div className="employee-info-item">
                  <span className="employee-info-label">{t("ชื่อ")}</span>
                  <span className="employee-info-value">
                    {item.firstName} {item.lastName}
                  </span>
                </div>
                <div className="employee-info-item">
                  <span className="employee-info-label">{t("โทรศัพท์")}</span>
                  <span className="employee-info-value">{item.tel ?? "—"}</span>
                </div>
                <div className="employee-info-item full">
                  <span className="employee-info-label">{t("ตำแหน่ง")}</span>
                  <span className="employee-info-value">
                    {item.employmentInfo?.role?.name ?? "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="employee-card-footer">
              <Tooltip title="แก้ไขข้อมูล">
                <button
                  className="icon-btn-employee edit"
                  onClick={() => {
                    if (item._id) {
                      navigate(`/admin/employee/edit/${item._id}`);
                    }
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </Tooltip>

              {myEmployeeData?._id !== item._id && (
                <Tooltip title="ลบข้อมูล">
                  <button
                    className="icon-btn-employee delete"
                    onClick={() => {
                      setOpenDialogConfirmDelete(true);
                      setSelectEmployeeById(item);
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Delete Dialog */}
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
          <button onClick={() => setOpenDialogConfirmDelete(false)}>
            {t("ยกเลิก")}
          </button>
        </div>
      </Modal>

      <CircleLoading open={isEmployeeLoading} />
    </div>
  );
};

export default EmployeeAdminPage;
