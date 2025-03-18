import "./CreateCategoryAdminPage.css";
import { Controller, useForm } from "react-hook-form";
import { Catagory } from "../../model/product.type";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../stores/store";
import { createCatagory } from "../../stores/slices/productSlice";

const initCatagoryForm: Catagory = {
  name: "",
  code: "",
};

const CreateCatagoryAdminPage = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();

  const { control, handleSubmit } = useForm({
    defaultValues: initCatagoryForm,
  });

  const onSubmit = async (value: Catagory) => {
    const body: Catagory = {
      ...value,
    };

    await dispath(createCatagory(body));
  };

  return (
    <div className="container-createcategoryAdmin">
      <div className="header-createcategoryAdmin">
        <h1>Create Category</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="btn-createcategoryAdmin">
          <button
            type="button"
            onClick={() => {
              navigate("/admin/catagory");
            }}
          >
            ย้อนกลับ
          </button>
          <button
            type="submit"
            onClick={() => {
              navigate("/admin/catagory");
            }}
          >
            ยืนยัน
          </button>
        </div>

        <div className="wrap-container-createcategoryAdmin">
          <div className="inputNameCategory">
            <h2>ชื่อหมวดหมู่</h2>
            <Controller
              control={control}
              name="name"
              render={({ field }) => {
                return <input {...field} type="text" />;
              }}
            />
          </div>

          <div className="inputCodeCatagory">
            <h2>Code หมวดหมู่</h2>

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

export default CreateCatagoryAdminPage;
