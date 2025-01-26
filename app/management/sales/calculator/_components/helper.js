export function exportToCSV(jsonData, fileName = "data.csv") {
  if (!jsonData || jsonData.length === 0) {
    return;
  }

  // Collect all unique keys from the JSON data
  const headers = [...new Set(jsonData.flatMap(Object.keys))];

  // Handle nested fields like `expenses`
  const processCell = (value) => {
    if (Array.isArray(value)) {
      // Convert nested arrays (e.g., expenses) to a readable format
      return value
        .map((item) =>
          typeof item === "object"
            ? Object.entries(item)
                .map(([key, val]) => `${key}: ${val}`)
                .join("; ")
            : item
        )
        .join("; | ");
    } else if (typeof value === "object" && value !== null) {
      // Convert objects to JSON strings
      return JSON.stringify(value);
    }
    return value !== undefined ? `"${value}"` : ""; // Handle undefined
  };

  // Create the CSV content
  const csvContent = [
    headers.join(","), // Add the headers as the first row
    ...jsonData.map((row) =>
      headers
        .map((header) => processCell(row[header])) // Process each cell dynamically
        .join(",")
    ),
  ].join("\n");

  // Generate a blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const transformData = (data) => {
  return data.map((item) => {
    const transformedItem = {};
    // Loop over each key-value pair in the item
    Object.entries(item).forEach(([key, value]) => {
      if (key === "expenses" && typeof value === "string") {
        const str = value.split("; ").join(" ").split("|").join(" ");
        const regex = /amount:\s*(\d+)\s*expense:\s*([\w\s]+)/g;
        // /amount:\s*(\d+)\s*expense:\s*([\w\s]+?)\s*_id:\s*([\w\d]+)/g;

        const result = [];
        let match;

        // Loop through all matches
        while ((match = regex.exec(str)) !== null) {
          const [, amount, expense, _id] = match; // Extract matched groups
          result.push({
            amount: parseInt(amount, 10), // Convert amount to a number
            expense: expense.trim(), // Trim any extra whitespace
            _id: _id,
          });
        }

        // // Ensure each expense object has required properties
        transformedItem[key] = result.map((expenseObj) => {
          return {
            expense: expenseObj.expense || "",
            amount: parseFloat(expenseObj.amount) || 0,
            _id: expenseObj._id || "", // Assign _id if present, or set default
          };
        });
      } else if (typeof value === "string" && value.includes(":")) {
        // If the value is a string and contains key:value format, extract actual value
        const [field, val] = value.split(": ").map((str) => str.trim());
        transformedItem[key] = val;
      } else {
        // For other fields, assign the value as is
        transformedItem[key] = value;
      }
    });

    return transformedItem;
  });
};

export const getExpensesAmount = (e) => {
  let amount = 0;
  e.forEach((e) => {
    amount += Number(e.amount);
  });
  return amount;
};

export const calculateRevenue = (jsonData, setRevenueData) => {
  if (jsonData.length > 0) {
    setRevenueData((p) => ({
      ...p,
      loading: true,
    }));
    const transformData = (data) => {
      return data.map((item) => {
        const transformedItem = {};
        // Loop over each key-value pair in the item
        Object.entries(item).forEach(([key, value]) => {
          if (key === "expenses" && typeof value === "string") {
            const str = value.split("; ").join(" ").split("|").join(" ");
            const regex =
              /amount:\s*(\d+)\s*expense:\s*([\w\s]+?)\s*_id:\s*([\w\d]+)/g;

            const result = [];
            let match;

            // Loop through all matches
            while ((match = regex.exec(str)) !== null) {
              const [, amount, expense, _id] = match; // Extract matched groups
              result.push({
                amount: parseInt(amount, 10), // Convert amount to a number
                expense: expense.trim(), // Trim any extra whitespace
                _id: _id,
              });
            }

            // // Ensure each expense object has required properties
            transformedItem[key] = result.map((expenseObj) => {
              return {
                expense: expenseObj.expense || "",
                amount: parseFloat(expenseObj.amount) || 0,
                _id: expenseObj._id || "", // Assign _id if present, or set default
              };
            });
          } else if (typeof value === "string" && value.includes(":")) {
            // If the value is a string and contains key:value format, extract actual value
            const [field, val] = value.split(": ").map((str) => str.trim());
            transformedItem[key] = val;
          } else {
            // For other fields, assign the value as is
            transformedItem[key] = value;
          }
        });

        return transformedItem;
      });
    };

    const expenses = transformData(jsonData).reduce(
      (p, n) => p + Number(getExpensesAmount(n.expenses)),
      0
    );
    const value = transformData(jsonData).reduce(
      (p, n) => p + Number(n.projectValue),
      0
    );
    const profit = value - expenses;

    if (transformData(jsonData).length > 0) {
      setRevenueData((p) => ({
        ...p,
        loading: true,
      }));
      setTimeout(() => {
        setRevenueData((p) => ({
          ...p,
          projectsValue: value,
          expenses: expenses,
          totalRevenue: profit,
          loading: false,
        }));
      }, 3000);
    }
    return transformData(jsonData);
  }
};

const required = [
  "_id",
  "clientName",
  "email",
  "phone",
  "country",
  "projectName",
  "serviceRequired",
  "projectValue",
  "status",
];

export const validateJSON = (json) => {
  const getFirstObj = json[0];
  const keysInArray = Object.keys(getFirstObj);
  return required.every((e) => keysInArray.includes(e));
};
