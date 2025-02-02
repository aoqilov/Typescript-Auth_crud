import { Popconfirm, Table } from "antd";
import React from "react";
import { ColumnsType } from "antd/es/table";
import { LogoutOutlined, RollbackOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDataOne } from "../api/api";
import Loader from "../components/Loader";

interface Company {
  id: string;
  name: string;
  count: number;
}

const OneTable: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<Company>({
    queryKey: ["tableOne", id],
    queryFn: () => getDataOne(`/api/companies/get/${id}`),
  });

  if (isLoading) {
    return <Loader />;
  }

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const columns: ColumnsType<Company> = [
    {
      title: "Название компании",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Количество сотрудников",
      dataIndex: "count",
      key: "count",
    },
  ];

  return (
    <div>
      <div className="bg-[#313131] shadow h-16 flex items-center justify-between w-full px-5">
        <div className="flex items-center gap-2">
          <RollbackOutlined
            style={{ fontSize: "25px", color: "white" }}
            onClick={() => navigate("/")}
          />
          <h1 className="text-xl font-bold text-white">Компании</h1>
        </div>
        <div className="flex items-center">
          <Popconfirm
            title={`Вы уверены, что хотите выйти?`}
            onConfirm={() => logout()}
            cancelText="Нет"
            okText="Да"
          >
            <LogoutOutlined
              style={{ color: "white", fontSize: "25px", marginRight: 16 }}
            />
          </Popconfirm>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data ? [data] : []}
        rowKey={(record) => record.id}
        pagination={false}
      />
    </div>
  );
};

export default OneTable;
