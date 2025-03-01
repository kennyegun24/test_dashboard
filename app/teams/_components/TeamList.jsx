"use client";
import React, { useContext, useState } from "react";
import { Button, Table } from "antd";
import { createStyles } from "antd-style";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserActions } from "./UserActions";
import { ArrowRightLeft, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import InputField from "@/components/TextInput";
import axios from "axios";
import { sendToast } from "@/lib/helper";
import Roles from "./Roles";
import { RequestContext } from "@/contexts/RequestLLoading";
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
const columns = [
  {
    title: "Full Name",
    dataIndex: "full_name",
    key: "full_name",
    fixed: "left",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Contact",
    dataIndex: "contact",
    key: "phone",
  },
  {
    title: "Role",
    dataIndex: "roles",
    key: "role",
    render: (e, _) => (
      <p key={_} className={`px-4 py-1 text-[.7rem]`}>
        {e.join(", ")}
      </p>
    ),
  },
  {
    title: "Action",
    key: "operation",
    fixed: "right",
    width: 100,
    render: (e) => (
      <Popover key={e.key}>
        <PopoverTrigger>
          <span>action</span>
        </PopoverTrigger>
        <PopoverContent className={"max-w-[200px]"}>
          <UserActions userData={e} />
        </PopoverContent>
      </Popover>
    ),
  },
];

const TeamMembers = ({ data }) => {
  const dataSource = data?.map((e, _) => ({
    ...e,
    key: _,
  }));
  const { styles } = useStyle();
  const { loading, setLoading } = useContext(RequestContext);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold mb-2">Team List</h3>
        <AlertDialog>
          <AlertDialogTrigger>
            <span>
              <Plus />
            </span>
          </AlertDialogTrigger>
          <AlertDialogContent
            className={"md:max-w-[500px] max-w-[80%] bg-[--foreground]"}
          >
            <AddNewTeamMember
              setLoading={setLoading}
              loading={loading}
              data={data}
            />
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        scroll={{
          x: "max-content",
          y: "45vh",
        }}
      />
    </div>
  );
};
export default TeamMembers;

export function AddNewTeamMember({ setLoading, loading }) {
  const [data, setData] = useState({
    roles: [],
    email: "",
    full_name: "",
    contact: "",
  });
  const newMember = async () => {
    try {
      setLoading(true);
      const user = await fetchUser();
      const req = await axios.post(
        "/api/teams/new",
        {
          ...data,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            userId: user?.userId,
          },
        }
      );
      setData({
        roles: [],
        email: "",
        full_name: "",
        contact: "",
      });
      console.log(user);
      setLoading(false);
      return sendToast({
        desc: `${data.full_name} successfully added to team`,
        title: "Success",
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      return sendToast({
        variant: "destructive",
        desc: error?.response?.data?.error || "User not added",
        title: "Something went wrong",
      });
    }
  };
  const onChange = (e) => {
    setData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };
  const onRoleChange = (e) => {
    if (!data.roles.includes(e)) {
      setData((prevData) => ({
        ...prevData,
        roles: [...prevData.roles, e],
      }));
    }
  };
  const handleRemove = (roleToRemove) => {
    setData((prevData) => ({
      ...prevData,
      roles: prevData.roles.filter((role) => role !== roleToRemove),
    }));
  };
  return (
    <div className="flex flex-col gap-8">
      <ArrowRightLeft className="mx-auto" />
      <AlertDialogHeader>
        <AlertDialogTitle>Add new team member</AlertDialogTitle>
        <AlertDialogDescription>
          Assign this new membe a role / permission on your organization
        </AlertDialogDescription>
      </AlertDialogHeader>
      <section>
        <InputField
          label={"Full Name"}
          name={"full_name"}
          placeholder={"First name, last name"}
          value={data.full_name}
          onChange={onChange}
        />
        <InputField
          onChange={onChange}
          value={data.email}
          label={"Email"}
          placeholder={"Email address"}
          name={"email"}
        />
        <InputField
          onChange={onChange}
          value={data.contact}
          label={"Contact"}
          placeholder={"+23400000000"}
          name={"contact"}
        />
        <Roles
          newRole={data.roles}
          handleRemove={handleRemove}
          onChange={onRoleChange}
        />
      </section>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button onClick={newMember} disabled={loading}>
          Save
        </Button>
      </AlertDialogFooter>
    </div>
  );
}
