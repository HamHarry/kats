/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import "./ProductPageKats.css";
import { mockUpPrice } from "../data/MockUpPrice";

export interface ListCarImage {
  image: string;
}
export interface ListCar {
  name: string;
  imageCar?: string; // รอใส่ข้อมูลครบก่อน
  images?: ListCarImage[]; // รอใส่ข้อมูลครบก่อน
}
export interface ListPrice {
  id: number;
  carType: string;
  icon: string;
  content1: string;
  content2: string;
  price: number;
  carImages: ListCar[];
}

const ProductPageKats = () => {
  const [openDialogPrice, setOpenDialogPrice] = useState<boolean>(false);
  const [dataPrice] = useState<ListPrice[]>(mockUpPrice);
  const [dataDialog, setDataDialog] = useState<ListPrice>();
  const [slideName, setSlideName] = useState<number>(0);
  const [slideImage, setSlideImage] = useState<number>(0);

  const reset = () => {
    setSlideName(0);
    setSlideImage(0);
  };

  const rederDialogPrice = () => {
    const leftSlideImage = (renderImage: any) => {
      const number =
        slideImage === 0 ? (renderImage as any) - 1 : slideImage - 1;
      setSlideImage(number);
    };
    const rightSlideImage = (renderImage: any) => {
      const number =
        slideImage === (renderImage as any) - 1 ? 0 : slideImage + 1;
      setSlideImage(number);
    };

    const leftSlideName = () => {
      const number =
        slideName === 0
          ? (dataDialog?.carImages.length as any) - 1
          : slideName - 1;
      setSlideName(number);
      setSlideImage(0);
    };
    const rightSlideName = () => {
      const number =
        slideName === (dataDialog?.carImages.length as any) - 1
          ? 0
          : slideName + 1;
      setSlideName(number);
      setSlideImage(0);
    };

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
                    reset();
                  }}
                ></i>
              </div>
              <div className="container-DialogPrice-Content">
                <div className="carImages">
                  {dataDialog.carImages.map((item, index) => {
                    const renderImage = item.images?.length;

                    return (
                      <div
                        className={
                          slideName === index
                            ? "sliderName"
                            : "sliderName-hidden"
                        }
                        key={index}
                      >
                        <div className="carName">
                          <i
                            className="fa-solid fa-circle-left"
                            onClick={() => {
                              leftSlideName();
                            }}
                          ></i>
                          <h3>{item.name}</h3>
                          <i
                            className="fa-solid fa-circle-right"
                            onClick={() => {
                              rightSlideName();
                            }}
                          ></i>
                        </div>
                        <img src={item.imageCar} alt="" />
                        <div className="image">
                          {item.images?.map((image, index) => {
                            return (
                              <img
                                key={index}
                                src={image.image}
                                alt="carImage"
                                className={
                                  slideImage === index
                                    ? "sliderImage"
                                    : "sliderImage-hidden"
                                }
                              />
                            );
                          })}
                          <div className="btn-left-right">
                            <i
                              className="fa-solid fa-circle-left"
                              onClick={() => {
                                leftSlideImage(renderImage);
                              }}
                            ></i>
                            <i
                              className="fa-solid fa-circle-right"
                              onClick={() => {
                                rightSlideImage(renderImage);
                              }}
                            ></i>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </dialog>
    );
  };

  return (
    <div className="container-ProductPageKats">
      <div className="header-ProductPageKats">
        <img src="/public/assets/katoon.png" alt="katoon" />
        <h1>
          สินค้า <br />
          รับประกัน 5 ปี (ทุกสินค้า)
        </h1>
      </div>
      <div className="wrap-container-product">
        <div className="container-list-product">
          <div className="line">
            <div className="vertical-herder"></div>
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

export default ProductPageKats;
