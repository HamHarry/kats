import { Controller, useForm } from "react-hook-form";
import "./CreateBookingAdminPage.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { DatePicker, Modal, Select } from "antd";
import {
  PRICE_TYPE,
  ProductData,
  ProductDetail,
  ProductSnapshotData,
} from "../../model/product.type";
import { BookingStatus, BookingData } from "../../model/booking.type";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FileAddFilled } from "@ant-design/icons";
import { useAppDispatch } from "../../stores/store";
import { getAllProducts } from "../../stores/slices/productSlice";
import dayjs from "dayjs";
import { createBooking, getBookingById, updateBookingById } from "../../stores/slices/bookingSlice";
import CircleLoading from "../../shared/circleLoading";
import { DeleteStatus } from "../../model/delete.type";
import { useTranslation } from "react-i18next";

export interface BookingForm extends Omit<BookingData, "product" | "price" | "bookDate"> {
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
  slip: "",
  price: 0,
  status: BookingStatus.PENDING,
  province: "",
  delete: DeleteStatus.ISNOTDELETE,
  codeId: 0,
};

const bookingTimeList = [
  { time: "08:00" },
  { time: "09:00" },
  { time: "10:00" },
  { time: "11:00" },
  { time: "13:00" },
  { time: "14:00" },
  { time: "15:00" },
  { time: "16:00" },
  { time: "17:00" },
];

const CreateBookingAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  i18n.changeLanguage(lang);
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const targetDate = searchParams.get("targetDate");

  const formRef = useRef<any>(null);
  const [_baseImage, setBaseImage] = useState("");

  const [priceData, setPriceData] = useState<ProductDetail[]>([]);
  const [productDatas, setProductDatas] = useState<ProductData[]>([]);
  const [timeData] = useState(bookingTimeList);
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const [isBookingLoading, setIsBookingLoading] = useState<boolean>(false);

  const { handleSubmit, control, reset, setValue } = useForm<BookingForm>({
    defaultValues,
  });

  useEffect(() => {
    if (targetDate) {
      setValue("bookDate", dayjs(targetDate));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        codeId: bookingRes.codeId ?? 0,
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
      const { data: productsRes = [] } = await dispath(getAllProducts()).unwrap();

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

      const findedProduct = productDatas?.find(
        (item) => String(item._id) === String(value.productId)
      );

      if (!findedProduct) return;

      const {
        catagory: _catagory,
        typeProduct: _typeProduct,
        ...productSnapshot
      }: ProductSnapshotData = {
        ...findedProduct,
        catagorySnapshot: findedProduct.catagory,
        typeProductSnapshot: findedProduct.typeProduct,
      };

      const item = {
        ...value,
        bookDate: value.bookDate ? dayjs(value.bookDate).toISOString() : "",
        price: priceData[value.price],
        product: productSnapshot,
        // slip: baseImage,
      };

      if (bookingId) {
        // แก้ไข
        const body = {
          data: item,
          bookingId,
        };

        await dispath(updateBookingById(body)).unwrap();

        navigate("/admin/booking");
      } else {
        // สร้าง
        await dispath(createBooking(item)).unwrap();

        navigate("/admin/booking");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // เก็บไฟล์รูปภาพเป็น Base64
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const base64 = (await convertBase64(file)) as string;
    setBaseImage(base64);
  };

  const convertBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (e: any) => {
        reject(e);
      };
    });
  };

  const rederDialogConfirm = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogConfirm"
        open={openDialogConfirm}
        onCancel={() => setOpenDialogConfirm(false)}
      >
        <h1>{t("ยืนยันการจอง")}</h1>

        <div className="btn-DialogConfirm-Navbar">
          <button onClick={() => formRef.current?.requestSubmit()}>{t("ยืนยัน")}</button>
          <button
            className="btn-edit-dialogConfirm"
            onClick={() => {
              setOpenDialogConfirm(false);
            }}
          >
            {t("ยกเลิก")}
          </button>
        </div>
      </Modal>
    );
  };

  return (
    <div className="container-CreateAdmin">
      <div className="header-CreateAdmin">
        <h1>{bookingId ? "แก้ไขการจอง" : "สร้างการจอง"}</h1>
      </div>
      <form onSubmit={handleSubmit(submit)} ref={formRef}>
        <div className="btn-back">
          <button
            type="button"
            onClick={() => {
              navigate("/admin/booking");
            }}
          >
            {t("ย้อนกลับ")}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpenDialogConfirm(true);
            }}
          >
            {t("ยืนยัน")}
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
                    <div style={{ width: "120px" }}>
                      <h2>{t("เลขที่")}</h2>
                    </div>

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
                    <div style={{ width: "120px" }}>
                      <h2>{t("เล่มที่")}</h2>
                    </div>

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
                    <div style={{ width: "120px" }}>
                      <h2>{t("วันที่")}</h2>
                    </div>

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
                    <div style={{ width: "120px" }}>
                      <h2>{t("เวลา")}</h2>
                    </div>

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
                    <div style={{ width: "120px" }}>
                      <h2>{t("ชื่อ")}</h2>
                    </div>

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
                    <div style={{ width: "120px" }}>
                      <h2>{t("โทรศัพท์")}</h2>
                    </div>

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
                    <div style={{ width: "120px" }}>
                      <h2>{t("ประเภทรถ")}</h2>
                    </div>

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
                    <div style={{ width: "120px" }}>
                      <h2>{t("รุ่นรถ")}</h2>
                    </div>

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
                    <div style={{ width: "120px" }}>
                      <h2>{t("ทะเบียน")}</h2>
                    </div>

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
                    <div style={{ width: "120px" }}>
                      <h2>{t("จังหวัด")}</h2>
                    </div>

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
                    <div style={{ width: "120px" }}>
                      <h2>{t("สินค้า")}</h2>
                    </div>

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
                    <div style={{ width: "120px" }}>
                      <h2>{t("ราคา")}</h2>
                    </div>

                    <Select
                      {...field}
                      className="select-product"
                      placeholder="เลือกราคา"
                      value={field.value ?? undefined}
                      disabled={priceData.length === 0}
                      options={priceData.map((item, index) => ({
                        label: `${item.type === PRICE_TYPE.LUXURY ? "luxury" : ""} ${
                          item.amount
                        } Baht`,
                        value: index,
                      }))}
                    />
                  </div>
                );
              }}
            />
          </div>

          <Controller
            name="slip"
            control={control}
            render={({ field }) => {
              return (
                <div className="inputImage">
                  <label htmlFor="file" className="text-image">
                    <FileAddFilled className="icon-file" />
                    <span>{t("อัพโหลดภาพสลิปมัดจำ 1,000 บาท")}</span>
                  </label>
                  <input
                    {...field}
                    type="file"
                    id="file"
                    onChange={(e) => {
                      uploadImage(e);
                    }}
                  />
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
