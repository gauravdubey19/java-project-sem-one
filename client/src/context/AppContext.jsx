import { createContext, useState } from "react";

export const AppContext = createContext();

const baseURL = import.meta.env.SERVER_API_BASE_URL || "http://localhost:8080/api";

export const initialInvoiceData = {
  title: "New Invoice",
  billing: { name: "", phone: "", address: "" },
  shipping: { name: "", phone: "", address: "" },
  invoice: { number: "", date: "", dueDate: "" },
  account: { name: "", number: "", SWIFT: "" },
  company: { name: "", phone: "", address: "" },
  tax: 0,
  notes: "",
  items: [{ name: "", qty: "", amount: "", description: "", total: 0 }],
  logo: "",
};

export const AppContextProvider = ({ children }) => {
  const [title, setTitle] = useState("New Invoice");

  const [invoiceData, setInvoiceData] = useState(initialInvoiceData);
  const [selectedTemplate, setSelectedTemplate] = useState("template");

  const contextValue = {
    title,
    setTitle,
    invoiceData,
    setInvoiceData,
    selectedTemplate,
    setSelectedTemplate,
    initialInvoiceData,
    baseURL,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
