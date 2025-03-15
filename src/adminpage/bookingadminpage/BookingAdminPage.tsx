import { useState } from "react";
import "./BookingAdminPage.css";
import { guarantee } from "../../data/MockUpGuarantee";
import { useNavigate } from "react-router-dom";
import { Guarantees } from "../../model/guarantee.type";
import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  CreditCardFilled,
} from "@ant-design/icons";
import { ProductType } from "../../model/product.type";

const BookingAdminPage = () => {
  const [guaranteeData, setGuaranteeData] = useState<Guarantees[]>(guarantee);
  const [guaranteeDataRef] = useState(guaranteeData);
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const [selectedVolumer, setSelectedVolumer] = useState<string>("All");
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    console.log(value);

    const newValue = guaranteeDataRef.filter((item) => {
      const statusVolume =
        item.volume === selectedVolumer || selectedVolumer === "All";
      const valueName = item.name.toLowerCase().includes(value);
      const valueTel = item.tel.toLowerCase().includes(value);
      const valueNumber = item.number.toLowerCase().includes(value);
      return statusVolume && (valueName || valueTel || valueNumber);
    });
    setGuaranteeData(newValue);
    setSearchValue(value);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    if (selectedValue === "All") {
      const newlist = guaranteeDataRef.filter((item) => {
        const searchNumber = item.number.toLowerCase().includes(searchValue);
        const searchTel = item.tel.toLowerCase().includes(searchValue);
        const searchName = item.name.toLowerCase().includes(searchValue);
        return searchNumber || searchTel || searchName;
      });
      setGuaranteeData(newlist);
      setSelectedVolumer("All");
    } else if (selectedValue === "001") {
      const newlist = guaranteeDataRef.filter((item) => {
        const searchNumber = item.number.toLowerCase().includes(searchValue);
        const searchTel = item.tel.toLowerCase().includes(searchValue);
        const searchName = item.name.toLowerCase().includes(searchValue);
        return (
          item.volume === "001" && (searchNumber || searchTel || searchName)
        );
      });
      setGuaranteeData(newlist);
      setSelectedVolumer("001");
    } else if (selectedValue === "002") {
      const newlist = guaranteeDataRef.filter((item) => {
        const searchNumber = item.number.toLowerCase().includes(searchValue);
        const searchTel = item.tel.toLowerCase().includes(searchValue);
        const searchName = item.name.toLowerCase().includes(searchValue);
        return (
          item.volume === "002" && (searchNumber || searchTel || searchName)
        );
      });
      setGuaranteeData(newlist);
      setSelectedVolumer("002");
    } else if (selectedValue === "003") {
      const newlist = guaranteeDataRef.filter((item) => {
        const searchNumber = item.number.toLowerCase().includes(searchValue);
        const searchTel = item.tel.toLowerCase().includes(searchValue);
        const searchName = item.name.toLowerCase().includes(searchValue);
        return (
          item.volume === "003" && (searchNumber || searchTel || searchName)
        );
      });
      setGuaranteeData(newlist);
      setSelectedVolumer("003");
    }
  };

  const selectMenu = () => {
    return (
      <div className="btn-menu">
        <select onChange={handleSelectChange}>
          <option value={"All"}>All</option>
          <option value={"001"}>001</option>
          <option value={"002"}>002</option>
          <option value={"003"}>003</option>
        </select>
      </div>
    );
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
    <div className="container-BookingAdmin">
      <div className="header-BookingAdmin">
        <h1>Booking</h1>
      </div>
      <div className="search-BookingAdmin">
        <div>{selectMenu()}</div>
        <div className="search-content-right">
          <input
            type="text"
            placeholder="Search...(Name,Phone,Number,Volumer)"
            onChange={handleSearch}
          />
          <button
            className="btn-crate"
            type="button"
            onClick={() => navigate("/admin/booking/create")}
          >
            สร้าง
          </button>
        </div>
      </div>
      <div className="wrap-container-BookingAdmin">
        {guaranteeData.map((item, index) => {
          const productType = item.product.productType;

          return (
            <div
              key={index}
              className="grid-BookingAdmin"
              style={{
                backgroundColor:
                  productType === ProductType.GUN ? "#043829" : "#2656A2",
              }}
            >
              <div className="BookingAdmin-image">
                <img src={item.image} alt="Image" />
              </div>
              <div className="BookingAdmin-content">
                <div className="text-p">
                  <p>วันที่: {item.bookDate}</p>
                  <div className="icon">
                    {item.status === 0 ? (
                      <ClockCircleFilled className="icon-check-wait" />
                    ) : item.status === 1 ? (
                      <i className="fa-solid fa-circle"></i>
                    ) : item.status === 2 ? (
                      <CheckCircleFilled className="icon-check-complete" />
                    ) : (
                      <CloseCircleFilled className="icon-check-cancel" />
                    )}
                    <i
                      className="fa-solid fa-pen-to-square"
                      onClick={() => {
                        if (item._id) {
                          navigate(`/admin/booking/edit/${item._id}`);
                        }
                      }}
                    ></i>
                    <i
                      className="fa-solid fa-trash-can"
                      onClick={() => {
                        setOpenDialogConfirm(!openDialogConfirm);
                      }}
                    ></i>
                  </div>
                </div>
                <p>ชื่อ: {item.name}</p>
                <p>เบอร์: {item.tel}</p>
                <p>เลขที่: {item.number}</p>
                <p>เล่มที่: {item.volume}</p>
                <p>
                  สินค้า: {item.product.name} {item.price}
                </p>
                <p>
                  รถ: {item.carType} {item.carModel}
                </p>
                <p>ทะเบียน: {item.register}</p>
              </div>
            </div>
          );
        })}
      </div>
      {rederDialogConfirm()}
    </div>
  );
};
export default BookingAdminPage;
