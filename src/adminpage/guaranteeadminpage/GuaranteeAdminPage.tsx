import { useCallback, useEffect, useState } from "react";
import "./GuaranteeAdminPage.css";
import {
  BookingStatus,
  BookingData,
  CarStructure,
} from "../../model/booking.type";
import { ProductType } from "../../model/product.type";
import { useAppDispatch } from "../../stores/store";
import CircleLoading from "../../shared/circleLoading";
import {
  deleteBookingById,
  getAllBookingPaginations,
  getBookingById,
  updateBookingById,
} from "../../stores/slices/bookingSlice";
import dayjs from "dayjs";
import { DatePicker, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { cloneDeep, debounce } from "lodash";
import { Controller, useFieldArray, useForm } from "react-hook-form";
export interface GuaranteeForm {
  guarantees: CarStructure[];
}

const defaultValues: GuaranteeForm = {
  guarantees: [],
};

const GuaranteeAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const [isGuaranteeLoading, setIsGuaranteeLoading] = useState<boolean>(false);

  const [booking, setBooking] = useState<BookingData>();
  const [selectBookingId, setSelectBookingId] = useState<string>();

  const [bookingDatas, setBookingDatas] = useState<BookingData[]>([]);
  const [bookingDataLites, setBookingDataLites] = useState<BookingData[]>([]);
  const [baseImage, setBaseImage] = useState("");
  const [openDialogProfile, setOpenDialogProfile] = useState<boolean>(false);
  const [openDialogDelete, setOpenDialogDelete] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedReceiptBookNo, setSelectedReceiptBookNo] =
    useState<string>("all");
  const [selectedProductName, setSelectedProductName] = useState<string>("all");

  const { control, reset, handleSubmit } = useForm<GuaranteeForm>({
    defaultValues,
  });

  const guaranteeField = useFieldArray({ name: "guarantees", control });

  const submit = async (data: GuaranteeForm) => {
    try {
      if (!booking) return;

      setIsGuaranteeLoading(true);

      const { guarantees } = data;
      const filterGuarantees = guarantees.filter((item) => item.serviceDate);

      if (!filterGuarantees.length) return;

      const newBooking = {
        ...booking,
        guarantees: filterGuarantees,
      };

      const bookingId = newBooking._id;
      const body = {
        bookingId,
        data: newBooking,
      };

      await dispath(updateBookingById(body)).unwrap();

      setOpenDialogProfile(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGuaranteeLoading(false);
    }
  };

  const fetchAllBooking = useCallback(async () => {
    try {
      setIsGuaranteeLoading(true);

      const query = {
        term: searchTerm,
        receiptBookNo: selectedReceiptBookNo,
        productName: selectedProductName,
      };

      const { data: bookingsRes = [] } = await dispath(
        getAllBookingPaginations(query)
      ).unwrap();

      const finedData = bookingsRes.filter((item: any) => {
        return item.status === BookingStatus.COMPLETED;
      });

      setBookingDatas(finedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGuaranteeLoading(false);
    }
  }, [dispath, searchTerm, selectedProductName, selectedReceiptBookNo]);

  useEffect(() => {
    fetchAllBooking();
  }, [fetchAllBooking]);

  const fetchBookingById = useCallback(async () => {
    try {
      if (!selectBookingId) return;

      setIsGuaranteeLoading(true);

      const { data: bookingRes } = await dispath(
        getBookingById(selectBookingId)
      ).unwrap();

      setBooking(bookingRes);

      const guarantees: CarStructure[] = bookingRes?.guarantees || [];

      const clonedGuarantees = cloneDeep(guarantees);

      const remainingGuarantees = 10 - clonedGuarantees.length;

      Array.from({ length: remainingGuarantees }, (_, index) => {
        const guarantee: CarStructure = {
          serviceNo: clonedGuarantees.length + index + 1,
          serviceDate: "",
          isBeam: false,
          isWheelArch: false,
          isControlArm: false,
          isChassis: false,
          isUnderbody: false,
        };

        clonedGuarantees.push(guarantee);
      });

      reset({ guarantees: clonedGuarantees });
    } catch (error) {
      console.log(error);
    } finally {
      setIsGuaranteeLoading(false);
    }
  }, [dispath, reset, selectBookingId]);

  useEffect(() => {
    fetchBookingById();
  }, [fetchBookingById]);

  const initailGuaranteeLites = useCallback(() => {
    if (!bookingDataLites.length) {
      setBookingDataLites(bookingDatas);
    }
  }, [bookingDataLites, bookingDatas]);

  useEffect(() => {
    initailGuaranteeLites();
  }, [initailGuaranteeLites]);

  const handleSetSearchTerm = debounce((value) => {
    setSearchTerm(value);
  }, 500);

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

  const selectMenu = () => {
    const receiptBookNoList = bookingDataLites
      .map((item) => item.receiptBookNo)
      .filter((value, index, self) => self.indexOf(value) === index);
    const productName = bookingDataLites
      .map((item) => item.product.name)
      .filter((value, index, self) => self.indexOf(value) === index);

    return (
      <div className="btn-menu">
        <select onChange={(e) => setSelectedReceiptBookNo(e.target.value)}>
          <option value={"all"}>All</option>
          {receiptBookNoList.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>

        <select
          className="btn-productName"
          onChange={(e) => setSelectedProductName(e.target.value)}
        >
          <option value={"all"}>All</option>
          {productName.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  const deleted = async () => {
    try {
      if (!selectBookingId) return;

      setIsGuaranteeLoading(true);
      await dispath(deleteBookingById(selectBookingId)).unwrap();

      setOpenDialogDelete(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGuaranteeLoading(false);
      fetchAllBooking();
    }
  };

  const renderGuarantee = () => {
    return guaranteeField.fields.map((item, index) => {
      return (
        <tr key={index}>
          <td>{item.serviceNo}</td>
          <td>
            <Controller
              control={control} // Replace with your control object
              name={`guarantees.${index}.serviceDate`}
              render={({ field }) => (
                <DatePicker
                  className="input-date"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => {
                    field.onChange(date?.toISOString() ?? "");
                  }}
                />
              )}
            />
          </td>
          <td>
            <Controller
              control={control}
              name={`guarantees.${index}.isBeam`}
              render={({ field }) => (
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                  }}
                />
              )}
            />
          </td>
          <td>
            <Controller
              control={control}
              name={`guarantees.${index}.isWheelArch`}
              render={({ field }) => (
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                  }}
                />
              )}
            />
          </td>
          <td>
            <Controller
              control={control}
              name={`guarantees.${index}.isControlArm`}
              render={({ field }) => (
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                  }}
                />
              )}
            />
          </td>
          <td>
            <Controller
              control={control}
              name={`guarantees.${index}.isChassis`}
              render={({ field }) => (
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                  }}
                />
              )}
            />
          </td>
          <td>
            <Controller
              control={control}
              name={`guarantees.${index}.isUnderbody`}
              render={({ field }) => (
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                  }}
                />
              )}
            />
          </td>
        </tr>
      );
    });
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

  const rederBookingModal = () => (
    <Modal
      centered
      className={
        booking?.product.name === "KATS Coating"
          ? "wrap-container-Edit-Profile-kats"
          : "wrap-container-Edit-Profile-gun"
      }
      open={openDialogProfile}
      onCancel={() => {
        setOpenDialogProfile(false);
        setSelectBookingId(undefined);
      }}
    >
      <form onSubmit={handleSubmit(submit)}>
        <div className="container-Edit-Profile-Navbar">
          <button
            type="submit"
            onClick={() => {
              setOpenDialogProfile(false);
              setSelectBookingId(undefined);
              setBooking(undefined);
            }}
          >
            <h3>บันทึก</h3>
          </button>
          <i
            className="fa-solid fa-circle-xmark"
            onClick={() => {
              setOpenDialogProfile(false);
              setSelectBookingId(undefined);
              setBooking(undefined);
            }}
          ></i>
        </div>
        <div className="content-Profile">
          <div className="card-profile">
            <div className="wrap-card-profile">
              <div className="ImageProfile">
                <img
                  className={
                    booking?.image === ""
                      ? "IsNotImageProfile "
                      : "IsImageProfile"
                  }
                  src={baseImage}
                  alt="profile"
                />
                <label htmlFor="file" className="text-image">
                  <i className="fa-solid fa-camera"></i>
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => {
                    uploadImage(e);
                  }}
                />
              </div>
              <div className="text-all">
                <div className="text-column-number">
                  <div className="text-number">
                    <h4>เลขที่</h4>
                    <p>{booking?.number}</p>
                  </div>
                  <div className="text-branch">
                    <h4>สาขา</h4>
                    <p>ลาดกระบัง</p>
                  </div>
                </div>
                <div className="text-column-volume">
                  <div className="text-volume">
                    <h4>เล่มที่</h4>
                    <p>{booking?.receiptBookNo}</p>
                  </div>
                  <div className="guadrantee">
                    <div className="text-guadrantee-typeProduct">
                      <h4>ประกันสินค้า</h4>
                      <p>{booking?.product.name}</p>
                    </div>
                    <div className="text-guadrantee">
                      <p>{booking?.price.amount} บาท</p>
                    </div>
                  </div>
                </div>
                <div className="text-column-date">
                  <div className="text-date">
                    <h4>วันที่</h4>
                    <p>{dayjs(booking?.bookDate).format("DD/MM/YYYY")}</p>
                  </div>
                  <div className="text-car">
                    <h4>รถยนต์</h4>
                    <p>
                      {booking?.carType} {booking?.carModel}
                    </p>
                  </div>
                </div>
                <div className="text-column-name">
                  <div className="text-name">
                    <h4>ชื่อ</h4>
                    <p>คุณ{booking?.name}</p>
                  </div>
                  <div className="text-register">
                    <h4>ทะเบียน</h4>
                    <p>
                      {booking?.licensePlate} {booking?.province}
                    </p>
                  </div>
                </div>
                <div className="text-tel">
                  <h4>เบอร์</h4>
                  <p>{booking?.tel}</p>
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

                <tbody>{renderGuarantee()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );

  return (
    <div className="container-guaranteeAdmin">
      <div className="header-guaranteeAdmin">
        <h1>Guarantees</h1>
      </div>
      <div className="search-guaranteeAdmin">
        <div>{selectMenu()}</div>
        <input
          type="text"
          placeholder="Search...(Name,Phone,Number)"
          onChange={(e) => handleSetSearchTerm(e.target.value)}
        />
      </div>
      <div className="wrap-container-guaranteeAdmin">
        {bookingDatas.map((item, index) => {
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
                        setSelectBookingId(item._id);
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
                        setSelectBookingId(item._id);
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
      {rederBookingModal()}
      {rederDialogDelete()}
      <CircleLoading open={isGuaranteeLoading} />
    </div>
  );
};

export default GuaranteeAdminPage;
