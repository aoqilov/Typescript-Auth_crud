import React from "react";
import { Button, Form, Input } from "antd";
import mainBgImage from "../assets/mainBg.jpg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postDataLogin } from "../api/api";
import { openNotification } from "../components/uiNotification";
import { useNavigate } from "react-router-dom";

// Login formasi uchun interfeys
interface LoginFormValues {
  login: string;
  password: string;
}

const Login: React.FC = () => {
  // Router navigatsiya
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // useMutation hook
  const { mutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: (dataLogin: LoginFormValues) =>
      postDataLogin("/api/auths/sign-in", dataLogin),
    onSuccess: (res: any) => {
      console.log(res);

      if (res.status === 400) {
        openNotification("error", "Xatolik yuz berdi");
      } else {
        openNotification("success", "Login success");
        navigate("/");
      }
      queryClient.invalidateQueries({ queryKey: ["login"] });
    },
    onError: (error: any) => {
      openNotification("error", error.message);
      queryClient.invalidateQueries({ queryKey: ["login"] });
    },
  });

  const handleFinish = (values: LoginFormValues) => {
    mutate(values);
  };

  return (
    <div
      className="flex items-center justify-center bg-no-repeat bg-cover bg-bottom min-w-screen min-h-screen"
      style={{
        backgroundImage: `url(${mainBgImage})`,
      }}
    >
      <div className="bg-white shadow-lg p-6 rounded-lg max-w-[462px] w-full">
        <h1 className="text-2xl font-bold text-left mb-6">Вход</h1>
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item<LoginFormValues>
            label="Логин"
            name="login"
            rules={[{ required: true, message: "Введите логин" }]}
          >
            <Input placeholder="Введите логин" />
          </Form.Item>
          <Form.Item<LoginFormValues>
            label="Пароль"
            name="password"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password placeholder="Введите пароль" />
          </Form.Item>
          <div className="text-left mb-4">
            <a href="/signin" className="text-sm text-blue-500 hover:underline">
              Регистрация
            </a>
          </div>
          <div className="text-center">
            <Button type="primary" htmlType="submit">
              вход
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
