import { useState } from "react";
import "./GuaranteeAdminPage.css";
import { guarantee } from "../../data/MockUpGuarantee";
import { Controller, useForm } from "react-hook-form";

export interface Guarantees {
  number: string;
  volume: string;
  date: string;
  time: string;
  name: string;
  carType: string;
  carModel: string;
  register: string;
  typeProduct: string;
  price: string;
  tel: string;
  image: string;
}
const defaultValues: Guarantees = {
  number: "",
  volume: "",
  date: "",
  time: "",
  name: "",
  carType: "",
  carModel: "",
  register: "",
  typeProduct: "",
  price: "",
  tel: "",
  image: "/public/assets/logokats.jpg",
};

const GuaranteeAdminPage = () => {
  const [guaranteeData, setGuaranteeData] = useState<Guarantees[]>(guarantee);
  const [guaranteeDataRef] = useState(guaranteeData);
  const [openDialogProfile, setOpenDialogProfile] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<Guarantees>();
  const [updateData, setUpdateData] = useState<Guarantees>();
  const [selectedVolumer, setSelectedVolumer] = useState<string>("All");
  const [searchValue, setSearchValue] = useState("");

  const { handleSubmit, control } = useForm<Guarantees>({
    defaultValues,
  });

  const submitProfile = (value: Guarantees) => {
    try {
      const item = {
        ...value,
      };
      setUpdateData(item); // เก็บข็อมูลเพื่อยินยันการส่ง
    } catch (error) {
      console.log(error);
    }
  };
  console.log(updateData);

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

  const rederEditProfile = () => {
    return (
      <dialog open={openDialogProfile}>
        <div className="container-Edit-Profile">
          <div className="wrap-container-Edit-Profile">
            <form onSubmit={handleSubmit(submitProfile)}>
              <div className="container-Edit-Profile-Navbar">
                <button type="submit">
                  <h3>บันทึก</h3>
                </button>
                <i
                  className="fa-solid fa-circle-xmark"
                  onClick={() => {
                    setOpenDialogProfile(!openDialogProfile);
                  }}
                ></i>
              </div>
              <div className="content-Profile">
                <div className="card-profile">
                  <div className="wrap-card-profile">
                    <div className="text-column-number">
                      <div className="text-number">
                        <h4>เลขที่</h4>
                        <Controller
                          name="number"
                          control={control}
                          render={({ field }) => {
                            return (
                              <input
                                {...field}
                                type="text"
                                value={dialogData?.number}
                              />
                            );
                          }}
                        />
                      </div>
                      <div className="text-branch">
                        <h4>สาขา</h4>
                        <p>ลาดกระบัง</p>
                      </div>
                    </div>
                    <div className="text-column-volume">
                      <div className="text-volume">
                        <h4>เล่มที่</h4>
                        <Controller
                          name="volume"
                          control={control}
                          render={({ field }) => {
                            return (
                              <input
                                {...field}
                                type="text"
                                value={dialogData?.volume}
                              />
                            );
                          }}
                        />
                      </div>
                      <div className="guadrantee">
                        <div className="text-guadrantee-typeProduct">
                          <h4>ประกันสินค้า</h4>
                          <Controller
                            name="typeProduct"
                            control={control}
                            render={({ field }) => {
                              return (
                                <input
                                  {...field}
                                  type="text"
                                  value={dialogData?.typeProduct}
                                />
                              );
                            }}
                          />
                        </div>
                        <div className="text-guadrantee">
                          <Controller
                            name="price"
                            control={control}
                            render={({ field }) => {
                              return (
                                <input
                                  {...field}
                                  type="text"
                                  value={dialogData?.price}
                                />
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-column-date">
                      <div className="text-date">
                        <h4>วันที่</h4>
                        <Controller
                          name="date"
                          control={control}
                          render={({ field }) => {
                            return (
                              <input
                                {...field}
                                type="date"
                                value={dialogData?.date}
                              />
                            );
                          }}
                        />
                      </div>
                      <div className="text-car">
                        <h4>รถยนต์</h4>
                        <Controller
                          name="carType"
                          control={control}
                          render={({ field }) => {
                            return (
                              <input
                                {...field}
                                type="text"
                                value={dialogData?.carType}
                              />
                            );
                          }}
                        />
                        <Controller
                          name="carModel"
                          control={control}
                          render={({ field }) => {
                            return (
                              <input
                                {...field}
                                type="text"
                                value={dialogData?.carModel}
                              />
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-column-name">
                      <div className="text-name">
                        <h4>ชื่อ</h4>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => {
                            return (
                              <input
                                {...field}
                                type="text"
                                value={dialogData?.name}
                              />
                            );
                          }}
                        />
                      </div>
                      <div className="text-register">
                        <h4>ทะเบียน</h4>
                        <Controller
                          name="register"
                          control={control}
                          render={({ field }) => {
                            return (
                              <input
                                {...field}
                                type="text"
                                value={dialogData?.register}
                              />
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-tel">
                      <h4>เบอร์</h4>
                      <Controller
                        name="tel"
                        control={control}
                        render={({ field }) => {
                          return (
                            <input
                              {...field}
                              type="text"
                              value={dialogData?.tel}
                            />
                          );
                        }}
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="guarante-date">
                    <table>
                      <tr>
                        <th>ครั้งที่</th>
                        <th>วันที่เข้ารับบริการ</th>
                        <th>คาน</th>
                        <th>ซุ้มล้อ</th>
                        <th>ปีกนก</th>
                        <th>แชสซี่ส์</th>
                        <th>ใต้ท้อง</th>
                      </tr>
                      {[...Array(10)].map((_, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <input className="input-date" type="date" />
                          {[...Array(5)].map((_, index) => {
                            return (
                              <td key={index}>
                                <input className="checkbox" type="checkbox" />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </table>
                  </div>
                </div>
              </div>
            </form>
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
        <div>{selectMenu()}</div>
        <input
          type="text"
          placeholder="Search...(Name,Phone,Number,Volumer)"
          onChange={handleSearch}
        />
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
                        setOpenDialogProfile(!openDialogProfile);
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
                <p>
                  สินค้า:{item.typeProduct} {item.price}
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
      {rederEditProfile()}
    </div>
  );
};

export default GuaranteeAdminPage;
