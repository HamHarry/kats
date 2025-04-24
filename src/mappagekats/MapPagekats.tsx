import { Typography } from "antd";
import "./MapPagekats.css";
const MapPageKats = () => {
  return (
    <div className="container-MapPageKats">
      <div className="header-MapPageKats">
        <img src="/assets/katoon.png" alt="katoon" />
        <Typography className="text-header">แผนที่</Typography>
      </div>
      <div className="container-map">
        <img src="/assets/map1.png" alt="map" />
        <button
          onClick={() => {
            window.open(
              "https://www.google.com/maps/place/%E0%B8%A8%E0%B8%B9%E0%B8%99%E0%B8%A2%E0%B9%8C%E0%B8%9E%E0%B9%88%E0%B8%99%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B8%AA%E0%B8%99%E0%B8%B4%E0%B8%A1%E0%B8%A3%E0%B8%96%E0%B8%A2%E0%B8%99%E0%B8%95%E0%B8%A3%E0%B9%8C+KATS+Coatings+%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%B2%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B9%8C/@13.5987354,100.6863939,14z/data=!4m6!3m5!1s0x311d5f2ec0d6d80f:0xe42c9067c9826cb!8m2!3d13.6073104!4d100.6883421!16s%2Fg%2F11tn7hqyqn?entry=ttu&g_ep=EgoyMDI1MDEwOC4wIKXMDSoASAFQAw%3D%3D"
            );
          }}
        >
          Google Map
        </button>
      </div>
    </div>
  );
};

export default MapPageKats;
