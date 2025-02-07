import { Controller, useForm } from "react-hook-form";
import "./BookingAdminPage.css";
import { useState } from "react";
import { chooesPrice } from "../../data/MockUpChooesPrice";

export interface BookingForm {
  date: string;
  time: string;
  name: string;
  carType: string;
  carModel: string;
  register: string;
  product: string;
  image: string;
}
const defaultValues: BookingForm = {
  date: "",
  time: "",
  name: "",
  carType: "",
  carModel: "",
  register: "",
  product: "",
  image: "",
};

const BookingAdminPage = () => {
  const [priceData] = useState(chooesPrice);

  const { handleSubmit, control } = useForm<BookingForm>({
    defaultValues,
  });

  const submit = (value: BookingForm) => {
    try {
      const item = {
        ...value,
      };
      console.log(item);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-bookingAdmin">
      <div className="header-bookingAdmin">
        <h1>Booking</h1>
      </div>
      <form onSubmit={handleSubmit(submit)}>
        <div className="wrap-container-bookingAdmin">
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
                  <input {...field} type="time" />
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
          <Controller
            name="product"
            control={control}
            render={({ field }) => {
              return (
                <div className="inputProduct">
                  <h2>สินค้า</h2>
                  <select {...field}>
                    <option value="" disabled selected hidden>
                      Product Choose...
                    </option>
                    {priceData.map((item, index) => {
                      return (
                        <option key={index} value={item.product}>
                          {item.product}
                        </option>
                      );
                    })}
                  </select>
                </div>
              );
            }}
          />
          <Controller
            name="image"
            control={control}
            render={({ field }) => {
              return (
                <div className="inputImage">
                  <h2>รูป</h2>
                  <input {...field} type="file" id="file-input" />
                  <label htmlFor="file-input">
                    <i className="fa-solid fa-arrow-up-from-bracket"></i>
                    อัพโหลดหลักฐานการชำระเงิน
                  </label>
                  <h4>หมายเหตุ :</h4>
                  <p>
                    มัดจำ 1,000 บาทเพื่อเป็นการล็อคคิวของลูกค้า หลังจากจองแล้ว
                    ระบบจะตรวจสอบภายใน 30 นาที เพื่อเป็นการยืนยันจอง
                    หากระบบผิดพลาดติดต่อ Admin เพจ Facebook
                  </p>
                </div>
              );
            }}
          />
        </div>
        <div className="btn-bookingAdmin">
          <button type="submit" className="btn-submit-bookingAdmin">
            ยืนยัน
          </button>
          <button className="btn-edit-bookingAdmin">แก้ไข</button>
        </div>
      </form>
    </div>
  );
};
export default BookingAdminPage;
