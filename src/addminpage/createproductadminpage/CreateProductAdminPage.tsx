import { useState } from "react";
import { PRICE_TYPE, ProductDetail } from "../../model/product.type";
import "./CreateProductAdminPage.css";

const initProductDetail: ProductDetail = {
  type: PRICE_TYPE.STANDARD,
  price: 0,
};
const CreateProductAdminPage = () => {
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);

  // เพิ่มข้อมูล
  const addProductDetails = () => {
    setProductDetails([...productDetails, initProductDetail]);
  };

  return (
    <div className="container-createproductAdmin">
      <div className="header-createproductAdmin">
        <h1>สร้างสินค้า</h1>
      </div>

      <div className="content-createproductAdmin">
        <div className="input-createproduct">
          <input type="text" placeholder="ชื่อสินค้า" />
          <input type="text" placeholder="ลักษณะสินค้า" />
          <input type="text" placeholder="ราคาสินค้า" />
        </div>
        <div className="btn-submit">
          <button>สร้าง</button>
        </div>
      </div>
    </div>
  );
};

export default CreateProductAdminPage;
