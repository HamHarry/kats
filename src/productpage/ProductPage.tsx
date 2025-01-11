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
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
