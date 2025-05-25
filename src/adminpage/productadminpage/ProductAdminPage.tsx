import { Modal, Space, Table, Typography } from "antd";
import "./ProductAdminPage.css";
import {
  CatagoryData,
  PRICE_TYPE,
  ProductData,
  ProductDetail,
} from "../../model/product.type";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../stores/store";
import {
  getAllProducts,
  isDeleteProductById,
} from "../../stores/slices/productSlice";
import CircleLoading from "../../shared/circleLoading";
import { DeleteStatus } from "../../model/delete.type";

const ProductAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isProductLoading, setIsProductLoading] = useState<boolean>(false);
  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] =
    useState<boolean>(false);
  const [selectedProductData, setSelectedProductData] = useState<ProductData>();

  const fetchAllProduct = useCallback(async () => {
    try {
      setIsProductLoading(true);
      const { data: productsRes = [] } = await dispath(
        getAllProducts()
      ).unwrap();

      const filteredProducts = productsRes.filter((item: ProductData) => {
        return item.delete === DeleteStatus.ISNOTDELETE;
      });

      setProducts(filteredProducts);
    } catch (error) {
      console.log(error);
    } finally {
      setIsProductLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllProduct();
  }, [fetchAllProduct]);

  const deleted = async () => {
    try {
      setIsProductLoading(true);
      if (!selectedProductData?._id) return;

      const body: ProductData = {
        ...selectedProductData,
        delete: DeleteStatus.ISDELETE,
      };

      await dispath(isDeleteProductById(body)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsProductLoading(false);
      setOpenDialogConfirmDelete(false);
      fetchAllProduct();
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
              deleted();
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
    { title: "ชื่อสินค้า", dataIndex: "name", key: "name" },
    {
      title: "ลักษณะสินค้า",
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
            justifyContent: "center",
            alignItems: "center",
            fontSize: "14px",
          }}
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductData(item);
              setOpenDialogConfirmDelete(true);
            }}
          >
            ลบ
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div className="container-productAdmin">
      <div className="header-productAdmin">
        <h1>Products</h1>
      </div>

      <div className="create-product">
        <div className="btn-create-product">
          <button
            onClick={() => {
              navigate("/admin/catagory");
            }}
          >
            โหมดหมู่สินค้า
          </button>
          <button
            onClick={() => {
              navigate("/admin/product/createProduct");
            }}
          >
            สร้างสินค้า
          </button>
        </div>
      </div>

      <div className="product-content" style={{ width: "100%" }}>
        <Table
          dataSource={products}
          columns={columns}
          pagination={{
            pageSize: 5,
          }}
          style={{
            border: "2px solid #2656a2",
            borderRadius: "10px",
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                navigate(`/admin/product/edit/Product/${record._id}`);
              },
            };
          }}
        />
      </div>

      {rederDialogConfirmDelete()}
      <CircleLoading open={isProductLoading} />
    </div>
  );
};

export default ProductAdminPage;
