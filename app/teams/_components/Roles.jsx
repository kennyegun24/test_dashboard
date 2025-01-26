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
  return (
    <div className="space-y-2 mb-2">
      {/* Select Dropdown */}
      <Select className="z-[9999999]" onValueChange={onChange}>
        <SelectTrigger className="w-[180px] z-[9999999]">
          <SelectValue placeholder="Select Roles" />
        </SelectTrigger>
        <SelectContent className="z-[9999999]">
          <SelectItem value="Admin">Admin</SelectItem>
          <SelectItem value="Moderator">Moderator</SelectItem>
          <SelectItem value="Social Media Manager">
            Social Media Manager
          </SelectItem>
          <SelectItem value="Sales Manager">Sales Manager</SelectItem>
          <SelectItem value="Lead Manager">Lead Manager</SelectItem>
          <SelectItem value="CMS Editor">CMS Editor</SelectItem>
          <SelectItem value="Legal Pages Manager">
            Legal Pages Manager
          </SelectItem>
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
