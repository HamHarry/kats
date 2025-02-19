import { Controller, useForm } from "react-hook-form";
import "./BookingAdminPage.css";
import { useState } from "react";
import { chooesPrice } from "../../data/MockUpChooesPrice";
import { time } from "../../data/MockUpTime";
import { mockUpProduct } from "../../data/MockUpProduct";

export interface BookingForm {
  number: string;
  volume: string;
  date: string;
  time: string;
  name: string;
  carType: string;
  carModel: string;
  register: string;
  typeProduct: string;
  product: string;
  tel: string;
  image: string;
}
const defaultValues: BookingForm = {
  number: "",
  volume: "",
  date: "",
  time: "",
  name: "",
  carType: "",
  carModel: "",
  register: "",
  typeProduct: "",
  product: "",
  tel: "",
  image: "/public/assets/logokats.jpg",
};

const BookingAdminPage = () => {
  const [priceData] = useState(chooesPrice);
  const [productData] = useState(mockUpProduct);
  const [timeData] = useState(time);
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const [data, setData] = useState<BookingForm>();

  const { handleSubmit, control } = useForm<BookingForm>({
    defaultValues,
  });

  const submit = (value: BookingForm) => {
    try {
      const item = {
        ...value,
      };
      setData(item); // เก็บข็อมูลเพื่อยินยันการส่ง
    } catch (error) {
      console.log(error);
    }
  };

  const rederDialogConfirm = () => {
    return (
      <dialog open={openDialogConfirm}>
        <div className="container-DialogConfirm">
          <div className="wrap-container-DialogConfirm">
            <div className="container-DialogConfirm-Navbar">
              <i
                className="fa-solid fa-circle-xmark"
                onClick={() => {
                  setOpenDialogConfirm(!openDialogConfirm);
                }}
              ></i>
            </div>
            <h1>ยืนยันการจอง</h1>
            <div className="btn-DialogConfirm-Navbar">
              <button
                type="submit"
                className="btn-submit-dialogConfirm"
                onClick={() => {
                  setOpenDialogConfirm(!openDialogConfirm);
                  console.log(data); //ส่งข้อมูล
                }}
              >
                ยืนยัน
              </button>
              <button className="btn-edit-dialogConfirm">แก้ไข</button>
            </div>
          </div>
        </div>
      </dialog>
    );
  };

  return (
    <div className="container-bookingAdmin">
      <div className="header-bookingAdmin">
        <h1>Booking</h1>
      </div>
      <form onSubmit={handleSubmit(submit)}>
        <div className="wrap-container-bookingAdmin">
          <Controller
            name="number"
            control={control}
            render={({ field }) => {
              return (
                <div className="inputNumber">
                  <h2>เลขที่</h2>
                  <input {...field} type="text" />
                </div>
              );
            }}
          />
          <Controller
            name="volume"
            control={control}
            render={({ field }) => {
              return (
                <div className="inputVolume">
                  <h2>เล่มที่</h2>
                  <input {...field} type="text" />
                </div>
              );
            }}
          />
          <Controller
            name="date"
            control={control}
            render={({ field }) => {
              return (
                <div className="inputDate">
                  <h2>วันที่</h2>
                  <input {...field} type="date" />
                </div>
              );
            }}
          />
          <Controller
            name="time"
            control={control}
            render={({ field }) => {
              return (
                <div className="inputTime">
                  <h2>เวลา</h2>
                  <select {...field}>
                    <option value={""} disabled selected hidden>
                      Time Choose...
                    </option>
                    {timeData.map((item, index) => {
                      return (
                        <option key={index} value={item.time}>
                          {item.time}
                        </option>
                      );
                    })}
                  </select>
                </div>
              );
            }}
          />
          <Controller
            name="name"
            control={control}
            render={({ field }) => {
              return (
                <div className="inputName">
                  <h2>ชื่อ</h2>
                  <input {...field} type="text" />
                </div>
              );
            }}
          />
          <div className="input-car">
            <Controller
              name="carType"
              control={control}
              render={({ field }) => {
                return (
                  <div className="inputCarType">
                    <h2>ประเภทรถ</h2>
                    <input {...field} type="text" />
                  </div>
                );
              }}
            />
            <Controller
              name="carModel"
              control={control}
              render={({ field }) => {
                return (
                  <div className="inputCarModel">
                    <h2>รุ่นรถ</h2>
                    <input {...field} type="text" />
                  </div>
                );
              }}
            />
          </div>
          <Controller
            name="register"
            control={control}
            render={({ field }) => {
              return (
                <div className="inputRegister">
                  <h2>ทะเบียน</h2>
                  <input {...field} type="text" />
                </div>
              );
            }}
          />
          <div className="input-product">
            <Controller
              name="typeProduct"
              control={control}
              render={({ field }) => {
                return (
                  <div className="inputTypeProduct">
                    <h2>สินค้า</h2>
                    <select {...field}>
                      <option value={""} disabled selected hidden>
                        Product Choose...
                      </option>
                      {productData.map((item, index) => {
                        return (
                          <option key={index} value={item.typeProduct}>
                            {item.typeProduct}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                );
              }}
            />
            <Controller
              name="product"
              control={control}
              render={({ field }) => {
                return (
                  <div className="inputProduct">
                    <h2>ราคา</h2>
                    <select {...field}>
                      <option value={""} disabled selected hidden>
                        Product Choose...
                      </option>
                      {priceData.map((item, index) => {
                        return (
                          <option key={index} value={item.price}>
                            {item.price}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                );
              }}
            />
          </div>
          <Controller
            name="tel"
            control={control}
            render={({ field }) => {
              return (
                <div className="inputImage">
                  <h2>เบอร์</h2>
                  <input {...field} type="tel" />
                </div>
              );
            }}
          />
        </div>
        <div className="btn-bookingAdmin">
          <button
            type="submit"
            className="btn-submit-bookingAdmin"
            onClick={() => {
              setOpenDialogConfirm(!openDialogConfirm);
            }}
          >
            ยืนยัน
          </button>
          <button className="btn-edit-bookingAdmin">แก้ไข</button>
        </div>
        {rederDialogConfirm()}
      </form>
    </div>
  );
};
export default BookingAdminPage;
