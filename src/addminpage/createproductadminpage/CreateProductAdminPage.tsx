import { useCallback, useEffect, useState } from "react";
import {
  Category,
  PRICE_TYPE,
  Product,
  ProductDetail,
  ProductType,
} from "../../model/product.type";
import "./CreateProductAdminPage.css";
import { CloseCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Select } from "antd";
import { mockCategories } from "../../data/MockUpProduct";

const initProductDetail: ProductDetail = {
  type: PRICE_TYPE.STANDARD,
  price: 0,
};

const initProductForm: Product = {
  name: "",
  catagory: {
    name: "",
    code: "",
  },
  productDetails: [initProductDetail],
  detail: "",
  productType: ProductType.KATS,
};

const CreateProductAdminPage = () => {
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([
    initProductDetail,
  ]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const navigate = useNavigate();

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: initProductForm,
  });

  const fetchcategoriesData = useCallback(() => {
    try {
      setCategories(mockCategories);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchcategoriesData();
  }, [fetchcategoriesData]);

  const onSubmit = (value: Product) => {
    const findedCatagory = categories.find(
      (item) => item._id === value.catagory._id
    );

    const body: Product = {
      ...value,
      catagory: findedCatagory || value.catagory,
    };

    console.log(body);
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
        <h1>Create Product</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="btn-createproductAdmin">
          <button
            type="button"
            onClick={() => {
              navigate("/admin/product");
            }}
          >
            ย้อนกลับ
          </button>
          <button type="submit">ยืนยัน</button>
        </div>

        <div className="wrap-container-createproductAdmin">
          <div className="inputNameProduct">
            <h2>ชื่อสินค้า</h2>
            <Controller
              control={control}
              name="name"
              render={({ field }) => {
                return <input {...field} type="text" />;
              }}
            />
          </div>

          <div className="inputCatagory">
            <h2>ประเภทสินค้า</h2>

            <Controller
              control={control}
              name="catagory._id"
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    placeholder="เลือกสินค้า"
                    className="select-product"
                    value={field.value || undefined}
                  >
                    {categories.map((item) => (
                      <Select.Option key={item._id} value={item._id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                );
              }}
            />
          </div>

          <div className="inputTypeProduct">
            <h2>แบรนด์สินค้า</h2>

            <Controller
              control={control}
              name="productType"
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    placeholder="เลือกแบรน"
                    className="select-product"
                    value={field.value || undefined}
                  >
                    <Select.Option value={ProductType.KATS}>KATS</Select.Option>
                    <Select.Option value={ProductType.GUN}>GUN</Select.Option>
                  </Select>
                );
              }}
            />
          </div>

          <div className="inputDetailProduct">
            <button
              type="button"
              onClick={() => {
                setProductDetails([...productDetails, initProductDetail]);
              }}
            >
              เพิ่มราคา
            </button>

            {productDetails.map((detail, index) => {
              return (
                <div key={index} className="inputDetailProduct-inside">
                  <Controller
                    control={control}
                    name={`productDetails.${index}.type`}
                    defaultValue={detail.type}
                    render={({ field }) => {
                      return (
                        <Select
                          {...field}
                          placeholder="เลือกเกรด"
                          className="select-product"
                          value={field.value || undefined}
                        >
                          <Select.Option value={PRICE_TYPE.STANDARD}>
                            standard
                          </Select.Option>
                          <Select.Option value={PRICE_TYPE.LUXURY}>
                            luxury
                          </Select.Option>
                        </Select>
                      );
                    }}
                  />

                  <Controller
                    control={control}
                    name={`productDetails.${index}.price`}
                    defaultValue={detail.price}
                    render={({ field }) => {
                      return <input {...field} type="text" />;
                    }}
                  />

                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const filteredProductDetails = productDetails.filter(
                          (_, indexDetail) => index !== indexDetail
                        );
                        setProductDetails(filteredProductDetails);
                        setValue("productDetails", filteredProductDetails);
                      }}
                    >
                      ลบ
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {rederDialogConfirm()}
      </form>
    </div>
  );
};

export default CreateProductAdminPage;
