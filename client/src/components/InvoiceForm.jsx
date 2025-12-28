import { assets } from "../assets/assets.js";
import { Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { AppContext } from "../context/AppContext.jsx";
import { uploadCompanyLogo } from "../service/cloudinaryService.js";

const InvoiceForm = () => {
  const { invoiceData, setInvoiceData } = useContext(AppContext);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", qty: "", amount: "", description: "", total: 0 }],
    }));
  };

  const deleteItem = (index) => {
    const items = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData((prev) => ({ ...prev, items }));
  };

  const handleChange = (section, field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSameAsBilling = () => {
    setInvoiceData((prev) => ({
      ...prev,
      shipping: { ...prev.billing },
    }));
  };

  const handleItemChange = (index, field, value) => {
    const items = [...invoiceData.items];
    items[index][field] = value;
    if (field === "qty" || field === "amount") {
      const qty = Number(items[index].qty) || 0;
      const amount = Number(items[index].amount) || 0;
      items[index].total = qty * amount;
    }
    setInvoiceData((prev) => ({ ...prev, items }));
  };

  const calculateTotals = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.total || 0), 0);
    const taxRate = Number(invoiceData.tax) || 0;
    const taxAmount = taxRate > 0 ? (subtotal * taxRate) / 100 : 0;
    const grandTotal = subtotal + taxAmount;
    return { subtotal, taxAmount, grandTotal };
  };

  const { subtotal, taxAmount, grandTotal } = calculateTotals();

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setUploadingLogo(true);
        const logoUrl = await uploadCompanyLogo(file);
        setInvoiceData((prev) => ({
          ...prev,
          logo: logoUrl,
        }));
        toast.success("Logo uploaded successfully");
      } catch (error) {
        console.error("Logo upload failed:", error);
        toast.error("Failed to upload logo");
      } finally {
        setUploadingLogo(false);
      }
    }
  };

  useEffect(() => {
    if (!invoiceData.invoice.number) {
      const randomNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
      setInvoiceData((prev) => ({
        ...prev,
        invoice: { ...prev.invoice, number: randomNumber },
      }));
    }
  }, []);

  const sectionStyle = {
    backgroundColor: "#0f0f14",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "12px",
    padding: "1.25rem",
    marginBottom: "1.5rem",
  };

  const labelStyle = {
    color: "#a1a1aa",
    fontSize: "0.85rem",
    fontWeight: "500",
    marginBottom: "0.5rem",
  };

  return (
    <div className="invoiceform">
      {/* Company logo */}
      <div style={sectionStyle}>
        <h6 style={{ color: "#fafafa", marginBottom: "1rem" }}>Company Logo</h6>
        <div className="d-flex align-items-center gap-3">
          <label
            htmlFor="image"
            style={{
              cursor: uploadingLogo ? "wait" : "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              opacity: uploadingLogo ? 0.6 : 1,
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "12px",
                border: "2px dashed rgba(167, 139, 250, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                backgroundColor: "#1a1a24",
              }}
            >
              {uploadingLogo ? (
                <span style={{ color: "#a78bfa", fontSize: "0.8rem" }}>Uploading...</span>
              ) : (
                <img
                  src={invoiceData.logo ? invoiceData.logo : assets.upload_area}
                  alt="upload"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
            <span style={{ color: "#71717a", fontSize: "0.8rem" }}>{uploadingLogo ? "Please wait..." : "Click to upload"}</span>
          </label>
          <input
            type="file"
            name="logo"
            id="image"
            hidden
            className="form-control"
            accept="image/*"
            onChange={handleLogoUpload}
            disabled={uploadingLogo}
          />
        </div>
      </div>

      {/* Company info */}
      <div style={sectionStyle}>
        <h6 style={{ color: "#fafafa", marginBottom: "1rem" }}>Your Company</h6>
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Company name"
              onChange={(e) => handleChange("company", "name", e.target.value)}
              value={invoiceData.company.name}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Company phone number"
              onChange={(e) => handleChange("company", "phone", e.target.value)}
              value={invoiceData.company.phone}
            />
          </div>
          <div className="col-md-12">
            <input
              type="text"
              className="form-control"
              placeholder="Company address"
              onChange={(e) => handleChange("company", "address", e.target.value)}
              value={invoiceData.company.address}
            />
          </div>
        </div>
      </div>

      {/* Billing section */}
      <div style={sectionStyle}>
        <h6 style={{ color: "#fafafa", marginBottom: "1rem" }}>Bill To</h6>
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              onChange={(e) => handleChange("billing", "name", e.target.value)}
              value={invoiceData.billing.name}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Phone number"
              onChange={(e) => handleChange("billing", "phone", e.target.value)}
              value={invoiceData.billing.phone}
            />
          </div>
          <div className="col-md-12">
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              onChange={(e) => handleChange("billing", "address", e.target.value)}
              value={invoiceData.billing.address}
            />
          </div>
        </div>
      </div>

      {/* Ship to */}
      <div style={sectionStyle}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 style={{ color: "#fafafa", marginBottom: 0 }}>Ship To</h6>
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="sameAsBilling" onChange={handleSameAsBilling} />
            <label htmlFor="sameAsBilling" className="form-check-label" style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>
              Same as Billing
            </label>
          </div>
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              onChange={(e) => handleChange("shipping", "name", e.target.value)}
              value={invoiceData.shipping.name}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Phone number"
              onChange={(e) => handleChange("shipping", "phone", e.target.value)}
              value={invoiceData.shipping.phone}
            />
          </div>
          <div className="col-md-12">
            <input
              type="text"
              className="form-control"
              placeholder="Shipping address"
              onChange={(e) => handleChange("shipping", "address", e.target.value)}
              value={invoiceData.shipping.address}
            />
          </div>
        </div>
      </div>

      {/* Invoice info */}
      <div style={sectionStyle}>
        <h6 style={{ color: "#fafafa", marginBottom: "1rem" }}>Invoice Information</h6>
        <div className="row g-3">
          <div className="col-md-4">
            <label style={labelStyle}>Invoice Number</label>
            <input
              type="text"
              disabled
              className="form-control"
              value={invoiceData.invoice.number}
              onChange={(e) => handleChange("invoice", "number", e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label style={labelStyle}>Invoice Date</label>
            <input
              type="date"
              className="form-control"
              onChange={(e) => handleChange("invoice", "date", e.target.value)}
              value={invoiceData.invoice.date}
            />
          </div>
          <div className="col-md-4">
            <label style={labelStyle}>Due Date</label>
            <input
              type="date"
              className="form-control"
              onChange={(e) => handleChange("invoice", "dueDate", e.target.value)}
              value={invoiceData.invoice.dueDate}
            />
          </div>
        </div>
      </div>

      {/* Item details */}
      <div style={sectionStyle}>
        <h6 style={{ color: "#fafafa", marginBottom: "1rem" }}>Item Details</h6>
        {invoiceData.items.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#1a1a24",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div className="row g-3 mb-2">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Item Name"
                  onChange={(e) => handleItemChange(index, "name", e.target.value)}
                  value={item.name}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  placeholder="Quantity"
                  className="form-control"
                  onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                  value={item.qty}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  placeholder="Amount"
                  className="form-control"
                  onChange={(e) => handleItemChange(index, "amount", e.target.value)}
                  value={item.amount}
                />
              </div>
              <div className="col-md-3">
                <input type="number" className="form-control" placeholder="0.00" value={item.total.toFixed(2)} disabled />
              </div>
            </div>
            <div className="d-flex gap-2">
              <textarea
                className="form-control"
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                rows={2}
              ></textarea>
              {invoiceData.items.length > 1 && (
                <button
                  className="btn"
                  type="button"
                  onClick={() => deleteItem(index)}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #ef4444",
                    color: "#ef4444",
                    padding: "0.5rem 0.75rem",
                  }}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          className="btn"
          type="button"
          onClick={addItem}
          style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
            border: "none",
            color: "white",
            fontWeight: "600",
          }}
        >
          + Add Item
        </button>
      </div>

      {/* Bank details */}
      <div style={sectionStyle}>
        <h6 style={{ color: "#fafafa", marginBottom: "1rem" }}>Bank Account Details</h6>
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Recipient name"
              onChange={(e) => handleChange("account", "name", e.target.value)}
              value={invoiceData.account.name}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="IBAN"
              onChange={(e) => handleChange("account", "number", e.target.value)}
              value={invoiceData.account.number}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Bank SWIFT"
              onChange={(e) => handleChange("account", "SWIFT", e.target.value)}
              value={invoiceData.account.SWIFT}
            />
          </div>
        </div>
      </div>

      {/* Total */}
      <div style={sectionStyle}>
        <h6 style={{ color: "#fafafa", marginBottom: "1rem" }}>Totals</h6>
        <div className="d-flex justify-content-end">
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <div className="d-flex justify-content-between py-2" style={{ color: "#a1a1aa" }}>
              <span>Subtotal</span>
              <span style={{ color: "#fafafa" }}>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2">
              <label style={{ color: "#a1a1aa" }}>Tax Rate (%)</label>
              <input
                type="number"
                className="form-control text-end"
                style={{ width: "120px" }}
                placeholder="0"
                onChange={(e) => setInvoiceData((prev) => ({ ...prev, tax: e.target.value }))}
                value={invoiceData.tax}
              />
            </div>
            <div className="d-flex justify-content-between py-2" style={{ color: "#a1a1aa" }}>
              <span>Tax Amount</span>
              <span style={{ color: "#fafafa" }}>₹{taxAmount.toFixed(2)}</span>
            </div>
            <hr style={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
            <div className="d-flex justify-content-between py-2 fw-bold" style={{ fontSize: "1.1rem" }}>
              <span style={{ color: "#fafafa" }}>Grand Total</span>
              <span style={{ color: "#a78bfa" }}>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div style={sectionStyle}>
        <h6 style={{ color: "#fafafa", marginBottom: "1rem" }}>Notes</h6>
        <textarea
          name="notes"
          className="form-control"
          rows={3}
          placeholder="Add any additional notes..."
          value={invoiceData.notes}
          onChange={(e) => setInvoiceData((prev) => ({ ...prev, notes: e.target.value }))}
        ></textarea>
      </div>
    </div>
  );
};

export default InvoiceForm;
