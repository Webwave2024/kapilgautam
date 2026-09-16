import { useState, useRef } from "react";
import "./FormCss.css";
import logo from "../components/logo.png";
import PdfLayout from "../components/PdfLayout";

const OurFormComponent = () => {
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        address: "",
        gst: "",
        pan: "",
        date: "",
        adate: "",
        items: [
            {
                description: "",
                amount: "",
            }
        ],
        accountName: "",
        accountNumber: "",
        ifsc: "",
        bankName: "",
        branch: "",
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const pdfRef = useRef(null);

    // ── Validation Rules ──────────────────────────────────────────────────
    const validate = (data) => {
        const errs = {};

        if (!data.date) errs.date = "Issue date is required.";

        if (!data.company.trim()) errs.company = "Client name is required.";

        if (!data.address.trim()) errs.address = "Address is required.";

        const itemErrors = data.items.map((item) => {
            const ie = {};
            if (!item.description.trim()) ie.description = "Payment purpose is required.";
            const amt = parseFloat(item.amount);
            if (item.amount === "" || isNaN(amt)) ie.amount = "Amount is required.";
            else if (amt <= 0) ie.amount = "Amount must be greater than 0.";
            return ie;
        });
        if (itemErrors.some((ie) => Object.keys(ie).length > 0)) {
            errs.items = itemErrors;
        }

        if (!data.adate) {
            errs.adate = "Due date is required.";
        } else if (data.date && data.adate <= data.date) {
            errs.adate = "Due date must be after the issue date.";
        }

        if (!data.accountName.trim()) errs.accountName = "Account name is required.";

        if (!data.accountNumber.trim()) {
            errs.accountNumber = "Account number is required.";
        } else if (!/^\d{9,18}$/.test(data.accountNumber.trim())) {
            errs.accountNumber = "Enter a valid account number (9–18 digits).";
        }

        if (!data.ifsc.trim()) {
            errs.ifsc = "IFSC code is required.";
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifsc.trim().toUpperCase())) {
            errs.ifsc = "Invalid IFSC code format (e.g. SBIN0001234).";
        }

        if (!data.bankName.trim()) errs.bankName = "Bank name is required.";
        if (!data.branch.trim()) errs.branch = "Branch name is required.";

        return errs;
    };

    // ── Handlers ─────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
        }
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...formData.items];
        newItems[index] = {
            ...newItems[index],
            [name]: name === "quantity" || name === "rate"
                ? (parseFloat(value) || 0)
                : value,
        };
        setFormData((prev) => ({ ...prev, items: newItems }));
        // Clear item-level error on change
        if (errors.items?.[index]?.[name]) {
            setErrors((prev) => {
                const newItemErrors = [...(prev.items || [])];
                if (newItemErrors[index]) {
                    const ie = { ...newItemErrors[index] };
                    delete ie[name];
                    newItemErrors[index] = ie;
                }
                return { ...prev, items: newItemErrors };
            });
        }
    };

    const addItem = () => {
        setFormData((prev) => ({
            ...prev,
            items: [...prev.items, { description: "", amount: "" }],
        }));
    };

    const removeItem = (index) => {
        if (formData.items.length > 1) {
            setFormData((prev) => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index),
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate(formData);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            setTimeout(() => {
                const firstErr = document.querySelector(".field-error");
                if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 50);
            return;
        }
        setErrors({});
        setSubmitted(true);
    };

    const handleDownload = () => {
        if (pdfRef.current) pdfRef.current.generatePDF();
    };

    const ErrMsg = ({ msg }) =>
        msg ? <span className="field-error">{msg}</span> : null;

    return (
        <div className="main">
            <div className="form-container">
                <form onSubmit={handleSubmit} className="form-box" noValidate>
                    <div className="logo-container">
                        <img src={logo} alt="Company Logo" className="logo" />
                        <h2>Fill the Details</h2>
                    </div>

                    {/* ── Issue Date ── */}
                    <label>Issue Date: <span className="req">*</span></label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={errors.date ? "input-error" : ""}
                    />
                    <ErrMsg msg={errors.date} />

                    {/* ── Client Name ── */}
                    <label>Client Name: <span className="req">*</span></label>
                    <input
                        type="text"
                        name="company"
                        placeholder="Client Name"
                        value={formData.company}
                        onChange={handleChange}
                        className={errors.company ? "input-error" : ""}
                    />
                    <ErrMsg msg={errors.company} />

                    {/* ── Address ── */}
                    <label>Address: <span className="req">*</span></label>
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        className={errors.address ? "input-error" : ""}
                    />
                    <ErrMsg msg={errors.address} />

                    {/* ── Items ── */}
                    <h3>Items</h3>
                    {formData.items.map((item, index) => (
                        <div key={index} className="item-row">
                            <label>Payment Purpose: <span className="req">*</span></label>
                            <input
                                type="text"
                                name="description"
                                placeholder="Payment Purpose"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, e)}
                                className={errors.items?.[index]?.description ? "input-error" : ""}
                            />
                            <ErrMsg msg={errors.items?.[index]?.description} />

                            <label>Amount (₹): <span className="req">*</span></label>
                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={item.amount}
                                onChange={(e) => handleItemChange(index, e)}
                                min="0.01"
                                step="0.01"
                                className={errors.items?.[index]?.amount ? "input-error" : ""}
                            />
                            <ErrMsg msg={errors.items?.[index]?.amount} />

                            {formData.items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="remove-btn"
                                >
                                    Remove Item
                                </button>
                            )}
                        </div>
                    ))}

                    {/* ── Due Date ── */}
                    <label>Amount Due Date: <span className="req">*</span></label>
                    <input
                        type="date"
                        name="adate"
                        value={formData.adate}
                        onChange={handleChange}
                        className={errors.adate ? "input-error" : ""}
                    />
                    <ErrMsg msg={errors.adate} />

                    <button type="button" onClick={addItem} className="add-btn">
                        + Add Another Item
                    </button>

                    {/* ── Account Details ── */}
                    <h3>Account Details</h3>

                    <label>Account Name: <span className="req">*</span></label>
                    <input
                        type="text"
                        name="accountName"
                        placeholder="Account Holder Name"
                        value={formData.accountName}
                        onChange={handleChange}
                        className={errors.accountName ? "input-error" : ""}
                    />
                    <ErrMsg msg={errors.accountName} />

                    <label>Account Number: <span className="req">*</span></label>
                    <input
                        type="text"
                        name="accountNumber"
                        placeholder="Account Number (9–18 digits)"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        className={errors.accountNumber ? "input-error" : ""}
                    />
                    <ErrMsg msg={errors.accountNumber} />

                    <label>IFSC Code: <span className="req">*</span></label>
                    <input
                        type="text"
                        name="ifsc"
                        placeholder="e.g. SBIN0001234"
                        value={formData.ifsc}
                        maxLength={11}
                        onChange={(e) =>
                            handleChange({ target: { name: "ifsc", value: e.target.value.toUpperCase() } })
                        }
                        className={errors.ifsc ? "input-error" : ""}
                    />
                    <ErrMsg msg={errors.ifsc} />

                    <label>Bank Name: <span className="req">*</span></label>
                    <input
                        type="text"
                        name="bankName"
                        placeholder="Bank Name"
                        value={formData.bankName}
                        onChange={handleChange}
                        className={errors.bankName ? "input-error" : ""}
                    />
                    <ErrMsg msg={errors.bankName} />

                    <label>Branch: <span className="req">*</span></label>
                    <input
                        type="text"
                        name="branch"
                        placeholder="Branch Name"
                        value={formData.branch}
                        onChange={handleChange}
                        className={errors.branch ? "input-error" : ""}
                    />
                    <ErrMsg msg={errors.branch} />

                    <button type="submit" className="submit-btn">Submit</button>
                </form>

                {submitted && (
                    <>
                        <PdfLayout ref={pdfRef} formData={formData} />
                        <button onClick={handleDownload} className="download-btn">
                            Download PDF Invoice
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default OurFormComponent;
