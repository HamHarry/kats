import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import "./LoginPageGun.css";
import { useAppDispatch } from "../stores/store";
import { login, restoreProfile } from "../stores/slices/authSlice";
import CircleLoading from "../shared/circleLoading";

const schema = yup.object({
  email: yup.string().required("กรุณากรอก Email"),
  password: yup.string().required("กรุณากรอกรหัสผ่าน"),
});

export interface LoginForm {
  email: string;
  password: string;
}

const defaultValues: LoginForm = {
  email: "",
  password: "",
};

const LoginPageGun = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);

  const submit = async (value: LoginForm) => {
    try {
      setIsLoginLoading(true);
      await dispatch(login({ ...value })).unwrap();
      await dispatch(restoreProfile());
      navigate("/admin/dashboard");
    } catch (error) {
      alert("Email หรือรหัสผ่านไม่ถูกต้อง");
      console.log(error);
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <div className="page-login-gun">
      <div className="container-login-gun">
        {/* Brand Header */}
        <div className="login-brand">
          <h1>Gun Protection</h1>
        </div>

        {/* Form Card */}
        <div className="wrap-login-gun">
          <form onSubmit={handleSubmit(submit)}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <>
                  <label className="field-label">Email</label>
                  <input {...field} type="text" placeholder="กรอก Email..." />
                  <p className="error">{errors.email?.message}</p>
                </>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <>
                  <label className="field-label">Password</label>
                  <input
                    {...field}
                    type="password"
                    placeholder="กรอกรหัสผ่าน..."
                  />
                  <p className="error">{errors.password?.message}</p>
                </>
              )}
            />

            <div className="btn-gun">
              <button type="submit" className="btn-login-gun">
                <span>เข้าสู่ระบบ</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <CircleLoading open={isLoginLoading} />
    </div>
  );
};

export default LoginPageGun;
