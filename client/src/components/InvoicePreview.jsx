import {forwardRef} from "react";
import {formatInvoiceData} from "../util/formatInvoiceData.js";
import {templateComponents} from "../util/invoiceTemplate.js";
import Template1 from "../templates/Template1/Template1.jsx";

const InvoicePreview = forwardRef(({invoiceData, template}, ref) => {
    const formattedData = formatInvoiceData(invoiceData);

    const SelectedTemplate = templateComponents[template] || Template1;

    return (
        <div ref={ref} className="invoice-preview container px-2 py-2 overflow-x-auto">
            <SelectedTemplate data={formattedData} />
        </div>
    )
});

export default InvoicePreview;