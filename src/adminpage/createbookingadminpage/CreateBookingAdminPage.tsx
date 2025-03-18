import { Controller, useForm } from "react-hook-form";
import "./CreateBookingAdminPage.css";
import { useCallback, useEffect, useState } from "react";
import { DatePicker, Select } from "antd";
import { PRICE_TYPE, Product, ProductDetail } from "../../model/product.type";
import { BookingStatus, Bookings } from "../../model/booking.type";
import { useNavigate, useParams } from "react-router-dom";
import { CloseCircleFilled, FileAddFilled } from "@ant-design/icons";
import { useAppDispatch } from "../../stores/store";
import { getAllProducts } from "../../stores/slices/productSlice";
import dayjs from "dayjs";
import { createBooking } from "../../stores/slices/bookingSlice";
import CircleLoading from "../../shared/circleLoading";

export interface BookingForm extends Omit<Bookings, "product" | "price"> {
  product: string;
  price: number;
}

const defaultValues: BookingForm = {
  number: "",
  receiptBookNo: "",
  bookDate: "",
  bookTime: "",
  name: "",
  carType: "",
  carModel: "",
  licensePlate: "",
  product: "",
  tel: "",
  image: "",
  price: 0,
  status: BookingStatus.PENDING,
};

const bookingTimeList = [
  { time: "08:00" },
  { time: "08:30" },
  { time: "10:00" },
  { time: "10:30" },
  { time: "13:00" },
  { time: "15:00" },
  { time: "17:00" },
];

const CreateBookingAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [priceData, setPriceData] = useState<ProductDetail[]>([]);
  const [productDatas, setProductDatas] = useState<Product[]>([]);
  const [timeData] = useState(bookingTimeList);
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const [isBookingLoading, setIsBookingLoading] = useState<boolean>(false);

  const { handleSubmit, control } = useForm<BookingForm>({
    defaultValues,
  });

  const fetchAllProduct = useCallback(async () => {
    try {
      setIsBookingLoading(true);
      const { data: productsRes = [] } = await dispath(
        getAllProducts()
      ).unwrap();

      setProductDatas(productsRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBookingLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllProduct();
  }, [fetchAllProduct]);

  const submit = async (value: BookingForm) => {
    try {
      setOpenDialogConfirm(false);

      const item = {
        ...value,
        bookDate: dayjs(value.bookDate).toISOString(),
        price: priceData[value.price],
      };

      if (bookingId) {
        // แก้ไข
        console.log(item);
      } else {
        // สร้าง
        await dispath(createBooking(item));
      }
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/admin/booking");
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
              navigate("/admin/booking");
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
              name="receiptBookNo"
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
                    <DatePicker {...field} />
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
            name="licensePlate"
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
              name="product"
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

                        const findedProduct = productDatas?.find(
                          (item) => String(item._id) === String(value)
                        );

                        if (findedProduct) {
                          setPriceData(findedProduct?.productDetails as any);
                        }
                      }}
                    >
                      {productDatas?.map((item) => (
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
                      options={priceData.map((item: any, index) => ({
                        label: `${
                          item.type === PRICE_TYPE.LUXURY ? "luxury" : ""
                        } ${item.price} Baht`,
                        value: index,
                      }))}
                    />
                  </div>
                );
              }}
            />
          </div>

          <Controller
            name="image"
            control={control}
            render={({ field }) => {
              return (
                <div className="inputImage">
                  <label htmlFor="file" className="text-image">
                    <FileAddFilled className="icon-file" />
                    <span>อัพโหลดภาพสลิปมัดจำ 1,000 บาท</span>
                  </label>
                  <input {...field} type="file" id="file" />
                </div>
              );
            }}
          />
        </div>
        {rederDialogConfirm()}
      </form>
      <CircleLoading open={isBookingLoading} />
    </div>
  );
};

export default CreateBookingAdminPage;
