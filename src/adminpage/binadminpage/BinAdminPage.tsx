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
import { DeleteStatus } from "../../model/delete.type";
import { BookingData } from "../../model/booking.type";
import dayjs from "dayjs";
import {
  CatagoryData,
  PRICE_TYPE,
  ProductData,
  ProductDetail,
  TypeProductData,
} from "../../model/product.type";
import {
  deleteCatagoryById,
  deleteProductById,
  deleteTypeProductById,
  getAllCatagories,
  getAllProducts,
  getAllTypeProduct,
  isDeleteCatagoryById,
  isDeleteProductById,
  isDeleteTypeProductById,
} from "../../stores/slices/productSlice";
import { CatagoryDetail, FinanceData } from "../../model/finance.type";
import { EmployeeData } from "../../model/employee.type";
import FormItem from "antd/es/form/FormItem";
import {
  deleteExpenseById,
  getAllExpenses,
  isDeleteExpenseById,
} from "../../stores/slices/expenseSlice";
import { getAllEmployees } from "../../stores/slices/employeeSlice";

const choosePermission = [
  {
    key: "1",
    label: "พนักงาน",
    children: <p>coming soon</p>,
  },
  {
    key: "2",
    label: "บทบาท",
    children: <p>coming soon</p>,
  },
];

const BinAdminPage = () => {
  const dispath = useAppDispatch();

  const [bookingDatas, setBookingDatas] = useState<BookingData[]>([]);
  const [productDatas, setProductDatas] = useState<ProductData[]>([]);
  const [catagoryDatas, setCatagoryDatas] = useState<CatagoryData[]>([]);
  const [typeProductDatas, setTypeProductDatas] = useState<TypeProductData[]>(
    []
  );
  const [expenseDatas, setExpenseDatas] = useState<FinanceData[]>([]);
  const [employeeDatas, setEmployeeDatas] = useState<EmployeeData[]>([]);

  const [selectedBookingData, setSelectedBookingData] = useState<BookingData>();
  const [selectedProductData, setSelectedProductData] = useState<ProductData>();
  const [selectedCatagoryData, setSelectedCatagoryData] =
    useState<CatagoryData>();
  const [selectedTypeProductData, setSelectedTypeProductData] =
    useState<TypeProductData>();
  const [selectedExpenseData, setSelectedExpenseData] = useState<FinanceData>();
  const [selectedEmployeeData, setSelectedEmployeeData] =
    useState<EmployeeData>();

  const [openDialogConfirmApproveBooking, setOpenDialogConfirmApproveBooking] =
    useState<boolean>(false);
  const [openDialogConfirmDeleteBooking, setOpenDialogConfirmDeleteBooking] =
    useState<boolean>(false);

  const [openDialogConfirmDeleteProduct, setOpenDialogConfirmDeleteProduct] =
    useState<boolean>(false);
  const [openDialogConfirmApproveProduct, setOpenDialogConfirmApproveProduct] =
    useState<boolean>(false);
  const [openDialogConfirmDeleteCatagory, setOpenDialogConfirmDeleteCatagory] =
    useState<boolean>(false);
  const [
    openDialogConfirmApproveCatagory,
    setOpenDialogConfirmApproveCatagory,
  ] = useState<boolean>(false);
  const [
    openDialogConfirmDeleteTypeProduct,
    setOpenDialogConfirmDeleteTypeProduct,
  ] = useState<boolean>(false);
  const [
    openDialogConfirmApproveTypeProduct,
    setOpenDialogConfirmApproveTypeProduct,
  ] = useState<boolean>(false);

  const [openDialogConfirmDeleteExpense, setOpenDialogConfirmDeleteExpense] =
    useState<boolean>(false);
  const [openDialogConfirmApproveExpense, setOpenDialogConfirmApproveExpense] =
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

  const fetchAllProduct = useCallback(async () => {
    try {
      setIsBinLoading(true);

      const { data: productRes = [] } = await dispath(
        getAllProducts()
      ).unwrap();

      const filteredProducts = productRes.filter((item: ProductData) => {
        return item.delete === DeleteStatus.ISDELETE;
      });

      setProductDatas(filteredProducts);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllProduct();
  }, [fetchAllProduct]);

  const fetchAllCatagory = useCallback(async () => {
    try {
      setIsBinLoading(true);

      const { data: catagoryRes = [] } = await dispath(
        getAllCatagories()
      ).unwrap();

      const filteredCatagorys = catagoryRes.filter((item: CatagoryData) => {
        return item.delete === DeleteStatus.ISDELETE;
      });

      setCatagoryDatas(filteredCatagorys);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllCatagory();
  }, [fetchAllCatagory]);

  const fetchAlltypeProduct = useCallback(async () => {
    try {
      setIsBinLoading(true);

      const { data: typeProductRes = [] } = await dispath(
        getAllTypeProduct()
      ).unwrap();

      const filteredTypeProducts = typeProductRes.filter(
        (item: TypeProductData) => {
          return item.delete === DeleteStatus.ISDELETE;
        }
      );

      setTypeProductDatas(filteredTypeProducts);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAlltypeProduct();
  }, [fetchAlltypeProduct]);

  const fetchAllExpense = useCallback(async () => {
    try {
      setIsBinLoading(true);
      const { data: ExpensesRes = [] } = await dispath(
        getAllExpenses()
      ).unwrap();

      const filteredExpenses = ExpensesRes.filter((item: FinanceData) => {
        return item.delete === DeleteStatus.ISDELETE;
      });

      setExpenseDatas(filteredExpenses);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllExpense();
  }, [fetchAllExpense]);

  const fetchEmployeeData = useCallback(async () => {
    try {
      setIsBinLoading(true);
      const { data: EmployeesRes = [] } = await dispath(
        getAllEmployees()
      ).unwrap();

      setEmployeeDatas(EmployeesRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  // Recover All
  const recoverBooking = async () => {
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

  const recoverProduct = async () => {
    try {
      setIsBinLoading(true);

      if (!selectedProductData?._id) return;

      const data = {
        ...selectedProductData,
        delete: DeleteStatus.ISNOTDELETE,
      };

      await dispath(isDeleteProductById(data)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
      fetchAllProduct();
    }
  };

  const recoverCatagory = async () => {
    try {
      setIsBinLoading(true);

      if (!selectedCatagoryData?._id) return;

      const data = {
        ...selectedCatagoryData,
        delete: DeleteStatus.ISNOTDELETE,
      };

      await dispath(isDeleteCatagoryById(data)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
      fetchAllCatagory();
    }
  };

  const recoverTypeProduct = async () => {
    try {
      setIsBinLoading(true);

      if (!selectedTypeProductData?._id) return;

      const data = {
        ...selectedTypeProductData,
        delete: DeleteStatus.ISNOTDELETE,
      };

      await dispath(isDeleteTypeProductById(data)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
      fetchAlltypeProduct();
    }
  };

  const recoverExpense = async () => {
    try {
      setIsBinLoading(true);

      if (!selectedExpenseData?._id) return;

      const data = {
        ...selectedExpenseData,
        delete: DeleteStatus.ISNOTDELETE,
      };

      await dispath(isDeleteExpenseById(data)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
      fetchAllExpense();
    }
  };

  // Deleted All
  const deletedBooking = async () => {
    try {
      setIsBinLoading(true);
      if (!selectedBookingData?._id) return;

      await dispath(deleteBookingById(selectedBookingData._id)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
      setOpenDialogConfirmDeleteBooking(false);
      fetchAllBooking();
    }
  };

  const deletedProduct = async () => {
    try {
      setIsBinLoading(true);
      if (!selectedProductData?._id) return;

      await dispath(deleteProductById(selectedProductData._id)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
      setOpenDialogConfirmDeleteProduct(false);
      fetchAllProduct();
    }
  };

  const deletedCatagory = async () => {
    try {
      setIsBinLoading(true);
      if (!selectedCatagoryData?._id) return;

      await dispath(deleteCatagoryById(selectedCatagoryData._id)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
      setOpenDialogConfirmDeleteCatagory(false);
      fetchAllCatagory();
    }
  };

  const deletedTypeProduct = async () => {
    try {
      setIsBinLoading(true);
      if (!selectedTypeProductData?._id) return;

      await dispath(
        deleteTypeProductById(selectedTypeProductData._id)
      ).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
      setOpenDialogConfirmDeleteTypeProduct(false);
      fetchAlltypeProduct();
    }
  };

  const deletedExpense = async () => {
    try {
      setIsBinLoading(true);
      if (!selectedExpenseData?._id) return;

      await dispath(deleteExpenseById(selectedExpenseData._id)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsBinLoading(false);
      fetchAllExpense();
    }
  };

  // Render All
  const rederDialogConfirmDeleteBooking = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogDelete"
        open={openDialogConfirmDeleteBooking}
        onCancel={() => setOpenDialogConfirmDeleteBooking(false)}
      >
        <h1>ยืนยันการลบ</h1>

        <div className="btn-DialogDelete-Navbar">
          <button
            type="button"
            onClick={() => {
              deletedBooking();
              setOpenDialogConfirmDeleteBooking(false);
            }}
          >
            ยืนยัน
          </button>
          <button
            onClick={() => {
              setOpenDialogConfirmDeleteBooking(false);
            }}
          >
            ยกเลิก
          </button>
        </div>
      </Modal>
    );
  };

  const rederDialogConfirmDeleteProduct = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogDelete"
        open={openDialogConfirmDeleteProduct}
        onCancel={() => setOpenDialogConfirmDeleteProduct(false)}
      >
        <h1>ยืนยันการลบ</h1>

        <div className="btn-DialogDelete-Navbar">
          <button
            type="button"
            onClick={() => {
              deletedProduct();
              setOpenDialogConfirmDeleteProduct(false);
            }}
          >
            ยืนยัน
          </button>
          <button
            onClick={() => {
              setOpenDialogConfirmDeleteProduct(false);
            }}
          >
            ยกเลิก
          </button>
        </div>
      </Modal>
    );
  };

  const rederDialogConfirmDeleteCatagory = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogDelete"
        open={openDialogConfirmDeleteCatagory}
        onCancel={() => setOpenDialogConfirmDeleteCatagory(false)}
      >
        <h1>ยืนยันการลบ</h1>

        <div className="btn-DialogDelete-Navbar">
          <button
            type="button"
            onClick={() => {
              deletedCatagory();
              setOpenDialogConfirmDeleteCatagory(false);
            }}
          >
            ยืนยัน
          </button>
          <button
            onClick={() => {
              setOpenDialogConfirmDeleteCatagory(false);
            }}
          >
            ยกเลิก
          </button>
        </div>
      </Modal>
    );
  };

  const rederDialogConfirmDeleteTypeProduct = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogDelete"
        open={openDialogConfirmDeleteTypeProduct}
        onCancel={() => setOpenDialogConfirmDeleteTypeProduct(false)}
      >
        <h1>ยืนยันการลบ</h1>

        <div className="btn-DialogDelete-Navbar">
          <button
            type="button"
            onClick={() => {
              deletedTypeProduct();
              setOpenDialogConfirmDeleteTypeProduct(false);
            }}
          >
            ยืนยัน
          </button>
          <button
            onClick={() => {
              setOpenDialogConfirmDeleteTypeProduct(false);
            }}
          >
            ยกเลิก
          </button>
        </div>
      </Modal>
    );
  };

  const rederDialogConfirmDeleteExpense = () => {
    return (
      <Modal
        centered
        className="wrap-container-DialogDelete"
        open={openDialogConfirmDeleteExpense}
        onCancel={() => setOpenDialogConfirmDeleteExpense(false)}
      >
        <h1>ยืนยันการลบ</h1>

        <div className="btn-DialogDelete-Navbar">
          <button
            type="button"
            onClick={() => {
              deletedExpense();
              setOpenDialogConfirmDeleteExpense(false);
            }}
          >
            ยืนยัน
          </button>
          <button
            onClick={() => {
              setOpenDialogConfirmDeleteExpense(false);
            }}
          >
            ยกเลิก
          </button>
        </div>
      </Modal>
    );
  };

  const columnBookings = [
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
              setOpenDialogConfirmDeleteBooking(true);
            }}
          >
            ลบ
          </a>
        </Space>
      ),
    },
  ];

  const columnProducts = [
    { title: "ชื่อสินค้า", dataIndex: "name", key: "name" },
    {
      title: "ชื่อหมวดหมู่",
      dataIndex: "catagory",
      key: "catagory",
      render: (catagory: CatagoryData) => {
        return <Typography>{catagory.name}</Typography>;
      },
    },
    {
      title: "ราคาสินค้า",
      dataIndex: "productDetails",
      key: "productDetails",
      render: (productDetails: ProductDetail[]) => {
        return (
          <div
            style={{
              display: "flex",
              gap: "5px",
            }}
          >
            {productDetails.map((productDetail: ProductDetail, index) => {
              // STANDARD = green , LUXURY = gold
              const backgroundColor =
                productDetail.type === PRICE_TYPE.LUXURY
                  ? "#FFD700"
                  : "#008B00";

              return (
                <div
                  key={index}
                  style={{
                    backgroundColor,
                    borderRadius: "10px",
                    textAlign: "center",
                    padding: "5px 10px",
                  }}
                >
                  <Typography>{productDetail.amount}</Typography>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "",
      key: "action",
      render: (item: ProductData) => (
        <Space
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            fontSize: "14px",
          }}
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductData(item);
              setOpenDialogConfirmApproveProduct(true);
            }}
          >
            กู้คืน
          </a>
          <a
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductData(item);
              setOpenDialogConfirmDeleteProduct(true);
            }}
          >
            ลบ
          </a>
        </Space>
      ),
    },
  ];

  const columnCatagorys = [
    { title: "ชื่อสินค้า", dataIndex: "name", key: "name" },
    { title: "รหัสสินค้า", dataIndex: "code", key: "code" },
    {
      title: "",
      key: "action",
      render: (item: CatagoryData) => (
        <Space
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            fontSize: "14px",
          }}
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCatagoryData(item);
              setOpenDialogConfirmApproveCatagory(true);
            }}
          >
            กู้คืน
          </a>
          <a
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCatagoryData(item);
              setOpenDialogConfirmDeleteCatagory(true);
            }}
          >
            ลบ
          </a>
        </Space>
      ),
    },
  ];

  const columnTypeProducts = [
    { title: "ชื่อสินค้า", dataIndex: "name", key: "name" },
    { title: "รหัสสินค้า", dataIndex: "code", key: "code" },
    {
      title: "",
      key: "action",
      render: (item: TypeProductData) => (
        <Space
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            fontSize: "14px",
          }}
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTypeProductData(item);
              setOpenDialogConfirmApproveTypeProduct(true);
            }}
          >
            กู้คืน
          </a>
          <a
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTypeProductData(item);
              setOpenDialogConfirmDeleteTypeProduct(true);
            }}
          >
            ลบ
          </a>
        </Space>
      ),
    },
  ];

  const columnExpenses = [
    { title: "เลขที่", dataIndex: "codeId", key: "codeId" },
    {
      title: "ผู้สร้างเอกสาร",
      dataIndex: "employee",
      key: "employee",
      render: (employee: EmployeeData) => {
        return <Typography>{employee.name}</Typography>;
      },
    },
    { title: "หัวข้อ", dataIndex: "ownerName", key: "ownerName" },
    {
      title: "หมวดหมู่",
      dataIndex: "section",
      key: "section",
      render: (section: number) => {
        return (
          <Typography>
            {section === 0 ? "ค่าใช้จ่าย" : "เบิกเงินเดือน"}
          </Typography>
        );
      },
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "date",
      key: "date",
      render: (date: string) => {
        const formattedDate = date ? dayjs(date).format("DD/MM/YYYY") : "-";
        return <Typography>{formattedDate}</Typography>;
      },
    },
    {
      title: "วันที่ชำระเงิน",
      dataIndex: "datePrice",
      key: "datePrice",
      render: (datePrice: string) => {
        const formattedDate = datePrice
          ? dayjs(datePrice).format("DD/MM/YYYY")
          : "";
        return <Typography>{formattedDate}</Typography>;
      },
    },
    {
      title: "รวมยอดค่าใช้จ่าย",
      dataIndex: "categorys",
      key: "categorys",
      render: (categorys: CatagoryDetail[]) => {
        const total = categorys.reduce((prev, item) => {
          return prev + item.amount;
        }, 0);

        return <Typography>{total}</Typography>;
      },
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (status: number) => {
        const statusText =
          status === 0
            ? "รออนุมัติ"
            : status === 1
            ? "อนุมัติแล้ว"
            : "ยกเลิกเอกสาร";

        const color =
          status === 0 ? "#FFD700" : status === 1 ? "#008B00" : "#FF0000";
        return <Typography style={{ color }}>{statusText}</Typography>;
      },
    },
    {
      title: "",
      key: "action",
      render: (item: FinanceData) => (
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
              setSelectedExpenseData(item);
              setOpenDialogConfirmApproveExpense(true);
            }}
          >
            กู้คืน
          </a>
          <a
            onClick={(e) => {
              e.stopPropagation();
              setSelectedExpenseData(item);
              setOpenDialogConfirmDeleteExpense(true);
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
            columns={columnBookings}
            pagination={{
              pageSize: 5,
            }}
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

  const chooseProducts = [
    {
      key: "1",
      label: "สินค้า",
      children: (
        <div className="content-products" style={{ width: "100%" }}>
          <Table
            dataSource={productDatas}
            pagination={{
              pageSize: 5,
            }}
            columns={columnProducts}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "หมวดหมู่",
      children: (
        <div className="content-catagorys" style={{ width: "100%" }}>
          <Table
            dataSource={catagoryDatas}
            pagination={{
              pageSize: 5,
            }}
            columns={columnCatagorys}
          />
        </div>
      ),
    },
    {
      key: "3",
      label: "แบรนด์สินค้า",
      children: (
        <div className="content-typeProduct" style={{ width: "100%" }}>
          <Table dataSource={typeProductDatas} columns={columnTypeProducts} />
        </div>
      ),
    },
  ];

  const chooseExpenses = [
    {
      key: "1",
      label: "ค่าใช้จ่าย & เงินเดือน",
      children: (
        <div className="content-Expense" style={{ width: "100%" }}>
          <Table
            dataSource={expenseDatas}
            pagination={{
              pageSize: 5,
            }}
            columns={columnExpenses}
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
                recoverBooking();
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

  const rederDialogConfirmApproveProduct = () => {
    return (
      <Modal
        centered
        className="container-DialogApprove"
        open={openDialogConfirmApproveProduct}
        onCancel={() => setOpenDialogConfirmApproveProduct(false)}
        footer={
          <div className="btn-DialogApprove-Navbar">
            <button
              type="button"
              onClick={() => {
                recoverProduct();
                setOpenDialogConfirmApproveProduct(false);
              }}
            >
              กู้คืน
            </button>

            <button
              type="button"
              onClick={() => {
                setOpenDialogConfirmApproveProduct(false);
              }}
            >
              ยกเลิก
            </button>
          </div>
        }
      >
        <div className="container-DialogApprove-navbar">
          <h1>ยืนยันการกู้สินค้า</h1>

          <i
            className="fa-solid fa-circle-xmark"
            onClick={() => {
              setOpenDialogConfirmApproveProduct(false);
            }}
          ></i>
        </div>
      </Modal>
    );
  };

  const rederDialogConfirmApproveCatagory = () => {
    return (
      <Modal
        centered
        className="container-DialogApprove"
        open={openDialogConfirmApproveCatagory}
        onCancel={() => setOpenDialogConfirmApproveCatagory(false)}
        footer={
          <div className="btn-DialogApprove-Navbar">
            <button
              type="button"
              onClick={() => {
                recoverCatagory();
                setOpenDialogConfirmApproveCatagory(false);
              }}
            >
              กู้คืน
            </button>

            <button
              type="button"
              onClick={() => {
                setOpenDialogConfirmApproveCatagory(false);
              }}
            >
              ยกเลิก
            </button>
          </div>
        }
      >
        <div className="container-DialogApprove-navbar">
          <h1>ยืนยันการกู้หมวดหมู่สินค้า</h1>

          <i
            className="fa-solid fa-circle-xmark"
            onClick={() => {
              setOpenDialogConfirmApproveCatagory(false);
            }}
          ></i>
        </div>
      </Modal>
    );
  };

  const rederDialogConfirmApproveTypeProduct = () => {
    return (
      <Modal
        centered
        className="container-DialogApprove"
        open={openDialogConfirmApproveTypeProduct}
        onCancel={() => setOpenDialogConfirmApproveTypeProduct(false)}
        footer={
          <div className="btn-DialogApprove-Navbar">
            <button
              type="button"
              onClick={() => {
                recoverTypeProduct();
                setOpenDialogConfirmApproveTypeProduct(false);
              }}
            >
              กู้คืน
            </button>

            <button
              type="button"
              onClick={() => {
                setOpenDialogConfirmApproveTypeProduct(false);
              }}
            >
              ยกเลิก
            </button>
          </div>
        }
      >
        <div className="container-DialogApprove-navbar">
          <h1>ยืนยันการกู้แบรนด์สินค้า</h1>

          <i
            className="fa-solid fa-circle-xmark"
            onClick={() => {
              setOpenDialogConfirmApproveTypeProduct(false);
            }}
          ></i>
        </div>
      </Modal>
    );
  };

  const rederDialogConfirmApproveExpense = () => {
    return (
      <Modal
        centered
        className="container-DialogApprove"
        open={openDialogConfirmApproveExpense}
        onCancel={() => setOpenDialogConfirmApproveExpense(false)}
        footer={
          <div className="btn-DialogApprove-Navbar">
            <button
              type="button"
              onClick={() => {
                recoverExpense();
                setOpenDialogConfirmApproveExpense(false);
              }}
            >
              กู้คืน
            </button>

            <button
              type="button"
              onClick={() => {
                setOpenDialogConfirmApproveExpense(false);
              }}
            >
              ยกเลิก
            </button>
          </div>
        }
      >
        <div className="container-DialogApprove-navbar">
          <h1>ยืนยันการกู้แบรนด์สินค้า</h1>

          <i
            className="fa-solid fa-circle-xmark"
            onClick={() => {
              setOpenDialogConfirmApproveExpense(false);
            }}
          ></i>
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
          <StyledDivider orientation="left">พนักงาน & บทบาท</StyledDivider>
          <Collapse items={choosePermission} />
        </div>
      </div>

      {/* renderAllExpense */}
      {rederDialogConfirmDeleteExpense()}
      {rederDialogConfirmApproveExpense()}

      {/* renderAllProduct */}
      {rederDialogConfirmApproveTypeProduct()}
      {rederDialogConfirmDeleteTypeProduct()}
      {rederDialogConfirmApproveCatagory()}
      {rederDialogConfirmDeleteCatagory()}
      {rederDialogConfirmApproveProduct()}
      {rederDialogConfirmDeleteProduct()}
      {/* renderBooking */}
      {rederDialogConfirmApproveBooking()}
      {rederDialogConfirmDeleteBooking()}
      <CircleLoading open={isBinLoading} />
    </div>
  );
};

export default BinAdminPage;
