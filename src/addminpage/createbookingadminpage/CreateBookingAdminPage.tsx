import { Controller, useForm } from "react-hook-form";
import "./CreateBookingAdminPage.css";
import { useCallback, useEffect, useState } from "react";
import { mockUpProducts } from "../../data/MockUpProduct";
import { Select } from "antd";
import { PRICE_TYPE } from "../../model/product.type";
import { BookingStatus, Guarantees } from "../../model/guarantee.type";
import { useNavigate, useParams } from "react-router-dom";
import { CloseCircleFilled } from "@ant-design/icons";
import { guarantee } from "../../data/MockUpGuarantee";

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
  image: "",
  price: "",
  status: BookingStatus.PENDING,
};

const bookingTimeList = [
  { time: "08:00" },
  { time: "10:00" },
  { time: "13:00" },
  { time: "15:00" },
  { time: "17:00" },
];

const CreateBookingAdminPage = () => {
  const [priceData, setPriceData] = useState([]);
  const [productData] = useState(mockUpProducts);
  const [timeData] = useState(bookingTimeList);
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const { handleSubmit, control, setValue, reset } = useForm<BookingForm>({
    defaultValues,
  });

  const fetchPriceData = useCallback(() => {
    try {
      if (!bookingId) return;

      const response = guarantee.find((item) => item._id === bookingId);

      const findedProduct = productData.find(
        (item) => String(item._id) === String(response?.product._id)
      );

      setPriceData(findedProduct?.productDetails as any);

      reset(response);
    } catch (error) {
      console.log(error);
    }
  }, [bookingId, productData, reset]);

  useEffect(() => {
    fetchPriceData();
  }, [fetchPriceData]);

  const submit = (value: BookingForm) => {
    try {
      setOpenDialogConfirm(false);

      const item = {
        ...value,
      };

      console.log(item);

      if (bookingId) {
        alert(`edited successfully : ${bookingId}`);
      } else {
        alert("created successfully");
      }
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
              <CloseCircleFilled
                className="icon-close"
                onClick={() => {
                  setOpenDialogConfirm(false);
                }}
              />
            </div>
            <h1>ยืนยันการจอง</h1>
            <div className="btn-DialogConfirm-Navbar">
              <button type="submit" className="btn-submit-dialogConfirm">
                ยืนยัน
              </button>
              <button
                className="btn-edit-dialogConfirm"
                onClick={() => {
                  setOpenDialogConfirm(false); //ส่งข้อมูล
                }}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </dialog>
    );
  };

  return (
    <div className="container-CreateAdmin">
      <div className="header-CreateAdmin">
        <h1>Create Booking</h1>
      </div>
      <form onSubmit={handleSubmit(submit)}>
        <div className="btn-back">
          <button
            type="button"
            onClick={() => {
              navigate("/main/booking");
            }}
          >
            ย้อนกลับ
          </button>
          <button
            type="button"
            onClick={() => {
              setOpenDialogConfirm(true);
            }}
          >
            ยืนยัน
          </button>
        </div>
        <div className="wrap-container-CreateAdmin">
          <div className="input-Number">
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
          </div>
          <div className="input-Date">
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
                    <Select
                      {...field}
                      className="select-product"
                      placeholder="เลือกเวลา"
                      value={field.value || undefined}
                      options={timeData.map((item) => ({
                        label: `${item.time} น.`,
                        value: item.time,
                      }))}
                    />
                  </div>
                );
              }}
            />
          </div>
          <div className="input-Name">
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
              name="tel"
              control={control}
              render={({ field }) => {
                return (
                  <div className="inputTel">
                    <h2>เบอร์</h2>
                    <input {...field} type="tel" />
                  </div>
                );
              }}
            />
          </div>
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
        </div>
        {rederDialogConfirm()}
      </form>
    </div>
  );
};

export default CreateBookingAdminPage;
