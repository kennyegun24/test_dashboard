import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPlus } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";

const ExpensesComp = ({ onChange, expenses, newExpense, onDelete }) => {
  return (
    <section>
      {expenses?.map((e) => {
        const id = e.id;
        return (
          <div className="flex items-end w-[90%] gap-2 mb-2">
            <div className="w-[40%]">
              {/* <InputField
                divClass={"mb-0"}
                label={"Amount"}
                className={"md:w-[90%]"}
                type="number"
                name={"amount"}
                onChange={onChange}
              /> */}
              <input
                type="number"
                name="amount"
                value={e.question}
                onChange={(e) => onChange(e.target.value, "amount", id)}
                placeholder="Enter amount..."
                className="bg-transparent md:w-[90%] text-[.8rem] border border-[--border-color] px-4 py-2 rounded-[6px]"
              />
            </div>
            <div className="w-[40%] py-0 flex flex-col gap-1">
              <Select
                onValueChange={(e) => onChange(e, "expense", id)}
                name="expense"
                className="border border-[--border-color] w-full m-0 p-0 py-0"
              >
                <SelectTrigger className="border border-[--border-color] w-full py-0">
                  <SelectValue placeholder="Select an expense" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="Web Development">
                      Web Development
                    </SelectItem>
                    <SelectItem value="Domain Name">Domain Name</SelectItem>
                    <SelectItem value="Web Designer">Web Designer</SelectItem>
                    <SelectItem value="Graphics Designer">
                      Graphics Designer
                    </SelectItem>
                    <SelectItem value="Hosting">Hosting</SelectItem>
                    <SelectItem value="3D Designer">3D Designer</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <button
              onClick={() => onDelete(e.id)}
              className="bg-red-500 rounded-sm flex py-2 px-6 justify-center items-center"
            >
              <IoTrashOutline />
            </button>
          </div>
        );
      })}
      <button
        className="h-[30px] w-[55px] rounded-sm border-dashed border border-[--border-color] mb-4"
        onClick={newExpense}
      >
        <FaPlus size={14} className="m-auto" />
      </button>
    </section>
  );
};

export default ExpensesComp;
