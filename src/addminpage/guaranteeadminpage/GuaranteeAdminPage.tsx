import { useState } from "react";
import "./GuaranteeAdminPage.css";
import { guarantee } from "../../data/MockUpGuarantee";

export interface Guarantees {
  number: string;
  volume: string;
  date: string;
  time: string;
  name: string;
  carType: string;
  carModel: string;
  register: string;
  product: string;
  tel: string;
  image?: string;
}

const GuaranteeAdminPage = () => {
  const [guaranteeData, setfirstGuaranteeData] =
    useState<Guarantees[]>(guarantee);
  const [guaranteeDataRef] = useState(guaranteeData);
  const [openDialogGuarantee, setOpenDialogGuarantee] =
    useState<boolean>(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const newValue = guaranteeDataRef.filter((item) => {
      const valueName = item.name.toLowerCase().includes(value);
      const valueTel = item.tel.toLowerCase().includes(value);
      const valueNumber = item.number.toLowerCase().includes(value);
      const valueVolumer = item.volume.toLowerCase().includes(value);
      return (
        valueName || valueTel || valueNumber || valueVolumer || valueVolumer
      );
    });
    setfirstGuaranteeData(newValue);
  };

  const renderEditGuarantee = () => {
    return (
      <dialog open={openDialogGuarantee}>
        <div className="container-DialogEdit">
          <div className="wrap-container-DialogEdit">
            <div className="container-DialogEdit-Navbar">
              <i
                className="fa-solid fa-circle-xmark"
                onClick={() => {
                  setOpenDialogGuarantee(!openDialogGuarantee);
                }}
              ></i>
            </div>
            <div className=""></div>
          </div>
        </div>
      </dialog>
    );
  };

  return (
    <div className="container-guaranteeAdmin">
      <div className="header-guaranteeAdmin">
        <h1>Guarantee</h1>
      </div>
      <div className="search-guaranteeAdmin">
        <input
          type="text"
          placeholder="Search...(Name,Phone,Number,Volumer)"
          onChange={handleSearch}
        />
        <button>Search</button>
      </div>
      <div className="wrap-container-guaranteeAdmin">
        {guaranteeData.map((item, index) => {
          return (
            <div key={index} className="grid-guaranteeAdmin">
              <div className="guaranteeAdmin-image">
                <img src="/public/assets/logokats.jpg" alt="Image" />
              </div>
              <div className="guaranteeAdmin-content">
                <div className="text-p">
                  <p>วันที่: {item.date}</p>
                  <div className="icon">
                    <i
                      className="fa-solid fa-plus"
                      onClick={() => {
                        setOpenDialogGuarantee(!openDialogGuarantee);
                      }}
                    ></i>
                    <i className="fa-solid fa-pen-to-square"></i>
                    <i className="fa-solid fa-trash-can"></i>
                  </div>
                </div>
                <p>ชื่อ: {item.name}</p>
                <p>เบอร์: {item.tel}</p>
                <p>เลขที่: {item.number}</p>
                <p>เล่มที่: {item.volume}</p>
                <p>สินค้า: {item.product}</p>
                <p>
                  รถ: {item.carType} {item.carModel}
                </p>
                <p>ทะเบียน: {item.register}</p>
              </div>
            </div>
          );
        })}
      </div>
      {renderEditGuarantee()}
    </div>
  );
};

export default GuaranteeAdminPage;
