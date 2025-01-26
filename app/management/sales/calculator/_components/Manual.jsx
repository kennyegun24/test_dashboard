import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Form from "./Form";
import { getExpensesAmount } from "./helper";

const Manual = ({ setRevenueData, setProcessedJSON }) => {
  const [data, setData] = useState({
    clientName: null,
    email: null,
    phone: null,
    country: null,
    projectName: null,
    serviceRequired: null,
    projectValue: null,
    expenses: [
      {
        amount: null,
        expense: null,
        id: uuidv4(),
      },
    ],
    date: null,
    additionalNote: null,
  });
  const onChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const onDelete = (id) => {
    const newArray = data.expenses.filter((e) => e.id !== id);
    setData((p) => ({
      ...p,
      expenses: newArray,
    }));
  };
  const onNewExpense = () => {
    setData((p) => ({
      ...p,
      expenses: [
        ...p.expenses,
        {
          amount: null,
          expense: null,
          id: uuidv4(),
        },
      ],
    }));
  };
  const onChangeExpense = (e, name, id) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((item) =>
        item.id === id ? { ...item, [name]: e } : item
      ),
    }));
  };
  const calculateRevenue = () => {
    const expense = getExpensesAmount(data.expenses);
    console.log(expense);
    const profit = data.projectValue - expense;
    if (data.expenses.length > 0 && data.projectValue) {
      setRevenueData((p) => ({
        ...p,
        loading: true,
      }));
      const projectsValue = Number(data.projectValue);
      // const expenses = Number(data.expenses);
      const totalRevenue = Number(profit);
      setTimeout(() => {
        setRevenueData((p) => ({
          ...p,
          projectsValue,
          expense,
          totalRevenue,
          loading: false,
        }));
      }, 5000);
      setProcessedJSON([
        {
          ...data,
        },
      ]);
    }
  };
  return (
    <div className="w-[90%] flex flex-col gap-3">
      <Form
        expenseChange={onChangeExpense}
        expenses={data.expenses}
        onChange={onChange}
        newExpense={onNewExpense}
        onDelete={onDelete}
      />
      <Button onClick={calculateRevenue} />
    </div>
  );
};
export default Manual;

const Button = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[--btn_background] rounded-md text-sm w-full px-4 py-2"
    >
      Calcualate Revenue
    </button>
  );
};
