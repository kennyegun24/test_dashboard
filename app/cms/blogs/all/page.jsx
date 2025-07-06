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
import { useRouter } from "next/navigation";
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
    const deleteItem = axios.delete(`${BACKEND_API_ROUTE}/blog`, {
      data: { id },

      headers: {
        Authorization: `Bearer ${user?.token}`,
        userId: user?.userId,
      },
    });
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

const makeRequest = async (setServices, setIsLoading) => {
  const user = await fetchUser();

  try {
    setIsLoading(true);
    const req = await axios.get(`${BACKEND_API_ROUTE}/blog`, {
      // headers: {
      //   Authorization: `Bearer ${user?.token}`,
      //   userId: user?.userId,
      // },
    });
    const fetch_services = await req.data;
    const all_services = await fetch_services.blogs;
    setServices(all_services || []);
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
  }
};

const columns = ({ mobile, setServices, setIsLoading, onClick }) => [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: 200,
    render: (_, record) => (
      <p onClick={() => onClick(record._id)} className="cursor-pointer">
        {record.title}
      </p>
    ),
  },
  {
    title: "Short Summary",
    dataIndex: "short_summary",
    key: "short_summary",
    width: 250,
    render: (_, record) => (
      <p
        className="text-[.8rem] cursor-pointer"
        onClick={() => onClick(record._id)}
      >
        {record?.short_summary?.length > 100
          ? record.short_summary.slice(0, 100) + "..."
          : record.short_summary}
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

const App = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    makeRequest(setServices, setIsLoading);
  }, []);
  const isMobile = useIsMobile();

  const onClick = (e) => {
    router.push(`/cms/blogs/all/${e}/edit`);
  };

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
          onClick,
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
