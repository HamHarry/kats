import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DatePicker, Modal, Select } from "antd";
import { PRICE_TYPE, ProductData, ProductDetail, ProductSnapshotData } from "../../model/product.type";
import { BookingStatus, BookingData } from "../../model/booking.type";
import { useNavigate, useParams } from "react-router-dom";
import { CloseCircleOutlined, FileAddFilled } from "@ant-design/icons";
import { useAppDispatch } from "../../stores/store";
import { getAllProducts } from "../../stores/slices/productSlice";
import dayjs from "dayjs";
import { getBookingById, setBookingUpdateImg, updateBookingById } from "../../stores/slices/bookingSlice";
import CircleLoading from "../../shared/circleLoading";
import { DeleteStatus } from "../../model/delete.type";
import { StyledSelect } from "../../AppStyle";
import { getImagePath } from "../../shared/utils/common";
import { useSelector } from "react-redux";
import { userInfoSelector } from "../../stores/slices/authSlice";
import { uploadFile } from "../../services/coreService";

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
  image: "",
  price: 0,
  status: BookingStatus.PENDING,
  province: "",
  delete: DeleteStatus.ISNOTDELETE,
  codeId: 0,
};

const bookingTimeList = [{ time: "08:00" }, { time: "09:00" }, { time: "10:00" }, { time: "11:00" }, { time: "13:00" }, { time: "15:00" }, { time: "17:00" }];

const EditGuaranteeAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const userInfo = useSelector(userInfoSelector);

  const formRef = useRef<any>(null);

  const [priceData, setPriceData] = useState<ProductDetail[]>([]);
  const [productDatas, setProductDatas] = useState<ProductData[]>([]);
  const [timeData] = useState(bookingTimeList);
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const [isBookingLoading, setIsBookingLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [bookingData, setBookingData] = useState<BookingData>();

  const getBookingSlipImage = useMemo(() => {
    if (imageUrl) {
      return imageUrl;
    } else {
      return getImagePath("booking", userInfo?.dbname, bookingData?.image);
    }
  }, [bookingData, imageUrl, userInfo]);

  const { handleSubmit, control, reset } = useForm<BookingForm>({
    defaultValues,
  });

  const initailForm = useCallback(async () => {
    try {
      if (!bookingId) return;

      const { data } = await dispath(getBookingById(bookingId)).unwrap();
      const bookingRes = data as BookingData;
      setBookingData(bookingRes);
      const priceIndex = bookingRes.product.productDetails.findIndex((item) => {
        return item._id === bookingRes.price._id;
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
        slip: bookingRes.slip ?? "",
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
      const findedProduct = productDatas?.find((item) => String(item._id) === String(value.productId));

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

      let imageName = "";

      if (imageFile) {
        imageName = await uploadFile(imageFile);
        dispath(setBookingUpdateImg({ imageName: imageName }));
      }

      const item = {
        ...value,
        bookDate: value.bookDate ? dayjs(value.bookDate).toISOString() : "",
        price: priceData[value.price],
        product: productSnapshot,
        image: imageName || value.image || "",
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

  // เก็บไฟล์รูปภาพเป็น Base64
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
    setImageFile(file);
  };

  const rederDialogConfirm = () => {
    return (
      <Modal centered className="wrap-container-DialogConfirm" open={openDialogConfirm} onCancel={() => setOpenDialogConfirm(false)}>
        <h1>ยืนยันการแก้ไข</h1>

        <div className="btn-DialogConfirm-Navbar">
          <button onClick={() => formRef.current?.requestSubmit()}>ยืนยัน</button>
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
        <h1>แก้ไขข้อมูลรับประกัน</h1>
      </div>
      <form className="content-CreateAdmin" onSubmit={handleSubmit(submit)} ref={formRef}>
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
                    <div style={{ width: "120px" }}>
                      <h2>เลขที่</h2>
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
                      <h2>เล่มที่</h2>
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
                      <h2>วันที่</h2>
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
                      <h2>เวลา</h2>
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
                      <h2>ชื่อ</h2>
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
                      <h2>เบอร์</h2>
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
                      <h2>ประเภทรถ</h2>
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
                      <h2>รุ่นรถ</h2>
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
                      <h2>ทะเบียน</h2>
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
                      <h2>จังหวัด</h2>
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
                      <h2>สินค้า</h2>
                    </div>

                    <StyledSelect
                      {...field}
                      placeholder="เลือกสินค้า"
                      className="select-product"
                      value={field.value || undefined}
                      onSelect={(value) => {
                        field.onChange(value);

                        const findedProduct = productDatas?.find((item) => String(item._id) === String(value));

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
                    </StyledSelect>
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
                      <h2>ราคา</h2>
                    </div>

                    <Select
                      {...field}
                      className="select-product"
                      placeholder="เลือกราคา"
                      value={field.value ?? undefined}
                      disabled={priceData.length === 0}
                      options={priceData.map((item, index) => ({
                        label: `${item.type === PRICE_TYPE.LUXURY ? "luxury" : ""} ${item.amount} Baht`,
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
                  {getBookingSlipImage ? (
                    <div style={{ position: "relative" }}>
                      <img src={getBookingSlipImage} alt="" style={{ width: "auto", height: "250px" }} />
                      <CloseCircleOutlined
                        className="close-icon"
                        style={{
                          fontSize: "30px",
                          top: "-10px",
                          right: "-10px",
                          zIndex: 1000,
                          color: "#043929",
                          cursor: "pointer",
                          position: "absolute",
                        }}
                        onClick={() => {
                          setImageUrl("");
                          setImageFile(null);
                          setBookingData((prev) => {
                            if (!prev) return;
                            return {
                              ...prev,
                              image: "",
                            };
                          });
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <label htmlFor="file" className="text-image">
                        <FileAddFilled className="icon-file" />
                        <span>อัพโหลดภาพรถยนต์</span>
                      </label>
                      <input
                        {...field}
                        type="file"
                        id="file"
                        onChange={(e) => {
                          uploadImage(e);
                        }}
                      />
                    </>
                  )}
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
