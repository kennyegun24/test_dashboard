import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Edit } from "lucide-react";
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
import { useContext, useState } from "react";
import { HexColorPicker } from "react-colorful";
import Button from "@/components/Button";
import { sendToast } from "@/lib/helper";
import axios from "axios";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import { fetchRoles } from "@/store/roles";
import { fetchUser } from "@/actions/fetchUser";
import { RequestContext } from "@/contexts/RequestLLoading";

const RoleContext = ({ data, dispatch, selectedRole, selectRole }) => {
  const dispatchData = (e, _) => {
    dispatch(selectRole({ ...data }));
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger onContextMenu={dispatchData}>
        <div
          onClick={dispatchData}
          className={`flex items-center gap-2 cursor-pointer py-2 ${
            selectedRole._id === data._id && "bg-gray-900  pr-4 rounded-sm"
          }`}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: data.color }}
          />
          <p>{data.name}</p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {/* <ContextMenuItem className="text-[.7rem] cursor-pointer"> */}
        <AlertDialogDemo dispatch={dispatch} selectedRole={selectedRole} />
        {/* </ContextMenuItem> */}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default RoleContext;

function AlertDialogDemo({ dispatch, selectedRole }) {
  const { setLoading, loading } = useContext(RequestContext);

  const [role, setRole] = useState({
    name: selectedRole.name,
    color: selectedRole.color,
  });
  const [isOpen, setIsOpen] = useState(false);

  const onNameChange = (e) => {
    setRole((p) => ({ ...p, name: e.target.value }));
  };

  const onSave = async () => {
    setLoading(true);
    if (!role.name.trim()) {
      setLoading(false);
      return sendToast({
        variant: "destructive",
        title: "Role name should not be empty",
      });
    } else if (!role.color.trim()) {
      setLoading(false);
      return sendToast({
        variant: "destructive",
        title: "Role color should not be empty",
      });
    }
    try {
      const user = await fetchUser();

      const req = await axios.put(
        `${BACKEND_API_ROUTE}/roles`,
        {
          ...role,
          _id: selectedRole._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            userId: user?.userId,
          },
        }
      );
      dispatch(fetchRoles());
      sendToast({
        title: "Role Updated",
        desc: `Role ${role.name} was successfully updated`,
      });
      setIsOpen(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      return sendToast({
        variant: "destructive",
        title: "Something went wrong",
        desc: error?.response?.data?.error || "Error",
      });
    }
  };
  return (
    <AlertDialog open={isOpen} setIsOpen={setIsOpen}>
      <AlertDialogTrigger asChild>
        <span
          onClick={() => setIsOpen(true)}
          className="flex items-center text-[.7rem] cursor-pointer py-2"
        >
          <Edit size={14} className="mr-2" /> Edit details
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[--background]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You can change the name and color to whatever you choose
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="text-[--primary-text-color] w-full">
          <InputField
            onChange={onNameChange}
            value={role.name}
            name={"name"}
            placeholder={"Role name"}
            label={"Role Name"}
            divClass={"gap-2"}
          />

          <section className="mt-8 flex flex-col gap-4 hex-picker-comp">
            <div className="">
              <h5 className="font-[700]">Role Color</h5>
              <p className="text-[.7rem]">
                Choose a color for easy identification
              </p>
            </div>
            <HexColorPicker
              color={role.color}
              onChange={(e) => setRole((prev) => ({ ...prev, color: e }))}
            />
            <div
              className="color-colorful_value text-[.7rem]"
              style={{ borderLeftColor: role.color }}
            >
              Current color is {role.color}
            </div>
          </section>
          <div className="w-[30%] mx-auto mt-6">
            <Button onSave={onSave} text={"Add Role"} className={"w-full"} />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            Cancel
          </AlertDialogCancel>
          {/* <AlertDialogAction>Continue</AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
