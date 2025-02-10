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
  const [dialogData, setDialogData] = useState<Guarantees>();

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
            <div className="card-user">
              <div className="card-imageCar">
                <img src="/public/assets/logokats.jpg" alt="" />
              </div>
              <div className="card-profile">
                <div className="wrap-card-profile">
                  <div className="text-column-number">
                    <div className="text-number">
                      <h4>เลขที่</h4>
                      <p>{dialogData?.number}</p>
                    </div>
                    <div className="text-branch">
                      <h4>สาขา</h4>
                      <p>ลาดกระบัง</p>
                    </div>
                  </div>
                  <div className="text-column-volume">
                    <div className="text-volume">
                      <h4>เล่มที่</h4>
                      <p>{dialogData?.volume}</p>
                    </div>
                    <div className="text-guadrantee">
                      <h4>สินค้ารับประกัน</h4>
                      <p>{dialogData?.product}</p>
                    </div>
                  </div>
                  <div className="text-date">
                    <h4>วันที่</h4>
                    <p>{dialogData?.date}</p>
                  </div>
                  <div className="text-name">
                    <h4>ชื่อ</h4>
                    <p>{dialogData?.name}</p>
                  </div>
                  <div className="text-tel">
                    <h4>เบอร์</h4>
                    <p>{dialogData?.tel}</p>
                  </div>
                  <div className="text-guadrantee">
                    <h4>รถยนต์</h4>
                    <p>
                      {dialogData?.carType} {dialogData?.carModel}
                    </p>
                  </div>
                  <div className="text-register">
                    <h4>ทะเบียน</h4>
                    <p>{dialogData?.register}</p>
                  </div>
                </div>
                <hr />
                <div className="guarante-date"></div>
              </div>
            </div>
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
                      className="fa-solid fa-pen-to-square"
                      onClick={() => {
                        setOpenDialogGuarantee(!openDialogGuarantee);
                        setDialogData(item);
                      }}
                    ></i>
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
