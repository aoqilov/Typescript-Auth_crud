import React, { useState } from "react";
import { Table, Popconfirm } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { LogoutOutlined } from "@ant-design/icons";
import AddModal from "../components/AddModal.tsx";
import DropdownMethod from "../components/DropDown.tsx";
import { useQuery } from "@tanstack/react-query";
import { getData } from "../api/api";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader.tsx";

// API'dan keladigan kompaniya ma'lumotlari uchun interfeys
interface Company {
  id: string;
  name: string;
  count: number;
}

const MainTable: React.FC = () => {
  // Query parametrlari uchun state
  const [pageSize, setPageSize] = useState<number>(10); // Har bir sahifadagi elementlar soni
  const [pageIndex, setPageIndex] = useState<number>(1); // Joriy sahifa raqami
  const navigate = useNavigate();

  // Ma'lumotlarni olish
  const { data, error, isLoading } = useQuery<Company[], Error>({
    queryKey: ["dataTable"],
    queryFn: () => getData("/api/companies/get-all"),
  });

  // Ma'lumot yuklanayotgan yoki xatolik holatlari
  if (isLoading) return <Loader />;
  if (error) return <p>Error: {String(error)}</p>;

  // Jadval ustunlari
  const columns: ColumnsType<Company> = [
    {
      title: "Название компании",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Company) => (
        <span
          onClick={() => navigate(`/table/${record.id}`)}
          className="hover:underline cursor-pointer"
        >
          {text}
        </span>
      ),
    },
    {
      title: "Количество сотрудников",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <div className="text-right">
          <DropdownMethod value={record} />
        </div>
      ),
    },
  ];

  // Sahifalash (pagination) funksiyasi
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPageIndex(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#313131] shadow h-16 flex items-center justify-between w-full px-5">
        <h1 className="text-xl font-bold text-white">Компании</h1>
        <div className="flex items-center">
          {/* logout confirm */}
          <Popconfirm
            title={`Вы уверены, что хотите выйти?`}
            onConfirm={logout}
            cancelText="Нет"
            okText="Да"
          >
            <LogoutOutlined
              style={{ color: "white", fontSize: "25px", marginRight: 16 }}
            />
          </Popconfirm>
          {/* open addmodal */}
          <AddModal />
        </div>
      </div>
      {/* Jadval */}
      <Table<Company>
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        // pagination={
        //   data && data?.length > 10
        //     ? {
        //         current: pageIndex,
        //         pageSize: pageSize,
        //         total: data?.length,
        //         showTotal: (total) => `Umumiy ma'lumotlar: ${total}`,
        //       }
        //     : false
        // }
        onChange={handleTableChange}
        className="antd-table m-4"
        bordered
        size="small"
      />
      ;
    </div>
  );
};

export default MainTable;
