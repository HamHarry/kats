import { useState } from "react";
import "./ProductPage.css";
import { mockUpPrice } from "../data/MockUpPrice";

export interface ListPrice {
  id: number;
  carType: string;
  icon: string;
  content1: string;
  content2: string;
  price: number;
}

const ProductPage = () => {
  const [openDialogPrice, setOpenDialogPrice] = useState<boolean>(false);
  const [dataPrice] = useState<ListPrice[]>(mockUpPrice);
  const [dataDialog, setDataDialog] = useState<ListPrice>();

  const rederDialogPrice = () => {
    return (
      <dialog open={openDialogPrice}>
        <div className="container-DialogPrice">
          {dataDialog && (
            <div className="wrap-container-DialogPrice">
              <div className="container-DialogPrice-Navbar">
                <h3>ตัวอย่างพ่นกันสนิม{dataDialog.carType}</h3>
                <i
                  className="fa-solid fa-circle-xmark"
                  onClick={() => {
                    setOpenDialogPrice(!openDialogPrice);
                  }}
                ></i>
              </div>
            </div>
          )}
        </div>
      </dialog>
    );
  };

  return (
    <div className="container-productpage">
      <div className="header-productpage">
        <img src="/public/assets/katoon.png" alt="katoon" />
        <h1>
          สินค้า <br />
          ศูนย์พ่นกันสนิม KATS Coating สาขาลาดกระบัง
        </h1>
      </div>
      <div className="container-prodoct">
        <div className="container-list-product">
          <h1>
            สินค้า <br />
            รับประกัน 5 ปี
          </h1>
          <div className="line">
            <div className="line-horizontal"></div>
            <div className="verticals">
              <div className="line-vertical1"></div>
              <div className="line-vertical2"></div>
              <div className="line-vertical3"></div>
              <div className="line-vertical4"></div>
            </div>
          </div>
          <div className="container-list-product-box">
            {dataPrice.map((item, index) => {
              return (
                <div key={index} className="list-product-box">
                  <div className="product-content-box">
                    <i className={item.icon}></i>
                    <h4>{item.carType}</h4>
                    <p>{item.content1}</p>
                    <p>{item.content2}</p>
                    <h4>ราคา {item.price} บาท</h4>
                  </div>
                  <button
                    onClick={() => {
                      setOpenDialogPrice(!openDialogPrice);
                      setDataDialog(item);
                    }}
                  >
                    ตัวอย่าง
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {rederDialogPrice()}
    </div>
  );
};

export default ProductPage;
