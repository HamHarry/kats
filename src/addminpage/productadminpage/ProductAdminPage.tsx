import { Input, Table, Typography } from "antd";
import "./ProductAdminPage.css";
import { mockUpProducts } from "../../data/MockUpProduct";
import { Category, PRICE_TYPE, ProductDetail } from "../../model/product.type";

const ProductAdminPage = () => {
  const columns = [
    { title: "ลำดับ", dataIndex: "id", key: "_id" },
    { title: "ชื่อสินค้า", dataIndex: "name", key: "name" },
    {
      title: "ลักษณะสินค้า",
      dataIndex: "catagory",
      key: "catagory",
      render: (catagory: Category) => {
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
                  <Typography>{productDetail.price}</Typography>
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
        <h1>สินค้า</h1>
      </div>

      <div className="create-product">
        <div className="input-product-content">
          <div className="input-product">
            <p>ชื่อสินค้า</p>
            <Input placeholder="ProductName..." />
          </div>
          <div className="input-product">
            <p>ลักษณะสินค้า</p>
            <Input placeholder="ProductType..." />
          </div>
          <div className="input-product">
            <p>ราคาสินค้า</p>
            <Input placeholder="ProductPrice..." />
          </div>
          <div className="btn-create-product">
            <button>สร้างสินค้า</button>
          </div>
        </div>
      </div>

      <div className="product-content" style={{ width: "100%" }}>
        <Table
          dataSource={mockUpProducts}
          columns={columns}
          style={{
            border: "2px solid #2656a2",
            borderRadius: "10px",
          }}
        />
      </div>
    </div>
  );
};

export default ProductAdminPage;
