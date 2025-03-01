import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Upload, Button, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  calculateRevenue,
  exportToCSV,
  transformData,
  validateJSON,
} from "./helper";
import axios from "axios";
import { sendToast } from "@/lib/helper";
import { fetchUser } from "@/actions/fetchUser";
const { Dragger } = Upload;

const Automatic = ({
  revenueData,
  setRevenueData,
  processedJSON,
  setProcessedJSON,
}) => {
  const [jsonData, setJsonData] = useState([]);

  const props = {
    name: "file",
    multiple: false,
    accept: ".xlsx, .xls, .csv",
    onChange() {},
    customRequest({ file }) {
      if (!file) {
        return sendToast({
          variant: "destructive",
          desc: "No file selected.",
          title: "No selection made",
        });
      }

      if (
        !file.name.endsWith(".xlsx") &&
        !file.name.endsWith(".xls") &&
        !file.name.endsWith(".csv")
      ) {
        return sendToast({
          variant: "destructive",
          desc: "Please upload a valid excel file.",
          title: "Wrong file type",
        });
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (file.name.endsWith("csv")) {
            Papa.parse(e.target.result, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                const check = validateJSON(results.data);
                if (!check) {
                  return sendToast({
                    variant: "destructive",
                    desc: "You ommited some headers!",
                    title: "CSV conflicts",
                  });
                }
                setJsonData(results.data);
                setProcessedJSON(transformData(results.data));
                return sendToast({
                  desc: "CSV file parsed successfully!",
                  title: "CSV upload",
                });
              },
              error: () => {
                return sendToast({
                  variant: "destructive",
                  desc: "Error parsing the CSV file.",
                  title: "CSV conflicts",
                });
              },
            });
          } else {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            let json = XLSX.utils.sheet_to_json(sheet);
            setJsonData(json);
            setProcessedJSON(transformData(json));
            return sendToast({
              desc: "CSV file parsed successfully!",
              title: "CSV upload",
            });
          }
        } catch (err) {
          return sendToast({
            variant: "destructive",
            desc: "Error parsing the Excel file.",
            title: "CSV conflicts",
          });
        }
      };

      if (file.name.endsWith(".csv")) {
        reader.readAsText(file); // Read CSV file as text
      } else {
        reader.readAsArrayBuffer(file); // Read Excel file as array buffer
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  useEffect(() => {
    const fetchData = async () => {
      const user = await fetchUser();

      try {
        const fetchData = await axios.get("/api/sales/transactions", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            userId: user?.userId,
          },
        });
        const response = await fetchData.data;
        const json = await response.data;
        setJsonData(json);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex flex-col gap-4">
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="text-[--text-color]">
          <strong>Click or drag file</strong> to this area to upload
        </p>
        <p className="text-[--text-color] w-[80%] mx-auto mt-2 text-[.7rem]">
          All required columns will be auto-checked
        </p>
      </Dragger>
      <Dialog>
        <DialogTrigger
          disabled={jsonData.length <= 0}
          onClick={() => calculateRevenue(jsonData, setRevenueData)}
        >
          <span
            className="px-4 py-2 rounded-sm text-[.8rem] bg-[--btn_background]"
            disabled={jsonData.length <= 0}
            type="primary"
            onClick={() => calculateRevenue(jsonData, setRevenueData)}
          >
            Preview Data
          </span>
        </DialogTrigger>
        <DialogContent
          className={
            "2xl:min-w-[40%] min-w-[60%] min-h-[70vh] text-[--text-color] py-3 px-0"
          }
        >
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          <DynamicTable jsonData={jsonData} />
          <DialogFooter>
            <Button
              type="primary"
              className="w-fit"
              onClick={() => calculateRevenue(jsonData, setRevenueData)}
            >
              Calculate Revenue
            </Button>{" "}
            <Button
              type="primary"
              className="w-fit"
              onClick={() => exportToCSV(jsonData)}
            >
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Automatic;

const DynamicTable = ({ jsonData }) => {
  if (!jsonData || jsonData.length === 0) return <p>No data available</p>;

  // Extract headers dynamically from the first object
  const headers = [...new Set(jsonData.flatMap((item) => Object.keys(item)))];

  return (
    <div className="overflow-y-scroll hide_scrollbar max-h-[60vh]">
      <table className="w-full excelTable excel">
        <thead className="thead w-full">
          <tr style={{ color: "#000" }} className="mx-4 py-4">
            {headers.map((header) => (
              <th
                className="th text-[--text-color] text-start py-4"
                key={header}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tbody w-full text-[--text-color]">
          {jsonData.map((row, rowIndex) => (
            <tr
              style={{ color: "#000" }}
              className="text-[--text-color]"
              key={rowIndex}
            >
              {headers.map((header, cellIndex) => (
                <td className="td px-2 text-[--text-color]" key={cellIndex}>
                  {/* Handle nested arrays/objects dynamically */}
                  {Array.isArray(row[header])
                    ? row[header].map((item, itemIndex) => (
                        <div key={itemIndex}>
                          {Object.entries(item).map(([key, value]) => (
                            <span key={key}>
                              {key}: {value},{" "}
                            </span>
                          ))}
                        </div>
                      ))
                    : typeof row[header] === "object"
                    ? JSON.stringify(row[header])
                    : row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
