import { useCallback, useEffect, useState } from "react";
import {
  CatagoryData,
  PRICE_TYPE,
  ProductData,
  ProductDetail,
  TypeProductData,
} from "../../model/product.type";
import "./CreateProductAdminPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Select } from "antd";
import {
  createProduct,
  getAllCatagories,
  getAllTypeProduct,
  getProductById,
  updateProductById,
} from "../../stores/slices/productSlice";
import { useAppDispatch } from "../../stores/store";
import CircleLoading from "../../shared/circleLoading";
import { DeleteStatus } from "../../model/delete.type";

const initProductDetail: ProductDetail = {
  type: PRICE_TYPE.STANDARD,
  amount: 0,
};

interface ProductDataForm extends Omit<ProductData, "catagory" | "typeProduct"> {}

const initProductForm: ProductDataForm = {
  name: "",
  productDetails: [initProductDetail],
  detail: "",
  catagoryId: "",
  delete: DeleteStatus.ISNOTDELETE,
  typeProductId: "",
};

const CreateProductAdminPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();

  const [categories, setCategories] = useState<CatagoryData[]>([]);
  const [typeProduct, setTypeProduct] = useState<TypeProductData[]>([]);

  const [isProductLoading, setIsProductLoading] = useState<boolean>(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: initProductForm,
  });

  const initailForm = useCallback(async () => {
    try {
      if (!productId) return;

      const { data } = await dispath(getProductById(productId)).unwrap();
      const productRes = data as ProductData;

      const initBookingForm: ProductData = {
        name: productRes.name ?? "",
        catagory: productRes.catagory ?? [],
        catagoryId: productRes.catagoryId ?? "",
        productDetails: productRes.productDetails ?? [],
        detail: productRes.detail ?? "",
        typeProduct: productRes.typeProduct ?? [],
        delete: productRes.delete ?? DeleteStatus.ISNOTDELETE,
        typeProductId: productRes.typeProductId ?? "",
      };

      reset(initBookingForm);
    } catch (error) {
      console.log(error);
    }
  }, [dispath, productId, reset]);

  useEffect(() => {
    initailForm();
  }, [initailForm]);

  const productDetailFields = useFieldArray({
    name: "productDetails",
    control,
  });

  const fetchCategoriesData = useCallback(async () => {
    try {
      setIsProductLoading(true);

      const { data: catagoriesRes = [] } = await dispath(getAllCatagories()).unwrap();

      const filteredCatagories = catagoriesRes.filter(
        (item: CatagoryData) => item.delete === DeleteStatus.ISNOTDELETE
      );

      setCategories(filteredCatagories);
    } catch (error) {
      console.log(error);
    } finally {
      setIsProductLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData]);

  const fetchTypeProductData = useCallback(async () => {
    try {
      setIsProductLoading(true);

      const { data: TypeProductRes = [] } = await dispath(getAllTypeProduct()).unwrap();

      setTypeProduct(TypeProductRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsProductLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchTypeProductData();
  }, [fetchTypeProductData]);

  const onSubmit = async (value: ProductDataForm) => {
    try {
      const item = {
        ...value,
      };

      if (productId) {
        // แก้ไข
        const body = {
          data: item,
          productId,
        };
        await dispath(updateProductById(body)).unwrap();

        navigate("/admin/product");
      } else {
        // สร้าง
        await dispath(createProduct(item)).unwrap();

        navigate("/admin/product");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveproductDetail = useCallback(
    (index: number) => {
      if (!productDetailFields?.fields?.length) return;
      if (productDetailFields.fields.length === 1) return;

      productDetailFields.remove(Number(index));
    },
    [productDetailFields]
  );

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
              name="catagoryId"
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
              name="typeProductId"
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    placeholder="เลือกแบรน"
                    className="select-product"
                    value={field.value || undefined}
                  >
                    {typeProduct.map((item) => (
                      <Select.Option key={item._id} value={item._id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                );
              }}
            />
          </div>

          <div className="inputDetailProduct">
            <div>
              <button
                type="button"
                onClick={() => {
                  if (productDetailFields?.fields.length === 6) return;

                  productDetailFields.append(initProductDetail);
                }}
              >
                เพิ่มราคา
              </button>
            </div>

            {productDetailFields.fields.map((detail, index) => {
              return (
                <div key={`${detail.id}_${index}`} className="inputDetailProduct-inside">
                  <Controller
                    control={control}
                    name={`productDetails.${index}.type`}
                    render={({ field }) => {
                      return (
                        <Select
                          {...field}
                          placeholder="เลือกเกรด"
                          className="select-product"
                          value={field.value || undefined}
                        >
                          <Select.Option value={PRICE_TYPE.STANDARD}>standard</Select.Option>
                          <Select.Option value={PRICE_TYPE.LUXURY}>luxury</Select.Option>
                        </Select>
                      );
                    }}
                  />

                  <Controller
                    control={control}
                    name={`productDetails.${index}.amount`}
                    render={({ field }) => {
                      return (
                        <input
                          {...field}
                          className="input-prices"
                          type="text"
                          onChange={(event) => {
                            const value = event.target.value.replace(/[^0-9.]/g, "");
                            const validated = value.match(/^(\d*\.{0,1}\d{0,2}$)/);
                            if (validated) {
                              field.onChange(Number(value));
                            }
                          }}
                        />
                      );
                    }}
                  />

                  {index !== 0 && (
                    <button type="button" onClick={() => handleRemoveproductDetail(index)}>
                      ลบ
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </form>

      <CircleLoading open={isProductLoading} />
    </div>
  );
};

export default CreateProductAdminPage;
