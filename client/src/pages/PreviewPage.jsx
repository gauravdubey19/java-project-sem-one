import { useContext, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Download, Trash2, Save } from "lucide-react";
import html2canvas from "html2canvas";

import { templates } from "../assets/assets.js";
import { AppContext } from "../context/AppContext.jsx";
import InvoicePreview from "../components/InvoicePreview.jsx";
import { deleteInvoice, saveInvoice } from "../service/invoiceService.js";
import { uploadCompanyLogo, uploadInvoiceThumbnail } from "../service/cloudinaryService.js";
import { generatePdfFromElement } from "../util/pdfUtils.js";

const PreviewPage = () => {
  const previewRef = useRef();
  const { selectedTemplate, invoiceData, setSelectedTemplate, baseURL } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);

  const handleSaveAndExit = async () => {
    try {
      setLoading(true);
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "white",
        scrollY: -window.scrollY,
      });
      const imageData = canvas.toDataURL("image/png");
      const thumbnailUrl = await uploadInvoiceThumbnail(imageData);
      const logoUrl = await uploadCompanyLogo(invoiceData.logo);
      const payload = {
        ...invoiceData,
        thumbnailUrl: thumbnailUrl,
        logo: logoUrl,
        template: selectedTemplate,
      };
      const response = await saveInvoice(baseURL, payload);
      if (response.status === 200) {
        toast.success("Successfully updated invoice");
        navigate("/dashboard");
      } else {
        toast.error(response.statusText);
        throw new Error("Failed to update invoice");
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!invoiceData.id) {
      toast.success("Invoice deleted successfully");
      navigate("/dashboard");
    }

    try {
      const response = await deleteInvoice(baseURL, invoiceData.id);
      if (response.status === 204) {
        toast.success("Successfully deleted invoice");
        navigate("/dashboard");
      } else {
        toast.error("Unable to delete invoice");
      }
    } catch (e) {
      toast.error("Failed to delete invoice", e.message);
    }
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;

    try {
      setDownloading(true);
      await generatePdfFromElement(previewRef.current, `invoice_${Date.now()}.pdf`);
    } catch (e) {
      toast.error("Failed to generate pdf", e.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="previewpage container-fluid d-flex flex-column p-4 min-vh-100" style={{ backgroundColor: "#0a0a0f" }}>
      {/* Action buttons */}
      <div className="d-flex flex-column align-items-center mb-4 gap-4">
        {/* Template selector */}
        <div
          className="d-flex gap-2 flex-wrap justify-content-center p-3 rounded-3"
          style={{
            backgroundColor: "#16161d",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <span className="me-2 d-flex align-items-center" style={{ color: "#71717a", fontSize: "0.9rem" }}>
            Template:
          </span>
          {templates.map(({ id, label }) => (
            <button
              key={id}
              className="btn btn-sm rounded-pill px-3"
              onClick={() => setSelectedTemplate(id)}
              style={{
                minWidth: "100px",
                height: "36px",
                backgroundColor: selectedTemplate === id ? "#a78bfa" : "transparent",
                color: selectedTemplate === id ? "#fff" : "#a1a1aa",
                border: selectedTemplate === id ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
                fontWeight: selectedTemplate === id ? "600" : "500",
                transition: "all 0.2s ease",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="d-flex flex-wrap justify-content-center gap-2">
          <button
            className="btn d-flex align-items-center justify-content-center gap-2 px-4"
            onClick={() => navigate("/dashboard")}
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#a1a1aa",
            }}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            className="btn d-flex align-items-center justify-content-center gap-2 px-4"
            onClick={handleSaveAndExit}
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
              border: "none",
              color: "white",
            }}
          >
            {loading ? <Loader2 className="spin-animation" size={18} /> : <Save size={18} />}
            {loading ? "Saving..." : "Save & Exit"}
          </button>

          <button
            className="btn d-flex align-items-center justify-content-center gap-2 px-4"
            disabled={downloading}
            onClick={handleDownloadPdf}
            style={{
              backgroundColor: "#22c55e",
              border: "none",
              color: "white",
            }}
          >
            {downloading ? <Loader2 className="spin-animation" size={18} /> : <Download size={18} />}
            {downloading ? "Downloading..." : "Download PDF"}
          </button>

          <button
            className="btn d-flex align-items-center justify-content-center gap-2 px-4"
            onClick={handleDelete}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #ef4444",
              color: "#ef4444",
            }}
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Display the invoice preview */}
      <div
        className="flex-grow-1 overflow-auto d-flex justify-content-center align-items-start py-4 rounded-3"
        style={{ backgroundColor: "#0f0f14" }}
      >
        <div ref={previewRef} className="invoice-preview">
          <InvoicePreview invoiceData={invoiceData} template={selectedTemplate} />
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
