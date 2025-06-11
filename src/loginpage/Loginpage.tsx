import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import Cookies from "universal-cookie";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import "./Loginpage.css";
import { useAppDispatch } from "../stores/store";
import { login } from "../stores/slices/authSlice";

const schema = yup.object({
  email: yup.string().required("email or Email is required"),
  password: yup.string().required("Password is required"),
});

export interface LoginForm {
  email: string;
  password: string;
}
const defaultValues: LoginForm = {
  email: "",
  password: "",
};

const LoginPage = () => {
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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  //เมื่อกดปุ่ม login จะพาเข้าไปสู้หน้า Admin ===================================================================
  const submit = async (value: LoginForm) => {
    try {
      const item = {
        ...value,
      };
      showLoading();

      console.log(item);
      navigate("/admin/employee");

      // const { data: loginResponse } = await dispatch(login(item)).unwrap();

      // localStorage.setItem("token", loginResponse.accessToken);

      // navigate(`/core/home`);
    } catch (error) {
      alert("email and password is wrong");
      console.log(error);
    } finally {
      hideLoading();
    }
  };

  return (
    <>
      <div className="container-login">
        <div className="wrap-login">
          <img src="/assets/katoon.png" alt="katoon" />
          <h1>เข้าสู่ระบบ</h1>
          <form onSubmit={handleSubmit(submit)}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => {
                return (
                  <>
                    <h2>Email</h2>
                    <input {...field} type="text" placeholder="Email..." />
                    <p className="error">{errors.email?.message}</p>
                  </>
                );
              }}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => {
                return (
                  <>
                    <h2>Password</h2>
                    <input
                      {...field}
                      type="password"
                      placeholder="Password..."
                    />
                    <p className="error">{errors.password?.message}</p>
                  </>
                );
              }}
            />
            <div className="btn">
              <button type="submit" className="btn-login">
                เข้าสู่ระบบ
              </button>
            </div>
          </form>
        </div>
      </div>
      {isLoading && (
        <div className="wrap-loding-login">
          <div className="loding" />
        </div>
      )}
    </>
  );
};

export default LoginPage;
