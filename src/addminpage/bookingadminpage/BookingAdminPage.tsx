import { Controller, useForm } from "react-hook-form";
import "./BookingAdminPage.css";
import { useState } from "react";
import { mockUpProducts } from "../../data/MockUpProduct";
import { Select } from "antd";
import { PRICE_TYPE } from "../../model/product.type";
import { Guarantees } from "../../model/guarantee.type";

export interface BookingForm extends Guarantees {}

const defaultValues: BookingForm = {
  number: "",
  volume: "",
  bookDate: "",
  bookTime: "",
  name: "",
  carType: "",
  carModel: "",
  register: "",
  product: {
    name: "",
    catagory: {
      name: "",
      code: "",
    },
    productDetails: [],
    detail: "",
  },
  tel: "",
  image: "/public/assets/logokats.jpg",
  price: "",
};

const bookingTimeList = [
  { time: "08:00" },
  { time: "10:00" },
  { time: "13:00" },
  { time: "15:00" },
  { time: "17:00" },
];

const BookingAdminPage = () => {
  const [priceData, setPriceData] = useState([]);
  const [productData] = useState(mockUpProducts);
  const [timeData] = useState(bookingTimeList);
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const [data, setData] = useState<BookingForm>();

  const { handleSubmit, control, setValue } = useForm<BookingForm>({
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
            name="bookDate"
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
            name="bookTime"
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
              name="product._id"
              control={control}
              render={({ field }) => {
                return (
                  <div className="inputTypeProduct">
                    <h2>สินค้า</h2>

                    <Select
                      {...field}
                      placeholder="เลือกสินค้า"
                      className="select-product"
                      value={field.value || undefined}
                      onSelect={(value) => {
                        console.log("select", value);
                        field.onChange(value);

                        const findedProduct = productData.find(
                          (item) => String(item._id) === String(value)
                        );

                        if (findedProduct) {
                          setValue("product", {
                            ...findedProduct,
                            productDetails: [],
                          });
                          setPriceData(findedProduct?.productDetails as any);
                        }
                      }}
                    >
                      {productData.map((item) => (
                        <Select.Option key={item._id} value={item._id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                );
              }}
            />

            <Controller
              name="price"
              control={control}
              render={({ field }) => {
                return (
                  <div className="inputProduct">
                    <h2>ราคา</h2>

                    <Select
                      {...field}
                      className="select-product"
                      placeholder="เลือกราคา"
                      value={field.value || undefined}
                      disabled={priceData.length === 0}
                      options={priceData.map((item: any) => ({
                        label: `${
                          item.type === PRICE_TYPE.LUXURY ? "luxury" : ""
                        } ${item.price} Baht`,
                        value: item.price,
                      }))}
                    />
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
