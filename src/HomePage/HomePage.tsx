import "./HomePage.css";
const HomePage = () => {
  return (
    <div className="Container-HomePage">
      <div className="Header">
        <img src="/public/assets/katoon.png" alt="katoon" />
        <h1>
          ยินดีต้อนรับ <br />
          ศูนย์พ่นกันสนิม KATS Coating สาขาลาดกระบัง
        </h1>
      </div>
      <div className="Center">
        <div className="Center-left">
          <h3>
            หากคุณกำลังมองหาการดูแลช่วงล่างรถยนต์..
            <br />
            มีคำถามในใจ...พ่นกันสนิมมีกี่แบบ...
            <br />
            ทำไมแพง...ทำไมถูก...ต่างกันยังไง...
            <br />
            อันไหนดี...เหมือนกันไหม...
            <br />
            นำเข้าจากอเมริกามีแบรนด์เดียวในไทยได้รับมาตรฐาน
            <br />
            ISO/TS16949 อุตสาหกรรมยานยนต์ให้การรับรอง
            <br />
            ร้านเปิด 8:00 - 18:00
            <br />
            หยุดทุกวันพุธ
          </h3>
          <div className="Btn">
            <button className="Btn-product">แนะนำสินค้า</button>
            <button className="Btn-map">แผนที่</button>
            <button className="Btn-order">ตรวจสอบคิว</button>
          </div>
        </div>

        <div className="Center-right"></div>
      </div>
    </div>
  );
};

export default HomePage;
