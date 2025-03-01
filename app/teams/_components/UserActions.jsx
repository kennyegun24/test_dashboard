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
import { ArrowRightLeft, Ban, Mail, Trash, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContext, useState } from "react";
import axios from "axios";
import { Button } from "antd";
import { sendToast } from "@/lib/helper";
import Roles from "./Roles";
import { RequestContext } from "@/contexts/RequestLLoading";
import { fetchUser } from "@/actions/fetchUser";

export function UserActions({ userData }) {
  const { loading, setLoading } = useContext(RequestContext);
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Actions</h4>
        <p className="text-[.8rem] text-muted-foreground">
          Edit user permission
        </p>
      </div>
      <div className="grid gap-3 text-[--primary-text-color] text-[.8rem]">
        <p className="flex items-center gap-2">
          <User size={14} /> View profile
        </p>
        <AlertDialog>
          <AlertDialogTrigger className="flex items-center gap-2">
            <Mail size={14} /> Edit role
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[--foreground]">
            <ChangeMemberRole
              setLoading={setLoading}
              loading={loading}
              data={userData}
            />
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger className="flex items-center gap-2">
            <Trash size={14} /> Delete member
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[--foreground]">
            <DeleteRole
              setLoading={setLoading}
              loading={loading}
              data={userData}
            />
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export function ChangeMemberRole({ data, setLoading, loading }) {
  const [newRole, setNewRole] = useState([...data.roles]);
  const changeRole = async () => {
    const user = await fetchUser();

    try {
      setLoading(true);
      await axios.post(
        "/api/teams/change-role",
        {
          email: data.email,
          new_role: newRole,
          full_name: data.full_name,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            userId: user?.userId,
          },
        }
      );
      setLoading(false);
      return sendToast({
        desc: "User role changed",
        title: "Successful",
      });
    } catch (error) {
      setLoading(false);
      return sendToast({
        variant: "destructive",
        desc: error?.response?.data?.error,
        title: "Something went wrong",
      });
    }
  };
  const onChange = (e) => {
    if (!newRole.includes(e)) {
      const updatedRoles = [...newRole, e];
      setNewRole(updatedRoles);
    }
  };
  const handleRemove = (role) => {
    const updatedRoles = newRole.filter((r) => r !== role);
    setNewRole(updatedRoles);
  };
  return (
    <div className="flex flex-col gap-8">
      <ArrowRightLeft className="mx-auto" />
      <AlertDialogHeader>
        <AlertDialogTitle>Change member role</AlertDialogTitle>
        <AlertDialogDescription>
          Change this member roles / permission on your organization
        </AlertDialogDescription>
      </AlertDialogHeader>
      <section>
        <Roles
          handleRemove={handleRemove}
          onChange={onChange}
          newRole={newRole}
          setNewRole={setNewRole}
        />
      </section>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button disabled={loading} onClick={changeRole}>
          Save
        </Button>
      </AlertDialogFooter>
    </div>
  );
}

const DeleteRole = ({ data, setLoading, loading }) => {
  const deleteMember = async () => {
    try {
      setLoading(true);
      const user = await fetchUser();

      await axios.delete("/api/teams/delete", {
        data: { email: data.email, full_name: data.full_name },

        headers: {
          Authorization: `Bearer ${user?.token}`,
          userId: user?.userId,
        },
      });
      setLoading(false);
      return sendToast({
        desc: "User removed from team",
        title: "Successful",
      });
    } catch (error) {
      setLoading(false);
      return sendToast({
        variant: "destructive",
        desc: error?.response?.data?.error || "User not removed",
        title: "Something went wrong",
      });
    }
  };
  return (
    <div className="flex flex-col gap-8">
      <Ban className="mx-auto" />
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          Do you want to delete this user from your company? This user will have
          no access to your company admin panel
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button disabled={loading} onClick={deleteMember}>
          Continue
        </Button>
      </AlertDialogFooter>
    </div>
  );
};
