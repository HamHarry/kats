import { useNavigate } from "react-router-dom";
import "./CreateTypeProductPage.css";
import { Catagory } from "../../model/product.type";
import { Controller, useForm } from "react-hook-form";

const initCatagoryForm: Catagory = {
  name: "",
  code: "",
};
const CreateTypeProductPage = () => {
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    defaultValues: initCatagoryForm,
  });

  const onSubmit = (value: Catagory) => {
    const item = {
      ...value,
    };
    console.log(item);
  };
  return (
    <div className="container-TypeProduct">
      <div className="header-TypeProduct">
        <h1>Create TypeProduct</h1>
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

        <div className="wrap-container-createproductTypeProduct">
          <div className="inputNameTypeProduct">
            <h2>ชื่อลักษณะสินค้า</h2>
            <Controller
              control={control}
              name="name"
              render={({ field }) => {
                return <input {...field} type="text" />;
              }}
            />
          </div>

          <div className="inputCodeProduct">
            <h2>Code สินค้า</h2>
            <Controller
              control={control}
              name="code"
              render={({ field }) => {
                return <input {...field} type="text" />;
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTypeProductPage;
