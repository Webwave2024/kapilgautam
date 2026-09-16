import { useState, useRef } from "react";
import "./FormCss.css";
import logo from "./logo.png";
import PdfLayout from "./PdfLayout";

const FormComponent = () => {
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        address: "",
        gst: "",
        pan: "",
        package: "",
        Tenure: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const pdfRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const handleDownload = () => {
        if (pdfRef.current) {
            pdfRef.current.generatePDF();
        }
    };

    return (
        <div className="main">
            <div className="form-container">

                <form onSubmit={handleSubmit} className="form-box">
                    <div className="logo-container">
                        <img src={logo} alt="Company Logo" className="logo" />
                        <h2>Fill the Details</h2>
                    </div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <label>Company Name:</label>
                    <input
                        type="text"
                        name="company"
                        placeholder="Company Name"
                        value={formData.company}
                        onChange={handleChange}
                        required
                    />
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                    <label>GST Number:</label>
                    <input
                        type="text"
                        name="gst"
                        placeholder="GST Number"
                        value={formData.gst}
                        onChange={handleChange}
                        required
                    />
                    <label>PAN Number:</label>
                    <input
                        type="text"
                        name="pan"
                        placeholder="PAN Number"
                        value={formData.pan}
                        onChange={handleChange}
                        required
                    />
                    <label>Package:</label>
                    <select name="package" value={formData.package} onChange={handleChange} required>
                        <option value="">Select a Plan</option>
                        <option value="Basic">Basic</option>
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                    </select>
                    <label>Tenure:</label>
                    <input
                        type="number"
                        name="Tenure"
                        placeholder="Tenure"
                        value={formData.Tenure}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="submit-btn">Submit</button>
                </form>

                {submitted && (
                    <>
                        <PdfLayout ref={pdfRef} formData={formData} />
                        <button
                            onClick={handleDownload}
                            className="download-btn"
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            Download PDF
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FormComponent;