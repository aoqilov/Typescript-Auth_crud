import React, { useState } from "react";
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Dropdown, Space, Popconfirm, Modal, Input, Form, Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData, editData } from "../api/api";
import { openNotification } from "./uiNotification";

// API ma'lumotlari uchun interface
interface CompanyData {
  id: number;
  name: string;
  count: number;
}

// Props tiplashtirish
interface DropdownMethodProps {
  value: CompanyData;
}

const DropdownMethod: React.FC<DropdownMethodProps> = ({ value }) => {
  // STATES
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm<CompanyData>();

  // TANSTACK
  //// DELETE MUTATE
  const { mutate: deleteMutate } = useMutation({
    mutationKey: ["dataTable"],
    mutationFn: (id: number) => deleteData(`/api/companies/delete/by-id/`, id),
    onSuccess: () => {
      openNotification("success", "Компания успешно удалена!");
      queryClient.invalidateQueries({ queryKey: ["dataTable"] });
    },
    onError: (error) => {
      openNotification("error", error.message || "Ошибка при удалении");
    },
  });

  //// EDIT MUTATE
  const { mutate: editMutate } = useMutation({
    mutationKey: ["dataTable"],
    mutationFn: (editObj: CompanyData) =>
      editData(`/api/companies/update`, editObj),
    onSuccess: () => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["dataTable"] });
      openNotification("success", "Компания успешно обновлена!");
      setIsModalOpen(false);
    },
    onError: (error) => {
      setLoading(false);
      openNotification("info", error.message || "Ошибка при обновлена");
    },
  });

  // **EDIT Modal ochish va inputlarga eski qiymatlarni joylash**
  const handleEdit = () => {
    form.setFieldsValue(value); // eski qiymatlarni inputlarga qo‘yish
    setIsModalOpen(true); // Modalni ochish
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      editMutate({ ...values, id: value.id }); // EDIT-MUTATE CHAQIRISH
    });
  };

  const items = [
    {
      label: "Изменить",
      key: "1",
      icon: <EditOutlined />,
      onClick: handleEdit,
    },
    {
      label: (
        <Popconfirm
          title={`Вы уверены, что хотите удалить ${value.name}?`}
          onConfirm={() => deleteMutate(value.id)}
          cancelText="Нет"
          okText="Да"
        >
          <span style={{ color: "red" }}>Удалить</span>
        </Popconfirm>
      ),
      key: "2",
      icon: <DeleteOutlined style={{ color: "red" }} />,
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <MoreOutlined
              style={{ color: "black", fontSize: "25px", marginRight: "10px" }}
            />
          </Space>
        </a>
      </Dropdown>

      {/* **Edit Modal** */}
      <Modal
        title="Редактировать компанию"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        maskClosable={false}
        closable={!loading}
        footer={[
          <Button
            key="cancel"
            disabled={loading}
            onClick={() => setIsModalOpen(false)}
          >
            Отмена
          </Button>,
          <Button
            key="save"
            type="primary"
            loading={loading}
            onClick={handleSave}
          >
            Сохранить
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Название компании"
            name="name"
            rules={[{ required: true, message: "Введите название!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Количество сотрудников"
            name="count"
            rules={[{ required: true, message: "Введите количество!" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DropdownMethod;
