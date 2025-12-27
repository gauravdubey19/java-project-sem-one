import { useContext, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { getAllInvoices } from "../service/invoiceService.js";
import { AppContext, initialInvoiceData } from "../context/AppContext.jsx";
import { formatDate } from "../util/formatInvoiceData.js";

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const { baseURL, setInvoiceData, setSelectedTemplate, setTitle } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getAllInvoices(baseURL);
        setInvoices(response.data);
      } catch (e) {
        toast.error("Failed to load the invoices", e);
      }
    };
    fetchInvoices();
  }, [baseURL]);

  const handleViewClick = (invoice) => {
    setInvoiceData(invoice);
    setSelectedTemplate(invoice.template || "template1");
    setTitle(invoice.title || "View Invoice");
    navigate("/preview");
  };

  const handleCreateNew = () => {
    setTitle("Create Invoice");
    setSelectedTemplate("template1");
    setInvoiceData(initialInvoiceData);
    navigate("/generate");
  };

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: "#0a0a0f" }}>
      <div className="container">
        <div className="mb-4">
          <h2 className="fw-bold" style={{ color: "#fafafa" }}>
            Your Invoices
          </h2>
          <p style={{ color: "#71717a" }}>Manage and view all your invoices</p>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
          {/* Create New Invoice Card */}
          <div className="col">
            <div
              className="h-100 d-flex flex-column justify-content-center align-items-center rounded-3"
              style={{
                cursor: "pointer",
                minHeight: "280px",
                backgroundColor: "#16161d",
                border: "2px dashed rgba(167, 139, 250, 0.3)",
                transition: "all 0.3s ease",
              }}
              onClick={handleCreateNew}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#a78bfa";
                e.currentTarget.style.backgroundColor = "#1a1a24";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(167, 139, 250, 0.3)";
                e.currentTarget.style.backgroundColor = "#16161d";
              }}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)",
                }}
              >
                <Plus size={28} style={{ color: "#a78bfa" }} />
              </div>
              <p className="fw-medium mb-0" style={{ color: "#a78bfa" }}>
                Create New Invoice
              </p>
            </div>
          </div>

          {/* Render Existing Invoices */}
          {invoices.map((invoice, idx) => (
            <div key={invoice.id || idx} className="col">
              <div
                className="h-100 rounded-3 overflow-hidden"
                style={{
                  cursor: "pointer",
                  minHeight: "280px",
                  backgroundColor: "#16161d",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "all 0.3s ease",
                }}
                onClick={() => handleViewClick(invoice)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(167, 139, 250, 0.15)";
                  e.currentTarget.style.borderColor = "rgba(167, 139, 250, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                }}
              >
                {invoice.thumbnailUrl && (
                  <div style={{ height: "160px", overflow: "hidden", backgroundColor: "#1a1a24" }}>
                    <img
                      src={invoice.thumbnailUrl}
                      alt="Invoice Thumbnail"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.9,
                      }}
                    />
                  </div>
                )}
                <div className="p-3">
                  <h6 className="mb-1 fw-semibold" style={{ color: "#fafafa" }}>
                    {invoice.title || "Untitled Invoice"}
                  </h6>
                  <div className="mb-2">
                    <small className="d-block" style={{ color: "#a78bfa" }}>
                      {invoice.invoice?.number || "No Invoice Number"}
                    </small>
                    <small className="d-block" style={{ color: "#71717a" }}>
                      Due: {invoice.invoice?.dueDate ? formatDate(invoice.invoice.dueDate) : "No Due Date"}
                    </small>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small style={{ color: "#71717a" }}>{invoice.company?.name || "No Company"}</small>
                    <small style={{ color: "#71717a" }}>
                      {invoice.lastUpdatedAt ? formatDate(invoice.lastUpdatedAt) : formatDate(invoice.createdAt)}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
