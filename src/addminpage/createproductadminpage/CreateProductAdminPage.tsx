import { useState } from "react";
import { PRICE_TYPE, ProductDetail } from "../../model/product.type";
import "./CreateProductAdminPage.css";
import { CloseCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const initProductDetail: ProductDetail = {
  type: PRICE_TYPE.STANDARD,
  price: 0,
};
const CreateProductAdminPage = () => {
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const navigate = useNavigate();

  // เพิ่มข้อมูล
  const addProductDetails = () => {
    setProductDetails([...productDetails, initProductDetail]);
  };

  const rederDialogConfirm = () => {
    return (
      <dialog open={openDialogConfirm}>
        <div className="container-DialogConfirm">
          <div className="wrap-container-DialogConfirm">
            <div className="container-DialogConfirm-Navbar">
              <CloseCircleFilled
                className="icon-close"
                onClick={() => {
                  setOpenDialogConfirm(false);
                }}
              />
            </div>
            <h1>ยืนยันการจอง</h1>
            <div className="btn-DialogConfirm-Navbar">
              <button type="submit" className="btn-submit-dialogConfirm">
                ยืนยัน
              </button>
              <button
                className="btn-edit-dialogConfirm"
                onClick={() => {
                  setOpenDialogConfirm(false); //ส่งข้อมูล
                }}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </dialog>
    );
  };

  return (
    <div className="container-createproductAdmin">
      <div className="header-createproductAdmin">
        <h1>Create Booking</h1>
      </div>

      <form>
        <div className="btn-createproductAdmin">
          <button
            type="button"
            onClick={() => {
              navigate("/admin/product");
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
        <div className="wrap-container-createproductAdmin">
          <div className="inputNameProduct">
            <h2>ชื่อสินค้า</h2>
            <input type="text" />
          </div>

          <div className="inputTypeProduct">
            <h2>ลักษณะสินค้า</h2>
            <input type="text" />
          </div>

          <div className="inputPriceProduct">
            <h2>ราคาสินค้า</h2>
            <input type="text" />
          </div>
        </div>
        {rederDialogConfirm()}
      </form>
    </div>
  );
};

export default CreateProductAdminPage;
