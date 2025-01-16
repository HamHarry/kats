import { ListPrice } from "../productpage/ProductPage";

export const mockUpPrice: ListPrice[] = [
  {
    id: 1,
    carType: "รถเก๋ง,SUV",
    icon: "fa-solid fa-car-side",
    content1: "- น้ำยาดำเงาทั้งคัน",
    content2: "- น้ำยาดำเงาและใสเงา (แยกน้ำยาแบบโรงงาน)",
    price: 4900,
    carImages: [
      {
        name: "Toyota Corolla Cross",
        imageCar: "/public/assets/cross/cross.jpg",
        images: [
          {
            image: "/public/assets/cross/02.jpg",
          },
          {
            image: "/public/assets/cross/03.jpg",
          },
          {
            image: "/public/assets/cross/04.jpg",
          },
          {
            image: "/public/assets/cross/05.jpg",
          },
          {
            image: "/public/assets/cross/06.jpg",
          },
        ],
      },
      {
        name: "Honda",
      },
    ],
  },
  {
    id: 2,
    carType: "รถกระบะ",
    icon: "fa-solid fa-truck-pickup",
    content1: "- น้ำยาดำเงาทั้งคัน",
    content2: "- น้ำยาดำเงาและใสเงา (แยกน้ำยาแบบโรงงาน)",
    price: 4900,
    carImages: [
      {
        name: "Toyota",
      },
    ],
  },
  {
    id: 3,
    carType: "รถ PPV,MPV",
    icon: "fa-solid fa-truck-field",
    content1: "- น้ำยาดำเงาทั้งคัน",
    content2: "- น้ำยาดำเงาและใสเงา (แยกน้ำยาแบบโรงงาน)",
    price: 4900,
    carImages: [
      {
        name: "Toyota",
      },
    ],
  },
  {
    id: 4,
    carType: "รถตู้",
    icon: "fa-solid fa-van-shuttle",
    content1: "- น้ำยาดำเงาทั้งคัน",
    content2: "- น้ำยาดำเงาและใสเงา (แยกน้ำยาแบบโรงงาน)",
    price: 6000,
    carImages: [
      {
        name: "Toyota",
      },
    ],
  },
];
