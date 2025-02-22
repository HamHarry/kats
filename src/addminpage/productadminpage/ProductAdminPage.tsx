import "./ProductAdminPage.css";

const ProductAdminPage = () => {
  return (
    <div className="container-productAdmin">
      <div className="header-productAdmin">
        <h1>Product</h1>
      </div>

      <div className="create-product">
        <h1>สร้างสินค้า</h1>

        <div className="input-product-content">
          <div className="input-product">
            <p>ชื่อสินค้า</p>
            <input type="text" placeholder="ProductName..." />
          </div>
          <div className="input-product">
            <p>ลักษณะสินค้า</p>
            <input type="text" placeholder="ProductType..." />
          </div>
          <div className="input-product">
            <p>ราคาสินค้า</p>
            <input type="number" placeholder="ProductPrice..." />
          </div>
          <div className="btn-create-product">
            <button>สร้างสินค้า</button>
          </div>
        </div>
      </div>

      <div className="show-price"></div>
    </div>
  );
};

export default ProductAdminPage;
