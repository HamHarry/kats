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

const GuaranteeAdminPage = () => {
  const dispath = useAppDispatch();

  const [guaranteeData, setGuaranteeData] = useState<BookingData[]>([]);
  // const [openDialogProfile, setOpenDialogProfile] = useState<boolean>(false);
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
      // <dialog open={openDialogConfirm}>
      //   <div className="container-DialogConfirm">
      //     <div className="wrap-container-DialogConfirm">
      //       <div className="container-DialogConfirm-Navbar">
      //         <i
      //           className="fa-solid fa-circle-xmark"
      //           onClick={() => {
      //             setOpenDialogConfirm(false);
      //           }}
      //         ></i>
      //       </div>
      //       <h1>ยืนยันการลบ</h1>
      //       <div className="btn-DialogConfirm-Navbar">
      //         <button
      //           type="submit"
      //           className="btn-submit-dialogConfirm"
      //           onClick={() => {
      //             setOpenDialogConfirm(false);
      //           }}
      //         >
      //           ยืนยัน
      //         </button>
      //         <button
      //           className="btn-edit-dialogConfirm"
      //           onClick={() => {
      //             setOpenDialogConfirm(false);
      //           }}
      //         >
      //           ยกเลิก
      //         </button>
      //       </div>
      //     </div>
      //   </div>
      // </dialog>
    );
  };

  // const rederEditProfile = () => (
  //   <dialog open={openDialogProfile}>
  //     <div className="container-Edit-Profile">
  //       <div className="wrap-container-Edit-Profile">
  //         <form onSubmit={handleSubmit(submitProfile)}>
  //           <div className="container-Edit-Profile-Navbar">
  //             <button type="submit">
  //               <h3>บันทึก</h3>
  //             </button>
  //             <i
  //               className="fa-solid fa-circle-xmark"
  //               onClick={() => {
  //                 setOpenDialogProfile(!openDialogProfile);
  //               }}
  //             ></i>
  //           </div>
  //           <div className="content-Profile">
  //             <div className="card-profile">
  //               <div className="wrap-card-profile">
  //                 <img src={dialogData?.image} alt="profile" />
  //                 <div className="text-all">
  //                   <div className="text-column-number">
  //                     <div className="text-number">
  //                       <h4>เลขที่</h4>
  //                       <Controller
  //                         name="number"
  //                         control={control}
  //                         render={({ field }) => {
  //                           return (
  //                             <input
  //                               {...field}
  //                               type="text"
  //                               value={dialogData?.number}
  //                             />
  //                           );
  //                         }}
  //                       />
  //                     </div>
  //                     <div className="text-branch">
  //                       <h4>สาขา</h4>
  //                       <p>ลาดกระบัง</p>
  //                     </div>
  //                   </div>
  //                   <div className="text-column-volume">
  //                     <div className="text-volume">
  //                       <h4>เล่มที่</h4>
  //                       <Controller
  //                         name="receiptBookNo"
  //                         control={control}
  //                         render={({ field }) => {
  //                           return (
  //                             <input
  //                               {...field}
  //                               type="text"
  //                               value={dialogData?.receiptBookNo}
  //                             />
  //                           );
  //                         }}
  //                       />
  //                     </div>
  //                     <div className="guadrantee">
  //                       <div className="text-guadrantee-typeProduct">
  //                         <h4>ประกันสินค้า</h4>
  //                         <Controller
  //                           name="product._id"
  //                           control={control}
  //                           render={({ field }) => {
  //                             return (
  //                               <input
  //                                 {...field}
  //                                 type="text"
  //                                 value={dialogData?.product.name}
  //                               />
  //                             );
  //                           }}
  //                         />
  //                       </div>
  //                       <div className="text-guadrantee">
  //                         <Controller
  //                           name="price"
  //                           control={control}
  //                           render={({ field }) => {
  //                             return (
  //                               <input
  //                                 {...field}
  //                                 type="text"
  //                                 value={dialogData?.price}
  //                               />
  //                             );
  //                           }}
  //                         />
  //                       </div>
  //                     </div>
  //                   </div>
  //                   <div className="text-column-date">
  //                     <div className="text-date">
  //                       <h4>วันที่</h4>
  //                       <Controller
  //                         name="bookDate"
  //                         control={control}
  //                         render={({ field }) => {
  //                           return (
  //                             <input
  //                               {...field}
  //                               type="date"
  //                               value={dialogData?.bookDate}
  //                             />
  //                           );
  //                         }}
  //                       />
  //                     </div>
  //                     <div className="text-car">
  //                       <h4>รถยนต์</h4>
  //                       <Controller
  //                         name="carType"
  //                         control={control}
  //                         render={({ field }) => {
  //                           return (
  //                             <input
  //                               {...field}
  //                               type="text"
  //                               value={dialogData?.carType}
  //                             />
  //                           );
  //                         }}
  //                       />
  //                       <Controller
  //                         name="carModel"
  //                         control={control}
  //                         render={({ field }) => {
  //                           return (
  //                             <input
  //                               {...field}
  //                               type="text"
  //                               value={dialogData?.carModel}
  //                             />
  //                           );
  //                         }}
  //                       />
  //                     </div>
  //                   </div>
  //                   <div className="text-column-name">
  //                     <div className="text-name">
  //                       <h4>ชื่อ</h4>
  //                       <Controller
  //                         name="name"
  //                         control={control}
  //                         render={({ field }) => {
  //                           return (
  //                             <input
  //                               {...field}
  //                               type="text"
  //                               value={dialogData?.name}
  //                             />
  //                           );
  //                         }}
  //                       />
  //                     </div>
  //                     <div className="text-register">
  //                       <h4>ทะเบียน</h4>
  //                       <Controller
  //                         name="licensePlate"
  //                         control={control}
  //                         render={({ field }) => {
  //                           return (
  //                             <input
  //                               {...field}
  //                               type="text"
  //                               value={dialogData?.licensePlate}
  //                             />
  //                           );
  //                         }}
  //                       />
  //                     </div>
  //                   </div>
  //                   <div className="text-tel">
  //                     <h4>เบอร์</h4>
  //                     <Controller
  //                       name="tel"
  //                       control={control}
  //                       render={({ field }) => {
  //                         return (
  //                           <input
  //                             {...field}
  //                             type="text"
  //                             value={dialogData?.tel}
  //                           />
  //                         );
  //                       }}
  //                     />
  //                   </div>
  //                 </div>
  //               </div>
  //               <hr />
  //               <div className="guarante-date">
  //                 <table>
  //                   <thead>
  //                     <tr>
  //                       <th>ครั้งที่</th>
  //                       <th>วันที่เข้ารับบริการ</th>
  //                       <th>คาน</th>
  //                       <th>ซุ้มล้อ</th>
  //                       <th>ปีกนก</th>
  //                       <th>แชสซี่ส์</th>
  //                       <th>ใต้ท้อง</th>
  //                     </tr>
  //                   </thead>

  //                   <tbody>
  //                     {[...Array(10)].map((_, index) => (
  //                       <tr key={index}>
  //                         <td>{index + 1}</td>
  //                         <input className="input-date" type="date" />

  //                         {[...Array(5)].map((_, index) => {
  //                           return (
  //                             <td key={index}>
  //                               <input className="checkbox" type="checkbox" />
  //                             </td>
  //                           );
  //                         })}
  //                       </tr>
  //                     ))}
  //                   </tbody>
  //                 </table>
  //               </div>
  //             </div>
  //           </div>
  //         </form>
  //       </div>
  //     </div>
  //   </dialog>
  // );

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
                      className="fa-solid fa-pen-to-square"
                      onClick={() => {
                        // setOpenDialogProfile(true);
                        // setDialogData(item._id);
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
                <p>ชื่อ: {item.name}</p>
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
      {/* {rederEditProfile()} */}
      {rederDialogDelete()}
      <CircleLoading open={isGuaranteeLoading} />
    </div>
  );
};

export default GuaranteeAdminPage;
