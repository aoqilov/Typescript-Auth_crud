import React, { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { openNotification } from "./uiNotification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "../api/api";
import type { FormInstance } from "antd";

// API'ga yuboriladigan ma'lumotlar uchun interface
interface CompanyData {
  name: string;
  count: number;
}

const AddModal: React.FC = () => {
  // STATES
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<CompanyData>();

  // MODAL-METHOD
  const showModal = () => {
    setOpen(true);
  };

  // TANSTACK
  const queryClient = useQueryClient();

  //// POST-MUTATE
  const { mutate } = useMutation({
    mutationKey: ["dataTable"],
    mutationFn: (values: CompanyData) => postData("/api/companies/add", values),
    onSuccess: () => {
      setLoading(false);
      setOpen(false); // Modalni yopish
      queryClient.invalidateQueries({ queryKey: ["dataTable"] });
      openNotification("success", "Компания успешно добавлена");
    },
    onError: (error) => {
      setLoading(false);
      openNotification("error", error.message);
    },
  });

  const handleFinish = (values: CompanyData) => {
    setLoading(true);
    mutate(values);
    form.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Добавить компанию
      </Button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        maskClosable={false}
        closable={!loading}
        footer={null}
        title="Добавить компанию"
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="space-y-4"
        >
          <Form.Item
            label="Название компании"
            name="name"
            rules={[{ required: true, message: "Введите название компании" }]}
          >
            <Input placeholder="Введите название" className="rounded-md" />
          </Form.Item>
          <Form.Item
            label="Количество сотрудников"
            name="count"
            rules={[
              { required: true, message: "Введите количество сотрудников" },
              { min: 2, message: "Введите количество мин 2" },
            ]}
          >
            <Input
              type="number"
              placeholder="Введите количество"
              className="rounded-md"
            />
          </Form.Item>
          <div className="flex justify-end">
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
            >
              Добавить компанию
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AddModal;
