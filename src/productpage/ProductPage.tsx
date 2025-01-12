import "./ProductPage.css";
const ProductPage = () => {
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
            <div className="list-product-box1">
              <div className="product-content-box1">
                <i className="fa-solid fa-car-side"></i>
                <h4>รถเก๋ง</h4>
                <p>น้ำยาดำเงาทั้งคัน</p>
                <p>น้ำยาดำเงาและใสเงา (แยกน้ำยาแบบโรงงาน)</p>
                <h4>ราคา 4,900 บาท</h4>
              </div>
              <button>ตัวอย่าง</button>
            </div>
            <div className="list-product-box2">
              <div className="product-content-box2">
                <i className="fa-solid fa-truck-pickup"></i>
                <h4>รถกระบะ</h4>
                <p>น้ำยาดำเงาทั้งคัน</p>
                <p>น้ำยาดำเงาและใสเงา (แยกน้ำยาแบบโรงงาน)</p>
                <h4>ราคา 4,900 บาท</h4>
              </div>
              <button>ตัวอย่าง</button>
            </div>
            <div className="list-product-box3">
              <div className="product-content-box3">
                <i className="fa-solid fa-truck-field"></i>
                <h4>รถ SUV</h4>
                <p>น้ำยาดำเงาทั้งคัน</p>
                <p>น้ำยาดำเงาและใสเงา (แยกน้ำยาแบบโรงงาน)</p>
                <h4>ราคา 4,900 บาท</h4>
              </div>
              <button>ตัวอย่าง</button>
            </div>
            <div className="list-product-box4">
              <div className="product-content-box4">
                <i className="fa-solid fa-van-shuttle"></i>
                <h4>รถตู้</h4>
                <p>น้ำยาดำเงาทั้งคัน</p>
                <p>น้ำยาดำเงาและใสเงา (แยกน้ำยาแบบโรงงาน)</p>
                <h4>ราคา 6,000 บาท</h4>
              </div>
              <button>ตัวอย่าง</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
