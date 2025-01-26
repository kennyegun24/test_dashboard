"use client";
import React from "react";
import { Empty, Table } from "antd";
import { createStyles } from "antd-style";
import { formatNumberCommas } from "@/utils/generalHelpers";

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
    dataIndex: "clientName",
    key: "clientName",
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
    title: "Amount",
    dataIndex: "projectValue",
    key: "projectValue",
    render: (e) => <p>{formatNumberCommas(e)}</p>,
  },
  {
    title: "Service Required",
    dataIndex: "serviceRequired",
    key: "serviceRequired",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (e) => (
      <p
        className={`px-4 py-1 rounded-full border text-center text-[.7rem] ${
          e === "Completed"
            ? "border-green-500 bg-green-900"
            : e === "In Progress"
            ? "border-yellow-500 bg-yellow-900"
            : e === "Pending"
            ? "border-orange-500 bg-orange-900"
            : "border-red-500 bg-red-900"
        }`}
      >
        {e}
      </p>
    ),
  },
  // {
  //   title: "Action",
  //   key: "operation",
  //   fixed: "right",
  //   width: 100,
  //   render: () => <a>action</a>,
  // },
];

const ExpandableRows = ({ data }) => {
  return (
    <div className="space-y-4 min-w-full">
      <div className="flex items-center gap-4">
        <p className="text-[.8rem] flex flex-col text-[--primary-text-color]">
          <span className="font-semibold">Service</span>
          <span className="text-[.7rem]">{data.serviceRequired}</span>
        </p>
        <p className="text-[.8rem] flex flex-col text-[--primary-text-color]">
          <span className="font-semibold">Country</span>
          <span className="text-[.7rem]">{data.country}</span>
        </p>
      </div>
      <p className="text-[.8rem] flex flex-col text-[--primary-text-color]">
        <span className="font-semibold">Additional Information</span>
        <span className="text-[.7rem]">
          {data.additionalNote || "No additional details provided."}
        </span>
      </p>
      <div className="text-[.8rem] flex flex-col">
        <span className="font-semibold">Expenses</span>
        <div className="flex gap-4">
          <p className="text-[.8rem] flex flex-col text-[--primary-text-color]">
            <span className="font-semibold">Expense</span>
            {data?.expenses?.map((e) => (
              <span className="text-[.7rem]">{e.expense}</span>
            ))}
          </p>
          <p className="text-[.8rem] flex flex-col text-[--primary-text-color]">
            <span className="font-semibold">Amount</span>
            {data?.expenses?.map((e) => (
              <span className="text-[.7rem]" key={e?._id}>
                {e.amount}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

const RecentTransactions = ({ data }) => {
  const { styles } = useStyle();
  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-2">Recent Transactions</h3>
      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={data}
        scroll={{
          x: "max-content",
          y: "45vh",
        }}
        locale={{ emptyText: <Empty description="No record found" /> }}
        expandable={{
          expandedRowRender: (record) => <ExpandableRows data={record} />,
          rowExpandable: (record) => record.projectValue !== "Not Expandable",
          expandRowByClick: true,
        }}
        rowKey={({ _id }) => _id}
      />
    </div>
  );
};
export default RecentTransactions;
