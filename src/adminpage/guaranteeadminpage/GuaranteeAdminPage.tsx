import { useCallback, useEffect, useState } from "react";
import "./GuaranteeAdminPage.css";
import { BookingStatus, BookingData } from "../../model/booking.type";
import { ProductType } from "../../model/product.type";
import { useAppDispatch } from "../../stores/store";
import CircleLoading from "../../shared/circleLoading";
import {
  deleteBookingById,
  getAllBookings,
} from "../../stores/slices/bookingSlice";
import dayjs from "dayjs";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

const GuaranteeAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();

  const [guaranteeData, setGuaranteeData] = useState<BookingData[]>([]);
  const [userData, setUserData] = useState<BookingData>();
  const [openDialogProfile, setOpenDialogProfile] = useState<boolean>(false);
  const [openDialogDelete, setOpenDialogDelete] = useState<boolean>(false);
  const [isGuaranteeLoading, setIsGuaranteeLoading] = useState<boolean>(false);
  const [selectGuaranteeById, setSelectGuaranteeById] = useState<string>();

  const fetchAllBooking = useCallback(async () => {
    try {
      setIsGuaranteeLoading(true);
      const { data: bookingsRes = [] } = await dispath(
        getAllBookings()
      ).unwrap();

      const finedData = bookingsRes.filter((item: any) => {
        return item.status === BookingStatus.COMPLETED;
      });

      setGuaranteeData(finedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGuaranteeLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllBooking();
  }, [fetchAllBooking]);

  const selectMenu = () => {
    return (
      <div className="btn-menu">
        <select>
          <option value={"All"}>All</option>
          <option value={"001"}>001</option>
          <option value={"002"}>002</option>
          <option value={"003"}>003</option>
        </select>
        <select>
          <option value={"All"}>All</option>
          <option value={"KATS Coating"}>KATS</option>
          <option value={"GUN"}>GUN</option>
        </select>
      </div>
    );
  };

  const deleted = async () => {
    try {
      if (!selectGuaranteeById) return;

      setIsGuaranteeLoading(true);
      await dispath(deleteBookingById(selectGuaranteeById)).unwrap();

      setOpenDialogDelete(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGuaranteeLoading(false);
      fetchAllBooking();
    }
  };

  const rederDialogDelete = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogConfirm"
        open={openDialogDelete}
        onCancel={() => setOpenDialogDelete(false)}
      >
        <h1>ยืนยันการลบ</h1>

        <div className="btn-DialogConfirm-Navbar">
          <button
            onClick={() => {
              setOpenDialogDelete(false);
              deleted();
            }}
          >
            ยืนยัน
          </button>
          <button
            className="btn-edit-dialogConfirm"
            onClick={() => {
              setOpenDialogDelete(false);
            }}
          >
            ยกเลิก
          </button>
        </div>
      </Modal>
    );
  };

  const rederEditProfile = () => (
    <Modal
      centered
      className={
        userData?.product.name === "KATS Coating"
          ? "wrap-container-Edit-Profile-kats"
          : "wrap-container-Edit-Profile-gun"
      }
      open={openDialogProfile}
      onCancel={() => setOpenDialogProfile(false)}
    >
      <div className="container-Edit-Profile-Navbar">
        <button
          type="button"
          onClick={() => {
            setOpenDialogProfile(false);
          }}
        >
          <h3>บันทึก</h3>
        </button>
        <i
          className="fa-solid fa-circle-xmark"
          onClick={() => {
            setOpenDialogProfile(false);
          }}
        ></i>
      </div>
      <div className="content-Profile">
        <div className="card-profile">
          <div className="wrap-card-profile">
            <img src={userData?.image} alt="profile" />
            <div className="text-all">
              <div className="text-column-number">
                <div className="text-number">
                  <h4>เลขที่</h4>
                  <p>{userData?.number}</p>
                </div>
                <div className="text-branch">
                  <h4>สาขา</h4>
                  <p>ลาดกระบัง</p>
                </div>
              </div>
              <div className="text-column-volume">
                <div className="text-volume">
                  <h4>เล่มที่</h4>
                  <p>{userData?.receiptBookNo}</p>
                </div>
                <div className="guadrantee">
                  <div className="text-guadrantee-typeProduct">
                    <h4>ประกันสินค้า</h4>
                    <p>{userData?.product.name}</p>
                  </div>
                  <div className="text-guadrantee">
                    <p>{userData?.price.amount} บาท</p>
                  </div>
                </div>
              </div>
              <div className="text-column-date">
                <div className="text-date">
                  <h4>วันที่</h4>
                  <p>{dayjs(userData?.bookDate).format("DD/MM/YYYY")}</p>
                </div>
                <div className="text-car">
                  <h4>รถยนต์</h4>
                  <p>
                    {userData?.carType} {userData?.carModel}
                  </p>
                </div>
              </div>
              <div className="text-column-name">
                <div className="text-name">
                  <h4>ชื่อ</h4>
                  <p>คุณ{userData?.name}</p>
                </div>
                <div className="text-register">
                  <h4>ทะเบียน</h4>
                  <p>
                    {userData?.licensePlate} {userData?.province}
                  </p>
                </div>
              </div>
              <div className="text-tel">
                <h4>เบอร์</h4>
                <p>{userData?.tel}</p>
              </div>
            </div>
          </div>
          <hr />
          <div className="guarante-date">
            <table>
              <thead>
                <tr>
                  <th>ครั้งที่</th>
                  <th>วันที่เข้ารับบริการ</th>
                  <th>คาน</th>
                  <th>ซุ้มล้อ</th>
                  <th>ปีกนก</th>
                  <th>แชสซี่ส์</th>
                  <th>ใต้ท้อง</th>
                </tr>
              </thead>

              <tbody>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="container-guaranteeAdmin">
      <div className="header-guaranteeAdmin">
        <h1>Guarantees</h1>
      </div>
      <div className="search-guaranteeAdmin">
        <div>{selectMenu()}</div>
        <input type="text" placeholder="Search...(Name,Phone,Number,Volumer)" />
      </div>
      <div className="wrap-container-guaranteeAdmin">
        {guaranteeData.map((item, index) => {
          const productType = item.product.productType;

          const formattedDate = item.bookDate
            ? dayjs(item.bookDate).format("DD/MM/YYYY")
            : "-";
          return (
            <div
              key={index}
              className="grid-guaranteeAdmin"
              style={{
                backgroundColor:
                  productType === ProductType.GUN ? "#043829" : "#2656A2",
              }}
            >
              <div className="guaranteeAdmin-image">
                <img src={item.image} alt="" />
              </div>
              <div className="guaranteeAdmin-content">
                <div className="text-p">
                  <p>วันที่: {formattedDate}</p>
                  <div className="icon">
                    <i
                      className="fa-solid fa-square-check"
                      onClick={() => {
                        setOpenDialogProfile(true);
                        setUserData(item);
                      }}
                    ></i>
                    <i
                      className="fa-solid fa-pen-to-square"
                      onClick={() => {
                        navigate(`/admin/guarantee/edit/${item._id}`);
                      }}
                    ></i>
                    <i
                      className="fa-solid fa-trash-can"
                      onClick={() => {
                        setOpenDialogDelete(true);
                        setSelectGuaranteeById(item._id);
                      }}
                    ></i>
                  </div>
                </div>
                <p>ชื่อ: คุณ{item.name}</p>
                <p>เบอร์: {item.tel}</p>
                <p>เลขที่: {item.number}</p>
                <p>เล่มที่: {item.receiptBookNo}</p>
                <p>
                  สินค้า: {item.product.name} {item.price.amount}
                </p>
                <p>
                  รถ: {item.carType} {item.carModel}
                </p>
                <p>ทะเบียน: {item.licensePlate}</p>
              </div>
            </div>
          );
        })}
      </div>
      {rederEditProfile()}
      {rederDialogDelete()}
      <CircleLoading open={isGuaranteeLoading} />
    </div>
  );
};

export default GuaranteeAdminPage;
