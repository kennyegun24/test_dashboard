import React from "react";
import { Table } from "antd";
import { createStyles } from "antd-style";
const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});
const columns = [
  {
    title: "Full Name",
    // width: 100,
    dataIndex: "name",
    key: "name",
    fixed: "left",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Service Required",
    dataIndex: "service",
    key: "service",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "service",
    render: (e) => (
      <p
        className={`px-4 py-1 rounded-full border text-center text-[.7rem] ${
          e === "Contacted"
            ? "border-yellow-500 bg-yellow-900"
            : e === "New message"
            ? "border-red-500 bg-red-900"
            : "border-green-500 bg-green-900"
        }`}
      >
        {e}
      </p>
    ),
  },
  {
    title: "Action",
    key: "operation",
    fixed: "right",
    width: 100,
    render: () => <a>action</a>,
  },
];
const dataSource = Array.from({
  length: 100,
}).map((_, i) => ({
  key: i,
  name: `Client name ${i}`,
  phone: `Client ${i}`,
  email: `Client${i}email@gmail.com`,
  status: i % 2 === 1 ? "Contacted" : i % 3 === 1 ? "Converted" : "New message",
  service: "Software Development",
}));
const App = () => {
  const { styles } = useStyle();
  return (
    <div className="w-[full]">
      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        scroll={{
          x: "max-content",
          y: "50vh",
        }}
      />
    </div>
  );
};
export default App;
