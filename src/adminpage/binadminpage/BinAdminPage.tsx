import { Collapse, Modal, Space, Table, Typography } from "antd";
import "./BinAdminPage.css";
import { StyledDivider } from "../../AppStyle";
import { useCallback, useEffect, useState } from "react";
import CircleLoading from "../../shared/circleLoading";
import {
  deleteBookingById,
  getAllBookings,
  isDeleteBookingById,
} from "../../stores/slices/bookingSlice";
import { useAppDispatch } from "../../stores/store";
import { useNavigate } from "react-router-dom";
import { DeleteStatus } from "../../model/delete.type";
import { BookingData, BookingStatus } from "../../model/booking.type";
import dayjs from "dayjs";

const chooseProducts = [
  {
    key: "1",
    label: "สินค้า",
    children: <p>สินค้า</p>,
  },
  {
    key: "2",
    label: "หมวดหมู่",
    children: <p>สินค้า</p>,
  },
  {
    key: "3",
    label: "แบรนด์สินค้า",
    children: <p>สินค้า</p>,
  },
];

const chooseExpenses = [
  {
    key: "1",
    label: "ค่าใช้จ่าย",
    children: <p>สินค้า</p>,
  },
  {
    key: "2",
    label: "การเบิกเงิน",
    children: <p>สินค้า</p>,
  },
];

const BinAdminPage = () => {
  // const navigate = useNavigate();
  const dispath = useAppDispatch();

  const [bookingDatas, setBookingDatas] = useState<BookingData[]>([]);
  const [selectedBookingData, setSelectedBookingData] = useState<BookingData>();

  const [openDialogConfirmApproveBooking, setOpenDialogConfirmApproveBooking] =
    useState<boolean>(false);
  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] =
    useState<boolean>(false);
  const [isBinLoading, setIsBinLoading] = useState<boolean>(false);

  const fetchAllBooking = useCallback(async () => {
    try {
      setIsBinLoading(true);

      const { data: bookingsRes = [] } = await dispath(
        getAllBookings()
      ).unwrap();

      const filteredBookings = bookingsRes.filter((item: BookingData) => {
        return item.delete === DeleteStatus.ISDELETE;
      });

      setBookingDatas(filteredBookings);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllBooking();
  }, [fetchAllBooking]);

  const recover = async () => {
    try {
      setIsBinLoading(true);

      if (!selectedBookingData?._id) return;

      const data = {
        ...selectedBookingData,
        delete: DeleteStatus.ISNOTDELETE,
      };

      await dispath(isDeleteBookingById(data)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
      fetchAllBooking();
    }
  };

  const deletedBooking = async () => {
    try {
      setIsBinLoading(true);
      if (!selectedBookingData?._id) return;

      await dispath(deleteBookingById(selectedBookingData._id)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
      setOpenDialogConfirmDelete(false);
      fetchAllBooking();
    }
  };

  const rederDialogConfirmDelete = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogDelete"
        open={openDialogConfirmDelete}
        onCancel={() => setOpenDialogConfirmDelete(false)}
      >
        <h1>ยืนยันการลบ</h1>

        <div className="btn-DialogDelete-Navbar">
          <button
            type="button"
            onClick={() => {
              deletedBooking();
              setOpenDialogConfirmDelete(false);
            }}
          >
            ยืนยัน
          </button>
          <button
            onClick={() => {
              setOpenDialogConfirmDelete(false);
            }}
          >
            ยกเลิก
          </button>
        </div>
      </Modal>
    );
  };

  const columns = [
    { title: "CodeID", dataIndex: "codeId", key: "codeId" },
    { title: "เล่มที่", dataIndex: "receiptBookNo", key: "receiptBookNo" },
    {
      title: "วันที่",
      dataIndex: "bookDate",
      key: "bookDate",
      render: (date: string) => {
        const formattedDate = date ? dayjs(date).format("DD/MM/YYYY") : " ";
        return <Typography>{formattedDate}</Typography>;
      },
    },
    { title: "ชื่อ-นามสกุล", dataIndex: "name", key: "name" },
    { title: "เบอร์โทรศัพท์", dataIndex: "tel", key: "tel" },
    {
      title: "",
      key: "action",
      render: (item: BookingData) => (
        <Space
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "14px",
          }}
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBookingData(item);
              setOpenDialogConfirmDelete(true);
            }}
          >
            ลบ
          </a>
        </Space>
      ),
    },
  ];

  const chooseBookings = [
    {
      key: "1",
      label: "การจองคิว",
      children: (
        <div className="content-boolings" style={{ width: "100%" }}>
          <Table
            dataSource={bookingDatas}
            columns={columns}
            onRow={(record) => {
              return {
                onClick: () => {
                  setSelectedBookingData(record);
                  setOpenDialogConfirmApproveBooking(true);
                },
              };
            }}
          />
        </div>
      ),
    },
  ];

  const rederDialogConfirmApproveBooking = () => {
    const formattedDate = selectedBookingData
      ? dayjs(selectedBookingData.bookDate).format("DD/MM/YYYY")
      : "";

    return (
      <Modal
        centered
        className="container-DialogApprove"
        open={openDialogConfirmApproveBooking}
        onCancel={() => setOpenDialogConfirmApproveBooking(false)}
        footer={
          <div className="btn-DialogApprove-Navbar">
            <button
              type="button"
              onClick={() => {
                recover();
                setOpenDialogConfirmApproveBooking(false);
              }}
            >
              กู้คืน
            </button>
          </div>
        }
      >
        <div className="container-DialogApprove-navbar">
          <h1>ข้อมูลการจอง</h1>

          <i
            className="fa-solid fa-circle-xmark"
            onClick={() => {
              setOpenDialogConfirmApproveBooking(false);
            }}
          ></i>
        </div>

        <div className="container-DialogApprove-content">
          <div className="text-all">
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ width: "150px" }}>
                <p>วันที่จอง: {formattedDate}</p>
              </div>

              <p>เวลา: {selectedBookingData?.bookTime} น.</p>
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ width: "150px" }}>
                <p>เลขที่: {selectedBookingData?.number}</p>
              </div>

              <p>เล่มที่: {selectedBookingData?.receiptBookNo}</p>
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ width: "150px" }}>
                <p>ชื่อ: {selectedBookingData?.name}</p>
              </div>

              <p>โทรศัพท์: {selectedBookingData?.tel}</p>
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ width: "150px" }}>
                <p>
                  รถ: {selectedBookingData?.carType}{" "}
                  {selectedBookingData?.carModel}
                </p>
              </div>

              <p>
                สินค้า: {selectedBookingData?.product.name}{" "}
                {selectedBookingData?.price.amount} บาท
              </p>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="container-binAdmin">
      <div className="header-binAdmin">
        <h1>ถังขยะ</h1>
      </div>

      <div className="wrap-bin-content-teble">
        <div className="bin-content-teble">
          <StyledDivider orientation="left">ข้อมูลการจองคิว</StyledDivider>
          <Collapse items={chooseBookings} />
          <StyledDivider orientation="left">
            ข้อมูลสินค้า & หมวดหมู่ & แบรนด์สินค้า
          </StyledDivider>
          <Collapse items={chooseProducts} />
          <StyledDivider orientation="left">
            ข้อมูลค่าใช้จ่าย & เบิกเงิน
          </StyledDivider>
          <Collapse items={chooseExpenses} />
        </div>
      </div>

      {rederDialogConfirmApproveBooking()}
      {rederDialogConfirmDelete()}
      <CircleLoading open={isBinLoading} />
    </div>
  );
};

export default BinAdminPage;
