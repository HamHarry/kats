import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { DatePicker, Modal, Select } from "antd";
import {
  PRICE_TYPE,
  ProductData,
  ProductDetail,
} from "../../model/product.type";
import { BookingStatus, BookingData } from "../../model/booking.type";
import { useNavigate, useParams } from "react-router-dom";
import { FileAddFilled } from "@ant-design/icons";
import { useAppDispatch } from "../../stores/store";
import { getAllProducts } from "../../stores/slices/productSlice";
import dayjs from "dayjs";
import {
  getBookingById,
  updateBookingById,
} from "../../stores/slices/bookingSlice";
import CircleLoading from "../../shared/circleLoading";
import { DeleteStatus } from "../../model/delete.type";

export interface BookingForm
  extends Omit<BookingData, "product" | "price" | "bookDate"> {
  productId: string;
  price: number;
  bookDate: dayjs.Dayjs;
}

const defaultValues: BookingForm = {
  number: "",
  receiptBookNo: "",
  bookDate: dayjs(),
  bookTime: "",
  name: "",
  carType: "",
  carModel: "",
  licensePlate: "",
  productId: "",
  tel: "",
  image: "",
  price: 0,
  status: BookingStatus.PENDING,
  province: "",
  delete: DeleteStatus.ISNOTDELETE,
};

const bookingTimeList = [
  { time: "08:00" },
  { time: "09:00" },
  { time: "10:00" },
  { time: "11:00" },
  { time: "13:00" },
  { time: "15:00" },
  { time: "17:00" },
];

const EditGuaranteeAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const formRef = useRef<any>(null);

  const [priceData, setPriceData] = useState<ProductDetail[]>([]);
  const [productDatas, setProductDatas] = useState<ProductData[]>([]);
  const [timeData] = useState(bookingTimeList);
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const [isBookingLoading, setIsBookingLoading] = useState<boolean>(false);

  const { handleSubmit, control, reset } = useForm<BookingForm>({
    defaultValues,
  });

  const initailForm = useCallback(async () => {
    try {
      if (!bookingId) return;

      const { data } = await dispath(getBookingById(bookingId)).unwrap();
      const bookingRes = data as BookingData;
      const priceIndex = bookingRes.product.productDetails.findIndex((item) => {
        return JSON.stringify(item) === JSON.stringify(bookingRes.price);
      });

      setPriceData(bookingRes.product.productDetails ?? []);

      const initBookingForm: BookingForm = {
        productId: bookingRes.product._id ?? "",
        price: priceIndex > -1 ? priceIndex : 0,
        number: bookingRes.number ?? "",
        receiptBookNo: bookingRes.receiptBookNo ?? "",
        bookDate: dayjs(bookingRes.bookDate),
        bookTime: bookingRes.bookTime ?? "",
        name: bookingRes.name ?? "",
        carType: bookingRes.carType ?? "",
        carModel: bookingRes.carModel ?? "",
        licensePlate: bookingRes.licensePlate ?? "",
        province: bookingRes.province ?? "",
        status: bookingRes.status ?? BookingStatus.PENDING,
        tel: bookingRes.tel ?? "",
        delete: bookingRes.delete ?? DeleteStatus.ISNOTDELETE,
      };

      reset(initBookingForm);
    } catch (error) {
      console.log(error);
    }
  }, [bookingId, dispath, reset]);

  useEffect(() => {
    initailForm();
  }, [initailForm]);

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

      console.log(value);

      const item = {
        ...value,
        bookDate: value.bookDate ? dayjs(value.bookDate).toISOString() : "",
        price: priceData[value.price],
        productId: value.productId,
      };

      if (bookingId) {
        // แก้ไข
        const body = {
          data: item,
          bookingId,
        };

        await dispath(updateBookingById(body)).unwrap();

        navigate("/admin/guarantee");
      } else {
        // ต้องมีข้อมูล
        console.log("ข้อมูลไม่ถูกต้อง");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const rederDialogConfirm = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogConfirm"
        open={openDialogConfirm}
        onCancel={() => setOpenDialogConfirm(false)}
      >
        <h1>ยืนยันการจอง</h1>

        <div className="btn-DialogConfirm-Navbar">
          <button onClick={() => formRef.current?.requestSubmit()}>
            ยืนยัน
          </button>
          <button
            className="btn-edit-dialogConfirm"
            onClick={() => {
              setOpenDialogConfirm(false);
            }}
          >
            ยกเลิก
          </button>
        </div>
      </Modal>
    );
  };

  return (
    <div className="container-CreateAdmin">
      <div className="header-CreateAdmin">
        <h1>Edit Guarantee</h1>
      </div>
      <form onSubmit={handleSubmit(submit)} ref={formRef}>
        <div className="btn-back">
          <button
            type="button"
            onClick={() => {
              navigate("/admin/guarantee");
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
          <div className="input-licensePlate">
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

            <Controller
              name="province"
              control={control}
              render={({ field }) => {
                return (
                  <div className="inputProvince">
                    <h2>จังหวัด</h2>
                    <input {...field} type="text" />
                  </div>
                );
              }}
            />
          </div>

          <div className="input-product">
            <Controller
              name="productId"
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
                      value={field.value ?? undefined}
                      disabled={priceData.length === 0}
                      options={priceData.map((item, index) => ({
                        label: `${
                          item.type === PRICE_TYPE.LUXURY ? "luxury" : ""
                        } ${item.amount} Baht`,
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
                    <span>อัพโหลดภาพรถยนต์</span>
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

export default EditGuaranteeAdminPage;
