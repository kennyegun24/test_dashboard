"use client";
import RequestLoader from "@/components/loaders/RequestLoader";
import { createContext, useState } from "react";

export const RequestContext = createContext();

const RequestProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <RequestContext.Provider value={{ loading, setLoading }}>
      {loading && <RequestLoader />}
      {children}
    </RequestContext.Provider>
  );
};

export default RequestProvider;
