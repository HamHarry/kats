import { useState } from "react";
import "./GunGuardPage.css";
import { MockUpValues } from "../data/MockUpValues";
import { MockUpCompare } from "../data/MockUpCompare";
const GunGuardPage = () => {
  const [dataValues] = useState(MockUpValues);
  const [datacompare] = useState(MockUpCompare);
  return (
    <div className="container-GuardPage" id="GunGuard">
      <div className="content-guard">
        <div className="content-guard-inside">
          <div className="header-GuardPage">
            <h1>Gun Guard</h1>
          </div>

          <div className="text-box">
            <p>
              <span>GUN PROTECTION GUARD</span>
              <br />
              ฉนวนชนิดหนึ่งเป็นวัสดุ Geo Polymer Microsphere ซึ่งมีความแตกต่าง
              <br />
              กับฉนวนที่มีอยู่ในท้องตลอดปัจจุบัน
              และพัฒนาขึ้นมาด้วยแนวคิดเพื่อเป็นสินค้า
              <br />
              ในรูปแบบ Green Technology โดยมีตัวทำละลายเป็น Water Base
              <br />
              Gun Guard ถูกคิดค้น วิจัย
              และพัฒนาโดยทีมงานผู้เชี่ยวชาญด้านเคมีภัณฑ์
              <br />
              ที่มีประสบการณ์มากกว่า 30 ปี ในอุตสหกรรมด้านเคมีอุตสาหกรรม
            </p>
          </div>
        </div>

        <div className="image-guard">
          <img src="/public/assets/gun/gun2.jpg" alt="image" />
          <img src="/public/assets/gun/gun3.jpg" alt="image" />
        </div>

        <video
          src="/public/assets/gun/roof/gunguard.mov"
          autoPlay
          loop
          muted
          controls
        />
      </div>

      <div className="header-GuardPage">
        <h1>Velues</h1>
      </div>

      <div className="container-values">
        <div className="crad-values">
          {dataValues.map((item, index) => {
            return (
              <div key={index} className="crad-value">
                <img src={item.image} alt="image" />
                <h2>{item.header}</h2>
                <p>{item.detal}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="header-GuardPage">
        <h1>Compare</h1>
      </div>

      <div className="container-compare">
        <table>
          {datacompare.map((item, index) => {
            return (
              <tbody key={index}>
                <tr>
                  <th>{item.header}</th>
                </tr>
                <tr>
                  <td>{item.detel1}</td>
                </tr>
                <tr>
                  <td>{item.detel2}</td>
                </tr>
                <tr>
                  <td>{item.detel3}</td>
                </tr>
                <tr>
                  <td>{item.detel4}</td>
                </tr>
                <tr>
                  <td>{item.detel5}</td>
                </tr>
                <tr>
                  <td>{item.detel6}</td>
                </tr>
                <tr>
                  <td>{item.detel7}</td>
                </tr>
                <tr>
                  <td>{item.detel8}</td>
                </tr>
                <tr>
                  <td>{item.detel9}</td>
                </tr>
                <tr>
                  <td>{item.detel10}</td>
                </tr>
                <tr>
                  <td>{item.detel11}</td>
                </tr>
                <tr>
                  <td>{item.detel12}</td>
                </tr>
                <tr>
                  <td>{item.detel13}</td>
                </tr>
                <tr>
                  <td>{item.detel14}</td>
                </tr>
                <tr>
                  <td>{item.detel15}</td>
                </tr>
                <tr>
                  <td>{item.detel16}</td>
                </tr>
                <tr>
                  <td>{item.detel17}</td>
                </tr>
                <tr>
                  <td>{item.detel18}</td>
                </tr>
                <tr>
                  <td>{item.detel19}</td>
                </tr>
                <tr>
                  <td>{item.detel20}</td>
                </tr>
                <tr>
                  <td>{item.detel21}</td>
                </tr>
                <tr>
                  <td>{item.detel22}</td>
                </tr>
                <tr>
                  <td>{item.detel23}</td>
                </tr>
                <tr>
                  <td>{item.detel24}</td>
                </tr>
                <tr>
                  <td>{item.detel25}</td>
                </tr>
                <tr>
                  <td>{item.detel26}</td>
                </tr>
                <tr>
                  <td>{item.detel27}</td>
                </tr>
                <tr>
                  <td>{item.detel28}</td>
                </tr>
                <tr>
                  <td>{item.detel29}</td>
                </tr>
                <tr>
                  <td>{item.detel30}</td>
                </tr>
                <tr>
                  <td>{item.detel31}</td>
                </tr>
                <tr>
                  <td>{item.detel32}</td>
                </tr>
                <tr>
                  <td>{item.detel33}</td>
                </tr>
                <tr>
                  <td>{item.detel34}</td>
                </tr>
                <tr>
                  <td>{item.detel35}</td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default GunGuardPage;
