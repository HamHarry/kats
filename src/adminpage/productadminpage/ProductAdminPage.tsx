import { Table, Typography } from "antd";
import "./ProductAdminPage.css";
import {
  Catagory,
  PRICE_TYPE,
  Product,
  ProductDetail,
} from "../../model/product.type";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../stores/store";
import { getAllProducts } from "../../stores/slices/productSlice";
import CircleLoading from "../../shared/circleLoading";

const ProductAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductLoading, setIsProductLoading] = useState<boolean>(false);

  const fetchAllProduct = useCallback(async () => {
    try {
      setIsProductLoading(true);
      const { data: productsRes = [] } = await dispath(
        getAllProducts()
      ).unwrap();

      setProducts(productsRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsProductLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllProduct();
  }, [fetchAllProduct]);

  const columns = [
    { title: "ชื่อสินค้า", dataIndex: "name", key: "name" },
    {
      title: "ลักษณะสินค้า",
      dataIndex: "catagory",
      key: "catagory",
      render: (catagory: Catagory) => {
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
          style={{
            border: "2px solid #2656a2",
            borderRadius: "10px",
          }}
        />
      </div>
      <CircleLoading open={isProductLoading} />
    </div>
  );
};

export default ProductAdminPage;
