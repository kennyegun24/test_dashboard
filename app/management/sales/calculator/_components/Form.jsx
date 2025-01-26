import InputField from "@/components/TextInput";
import React from "react";
import ExpensesComp from "./ExpensesComp";
import { TextArea } from "@/components/TextArea";
import { DatePicker } from "antd";

const Form = ({ onChange, expenseChange, expenses, newExpense, onDelete }) => {
  return (
    <div>
      <InputField
        className={"md:w-[90%]"}
        label={"Client Name"}
        name={"clientName"}
        onChange={onChange}
        placeholder={"Client's name"}
      />
      <InputField
        className={"md:w-[90%]"}
        label={"Client Email"}
        name={"email"}
        onChange={onChange}
        placeholder={"Client's email"}
      />
      <InputField
        className={"md:w-[90%]"}
        label={"Client Phone number"}
        name={"phone"}
        onChange={onChange}
        placeholder={"Client's number"}
      />
      <InputField
        className={"md:w-[90%]"}
        label={"Client Country"}
        onChange={onChange}
        name={"country"}
        placeholder={"Client's Country"}
      />
      <InputField
        className={"md:w-[90%]"}
        label={"Project Name"}
        onChange={onChange}
        name={"projectName"}
        placeholder={"Project name"}
      />
      <InputField
        className={"md:w-[90%]"}
        label={"Service Required"}
        onChange={onChange}
        name={"serviceRequired"}
        placeholder={"Service Required"}
      />
      <InputField
        className={"md:w-[90%]"}
        label={"Project Value"}
        onChange={onChange}
        name={"projectValue"}
        placeholder={"Project value"}
      />
      <DateTimePicker />
      {/* <InputField
        className={"md:w-[90%]"}
        label={"Expenses"}
        onChange={onChange}
        name={"expenses"}
        placeholder={"Expenses"}
      /> */}
      <h4 htmlFor="" className="text-[.8rem] mb-2 font-[600]">
        Expenses
      </h4>
      <ExpensesComp
        newExpense={newExpense}
        expenses={expenses}
        onChange={expenseChange}
        onDelete={onDelete}
      />
      <TextArea
        className={"md:w-[90%]"}
        label={"Note"}
        onChange={onChange}
        name={"additionalNote"}
        placeholder={"Additional Note"}
        id={"text_area"}
      />
    </div>
  );
};

export default Form;

const DateTimePicker = () => {
  return (
    <div className="flex flex-col gap-2 w-[90%] mb-4">
      <h5 htmlFor="" className="text-[.8rem] font-[600]">
        Transaction Date
      </h5>
      <DatePicker />
    </div>
  );
};
