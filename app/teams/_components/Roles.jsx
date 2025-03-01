import { fetchRoles } from "@/store/roles";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} = require("@/components/ui/select");
const { Badge } = require("@/components/ui/badge");
const { X } = require("lucide-react"); // Icon for remove

const Roles = ({ onChange, newRole, handleRemove }) => {
  const { roles } = useSelector((state) => state.roles);
  const dispatch = useDispatch();
  useEffect(() => {
    if (roles.length <= 0) {
      dispatch(fetchRoles());
    }
  }, []);
  return (
    <div className="space-y-2 mb-2">
      {/* Select Dropdown */}
      <Select className="z-[9999999]" onValueChange={onChange}>
        <SelectTrigger className="w-[180px] z-[9999999]">
          <SelectValue placeholder="Select Roles" />
        </SelectTrigger>
        <SelectContent className="z-[9999999]">
          {roles.map((e) => (
            <SelectItem value={e.name}>{e.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Display Selected Roles */}
      <div className="flex flex-wrap gap-2">
        {newRole.map((role) => (
          <Badge
            key={role}
            variant="outline"
            className="flex items-center text-[.7rem] gap-2 px-2 py-1"
          >
            {role}
            <X
              size={16}
              className="cursor-pointer text-red-500"
              onClick={() => handleRemove(role)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default Roles;
