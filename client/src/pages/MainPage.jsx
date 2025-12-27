import { useContext, useState } from "react";
import { PencilIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import InvoiceForm from "../components/InvoiceForm.jsx";
import TemplateGrid from "../components/TemplateGrid.jsx";
import { AppContext } from "../context/AppContext.jsx";

const MainPage = () => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const navigate = useNavigate();
  const { title, setTitle, invoiceData, setInvoiceData, setSelectedTemplate } = useContext(AppContext);

  const handleTemplateClick = (templateId) => {
    const hasInvalidItem = invoiceData.items.some((item) => !item.qty || !item.amount);

    if (hasInvalidItem) {
      toast.error("Please enter quantity and amount for all items");
      return;
    }
    setSelectedTemplate(templateId);
    navigate("/preview");
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setInvoiceData((prev) => ({ ...prev, title: newTitle }));
  };

  return (
    <div className="mainpage container-fluid min-vh-100 py-4" style={{ backgroundColor: "#0a0a0f" }}>
      <div className="container">
        {/* Title bar */}
        <div
          className="rounded-3 p-3 mb-4"
          style={{
            backgroundColor: "#16161d",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div className="d-flex align-items-center">
            {isEditingTitle ? (
              <input
                type="text"
                className="form-control me-2"
                autoFocus
                value={title}
                onChange={handleTitleChange}
                onBlur={() => setIsEditingTitle(false)}
                style={{
                  backgroundColor: "#1a1a24",
                  border: "1px solid rgba(167, 139, 250, 0.5)",
                  color: "#fafafa",
                  maxWidth: "400px",
                }}
              />
            ) : (
              <h5 className="mb-0 me-2 d-flex align-items-center gap-2">
                <span style={{ color: "#fafafa" }}>{title}</span>
                <button className="btn btn-sm p-1 border-0 bg-transparent" onClick={() => setIsEditingTitle(true)} style={{ lineHeight: 1 }}>
                  <PencilIcon size={18} style={{ color: "#a78bfa" }} />
                </button>
              </h5>
            )}
          </div>
        </div>

        {/* Invoice form and template grid */}
        <div className="row g-4 align-items-stretch">
          {/* Invoice form */}
          <div className="col-12 col-lg-6 d-flex">
            <div
              className="rounded-3 p-4 w-100"
              style={{
                backgroundColor: "#16161d",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <InvoiceForm />
            </div>
          </div>
          {/* Template grid */}
          <div className="col-12 col-lg-6 d-flex">
            <div
              className="rounded-3 p-4 w-100"
              style={{
                backgroundColor: "#16161d",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <h5 className="mb-3" style={{ color: "#fafafa" }}>
                Choose a Template
              </h5>
              <p className="mb-4" style={{ color: "#71717a", fontSize: "0.9rem" }}>
                Select a template to preview your invoice
              </p>
              <TemplateGrid onTemplateClick={handleTemplateClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
