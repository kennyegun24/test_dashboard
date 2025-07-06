"use client";
import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import { createStyles } from "antd-style";
import axios from "axios";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import { sendToast } from "@/lib/helper";
import { useIsMobile } from "@/hooks/use-mobile";
import Spinner from "@/components/spinner";
import { fetchUser } from "@/actions/fetchUser";
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

const handleDelete = async (id, setServices, setIsLoading) => {
  const user = await fetchUser();

  try {
    const deleteItem = axios.delete(
      `${BACKEND_API_ROUTE}/service`,
      {
        data: { id },
      },
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          userId: user?.userId,
        },
      }
    );
    if ((await deleteItem).status === 200) {
      makeRequest(setServices, setIsLoading);
      return sendToast({
        desc: "Service has been deleted",
        title: "Success",
      });
    }
  } catch (error) {
    console.log(error);
    return sendToast({
      variant: "destructive",
      title: "Something went wrong",
      desc: error?.response?.data?.error || "Service could not be deleted.",
    });
  }
};

const handleSaveEdit = async ({
  record,
  editingValue,
  editingField,
  setEditingField,
  setEditingKey,
  setServices,
  setIsLoading,
}) => {
  const user = await fetchUser();
  console.log(record);
  try {
    const updated = await axios.put(
      `${BACKEND_API_ROUTE}/service`,
      {
        id: record._id,
        [editingField]: editingValue,
      },
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          userId: user?.userId,
        },
      }
    );
    if (updated.status === 200) {
      sendToast({ title: "Updated", desc: "Service updated successfully" });
      makeRequest(setServices, setIsLoading);
      setEditingKey(null);
      setEditingField(null);
    }
  } catch (error) {
    console.log(error);
    sendToast({
      variant: "destructive",
      title: "Update failed",
      desc: error?.response?.data?.error || "Could not update service.",
    });
  }
};

const makeRequest = async (setServices, setIsLoading) => {
  const user = await fetchUser();

  try {
    setIsLoading(true);
    const req = await axios.get(`${BACKEND_API_ROUTE}/service`, {
      // headers: {
      //   Authorization: `Bearer ${user?.token}`,
      //   userId: user?.userId,
      // },
    });
    const fetch_services = await req.data;
    const all_services = await fetch_services.services;
    setServices(all_services || []);
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
  }
};

const columns = ({
  mobile,
  setServices,
  setIsLoading,
  editingKey,
  editingField,
  setEditingKey,
  setEditingField,
  editingValue,
  setEditingValue,
  handleSaveEdit,
}) => [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: 200,
    render: (_, record) =>
      editingKey === record._id && editingField === "title" ? (
        <textarea
          autoFocus
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          onBlur={() =>
            handleSaveEdit({
              record,
              editingValue,
              editingField,
              setEditingField,
              setEditingKey,
              setServices,
              setIsLoading,
            })
          }
          className="w-full p-1 border border-[#111] rounded bg-[rgba(0,0,0,0.2)] resize-auto"
        />
      ) : (
        <p
          className="cursor-pointer"
          onClick={() => {
            setEditingKey(record._id);
            setEditingField("title");
            setEditingValue(record.title);
          }}
        >
          {record.title}
        </p>
      ),
  },
  {
    title: "Body",
    dataIndex: "body",
    key: "body",
    width: 250,
    render: (_, record) =>
      editingKey === record._id && editingField === "body" ? (
        <textarea
          autoFocus
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          onBlur={() =>
            handleSaveEdit({
              record,
              editingValue,
              editingField,
              setEditingField,
              setEditingKey,
              setServices,
              setIsLoading,
            })
          }
          className="w-full p-1 border border-[#111] rounded bg-[rgba(0,0,0,0.2)] resize-auto"
        />
      ) : (
        <p
          className="text-[.8rem] cursor-pointer"
          onClick={() => {
            setEditingKey(record._id);
            setEditingField("body");
            setEditingValue(record.body);
          }}
        >
          {record.body.length > 100
            ? record.body.slice(0, 100) + "..."
            : record.body}
        </p>
      ),
  },
  {
    title: "Short Description",
    dataIndex: "short_desc",
    key: "short_desc",
    width: 250,
    render: (_, record) =>
      editingKey === record._id && editingField === "short_desc" ? (
        <textarea
          autoFocus
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          onBlur={() =>
            handleSaveEdit({
              record,
              editingValue,
              editingField,
              setEditingField,
              setEditingKey,
              setServices,
              setIsLoading,
            })
          }
          className="w-full p-1 border border-[#111] rounded bg-[rgba(0,0,0,0.2)] resize-auto"
        />
      ) : (
        <p
          className="text-[.8rem] cursor-pointer"
          onClick={() => {
            setEditingKey(record._id);
            setEditingField("short_desc");
            setEditingValue(record.short_desc);
          }}
        >
          {record.short_desc.length > 70
            ? record.short_desc.slice(0, 70) + "..."
            : record.short_desc}
        </p>
      ),
  },
  {
    title: "Action",
    key: "operation",
    width: 100,
    fixed: !mobile ? "right" : null,
    render: (_, record) => (
      <Button
        type="link"
        danger
        onClick={() => handleDelete(record._id, setServices, setIsLoading)}
      >
        Delete
      </Button>
    ),
  },
];

// const columns = (
//   mobile,
//   setServices,
//   setIsLoading,
//   editingKey,
//   editingField,
//   setEditingKey,
//   setEditingField,
//   editingValue,
//   setEditingValue,
//   handleSaveEdit
// ) => {
//   return [
//     {
//       title: "Title",
//       width: 200,
//       dataIndex: "title",
//       key: "title",
//       fixed: !mobile ? "left" : null,
//     },
//     {
//       title: "Body",
//       dataIndex: "body",
//       key: "body",
//       width: 250,
//       render: (_, record) => (
//         <p className="text-[.8rem]">
//           {record.body.length > 100
//             ? record.body.slice(0, 100) + "..."
//             : record.body}
//         </p>
//       ),
//     },
//     {
//       title: "Short Description",
//       dataIndex: "short_desc",
//       key: "short_desc",
//       width: 250,
//       render: (_, record) => (
//         <p className="text-[.8rem]">
//           {record.short_desc.length > 70
//             ? record.short_desc.slice(0, 70) + "..."
//             : record.short_desc}
//         </p>
//       ),
//     },
//     {
//       title: "Action",
//       key: "operation",
//       fixed: !mobile ? "right" : null,
//       width: 100,
//       render: (_, record) => (
//         <Button
//           type="link"
//           danger
//           onClick={() => handleDelete(record._id, setServices, setIsLoading)}
//         >
//           Delete
//         </Button>
//       ),
//     },
//   ];
// };

const App = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingKey, setEditingKey] = useState(null); // _id of the editing row
  const [editingField, setEditingField] = useState(null); // field name being edited
  const [editingValue, setEditingValue] = useState(""); // current value
  useEffect(() => {
    makeRequest(setServices, setIsLoading);
  }, []);
  const isMobile = useIsMobile();

  const { styles } = useStyle();
  if (isLoading) {
    return (
      <div className="max-w-[100vw] md:max-w-[60vw] md:mx-auto flex items-center justify-center h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-[100vw] md:max-w-[64%] md:mx-auto px-4 overflow-y-hidden">
      <Table
        className={styles.customTable}
        columns={columns({
          isMobile,
          setServices,
          setIsLoading,
          editingKey,
          editingField,
          setEditingKey,
          setEditingField,
          editingValue,
          setEditingValue,
          handleSaveEdit,
        })}
        dataSource={services}
        scroll={{
          x: "max-content",
          y: "60vh",
        }}
      />
    </div>
  );
};
export default App;
