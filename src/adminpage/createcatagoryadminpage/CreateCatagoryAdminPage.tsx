import "./CreateCategoryAdminPage.css";
import { Controller, useForm } from "react-hook-form";
import { CatagoryData } from "../../model/product.type";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../stores/store";
import {
  createCatagory,
  getCatagoryById,
  updateCatagoryById,
} from "../../stores/slices/productSlice";
import { useCallback, useEffect } from "react";
import { DeleteStatus } from "../../model/delete.type";

const initCatagoryForm: CatagoryData = {
  name: "",
  code: "",
  delete: DeleteStatus.ISNOTDELETE,
};

const CreateCatagoryAdminPage = () => {
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const { catagoryId } = useParams();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: initCatagoryForm,
  });

  const initailForm = useCallback(async () => {
    try {
      if (!catagoryId) return;

      const { data } = await dispath(getCatagoryById(catagoryId)).unwrap();
      const catagoryRes = data as CatagoryData;

      const initBookingForm: CatagoryData = {
        name: catagoryRes.name ?? "",
        code: catagoryRes.code ?? "",
        delete: catagoryRes.delete ?? DeleteStatus.ISNOTDELETE,
      };

      reset(initBookingForm);
    } catch (error) {
      console.log(error);
    }
  }, [catagoryId, dispath, reset]);

  useEffect(() => {
    initailForm();
  }, [initailForm]);

  const onSubmit = async (value: CatagoryData) => {
    try {
      const item = {
        ...value,
      };

      if (catagoryId) {
        // แก้ไข
        const body = {
          data: item,
          catagoryId,
        };
        await dispath(updateCatagoryById(body)).unwrap();

        navigate("/admin/catagory");
      } else {
        // สร้าง
        await dispath(createCatagory(item)).unwrap();

        navigate("/admin/catagory");
      }
    } catch (error) {
      console.log(error);
    }
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
          <button type="submit">ยืนยัน</button>
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
