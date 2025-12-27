import { templates } from "../assets/assets.js";

const TemplateGrid = ({ onTemplateClick }) => {
  return (
    <div className="row g-3">
      {templates.map(({ id, label, image }) => (
        <div className="col-12 col-lg-4 col-sm-6" key={id}>
          <div
            className="rounded-3 overflow-hidden cursor-pointer"
            title={label}
            onClick={() => onTemplateClick(id)}
            style={{
              backgroundColor: "#1a1a24",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 8px 25px rgba(167, 139, 250, 0.2)";
              e.currentTarget.style.borderColor = "rgba(167, 139, 250, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
            }}
          >
            <div style={{ backgroundColor: "#fff", padding: "8px" }}>
              <img
                src={image}
                alt={label}
                className="w-100"
                loading="lazy"
                style={{ borderRadius: "4px" }}
              />
            </div>
            <div
              className="p-2 text-center fw-medium"
              style={{ color: "#a1a1aa", fontSize: "0.9rem" }}
            >
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateGrid;
