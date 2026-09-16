// import { useState, useRef } from "react";
// import "./FormCss.css";
// import logo from "./logo.avif";
// import PdfLayout from "../components/PdfLayout";

// const OurFormComponent = () => {
//     const [formData, setFormData] = useState({
//         name: "",
//         company: "",
//         address: "",
//         gst: "",
//         pan: "",
//         date:"",
//         adate:"",
//         items: [
//             {
//                 description: "",
//                 hsn: "",
//                 gstRate: "18%",
//                 quantity: 1,
//                 rate: "",
//                 tenure: "",
//                 amount:"",
//             }
//         ]
//     });
//     const [submitted, setSubmitted] = useState(false);
//     const pdfRef = useRef(null);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleItemChange = (index, e) => {
//         const { name, value } = e.target;
//         const newItems = [...formData.items];
//         newItems[index] = {
//             ...newItems[index],
//             [name]: name === 'quantity' || name === 'rate' ? 
//                    (parseFloat(value) || 0) : value
//         };
//         setFormData({ ...formData, items: newItems });
//     };

//     const addItem = () => {
//         setFormData({
//             ...formData,
//             items: [
//                 ...formData.items,
//                 {
//                     description: "",
//                     hsn: "",
//                     gstRate: "18%",
//                     quantity: 1,
//                     rate: "",
//                     tenure: ""
//                 }
//             ]
//         });
//     };

//     const removeItem = (index) => {
//         if (formData.items.length > 1) {
//             const newItems = formData.items.filter((_, i) => i !== index);
//             setFormData({ ...formData, items: newItems });
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setSubmitted(true);
//     };

//     const handleDownload = () => {
//         if (pdfRef.current) {
//             pdfRef.current.generatePDF();
//         }
//     };

//     return (
//         <div className="main">
//             <div className="form-container">
//                 <form onSubmit={handleSubmit} className="form-box">
//                     <div className="logo-container">
//                         <img src={logo} alt="Company Logo" className="logo" />
//                         <h2>Fill the Details</h2>
//                     </div>
//                     <label>Date:</label>
//                     <input
//                         type="date"
//                         name="date"
//                         placeholder="Date"
//                         value={formData.date}
//                         onChange={handleChange}
//                         required
//                     />

//                     <label>Name:</label>
//                     <input
//                         type="text"
//                         name="name"
//                         placeholder="Name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                     />

//                     <label>Company Name:</label>
//                     <input
//                         type="text"
//                         name="company"
//                         placeholder="Company Name"
//                         value={formData.company}
//                         onChange={handleChange}
//                         required
//                     />

//                     <label>Address:</label>
//                     <input
//                         type="text"
//                         name="address"
//                         placeholder="Address"
//                         value={formData.address}
//                         onChange={handleChange}
//                         required
//                     />

//                     <label>GST Number:</label>
//                     <input
//                         type="text"
//                         name="gst"
//                         placeholder="GST Number"
//                         value={formData.gstRate}
//                         onChange={handleChange}
//                         required
//                     />

//                     <label>PAN Number:</label>
//                     <input
//                         type="text"
//                         name="pan"
//                         placeholder="PAN Number"
//                         value={formData.pan}
//                         onChange={handleChange}
//                         required
//                     />

//                     <h3>Items</h3>
//                     {formData.items.map((item, index) => (
//                         <div key={index} className="item-row">
//                             <label>Item Description:</label>
//                             <input
//                                 type="text"
//                                 name="description"
//                                 placeholder="Item description"
//                                 value={item.description}
//                                 onChange={(e) => handleItemChange(index, e)}
//                                 required
//                             />

//                             <label>HSN/SAC Code:</label>
//                             <input
//                                 type="text"
//                                 name="hsn"
//                                 placeholder="HSN/SAC Code"
//                                 value={item.hsn}
//                                 onChange={(e) => handleItemChange(index, e)}

//                             />

//                             <label>GST Rate (%):</label>
//                             <input
//                                 type="gstRate"
//                                 name="gstRate"
//                                 placeholder="GST Rate"
//                                 value={item.gstRate}
//                                 onChange={(e) => handleItemChange(index, e)}
//                                 required
//                             />
//                             <label>IGST Rate (%):</label>
//                             <input
//                                 type="igstRate"
//                                 name="igstRate"
//                                 placeholder="GST Rate"
//                                 value={item.igst}
//                                 onChange={(e) => handleItemChange(index, e)}
//                                 required
//                             />

//                             <label>Quantity:</label>
//                             <input
//                                 type="number"
//                                 name="quantity"
//                                 placeholder="Quantity"
//                                 value={item.quantity}
//                                 onChange={(e) => handleItemChange(index, e)}
//                                 min="1"
//                                 required
//                             />

//                             <label>Tenure (months):</label>
//                             <input
//                                 type="number"
//                                 name="tenure"
//                                 placeholder="Tenure in months"
//                                 value={item.tenure}
//                                 onChange={(e) => handleItemChange(index, e)}
//                                 min="1"
//                                 required
//                             />
//                             <label>Amount:</label>
//                             <input
//                                 type="number"
//                                 name="amount"
//                                 placeholder="amount"
//                                 value={item.amount}
//                                 onChange={(e) => handleItemChange(index, e)}
//                                 min="1"
//                                 required
//                             />
//                             {formData.items.length > 1 && (
//                                 <button
//                                     type="button"
//                                     onClick={() => removeItem(index)}
//                                     className="remove-btn"
//                                 >
//                                     Remove Item
//                                 </button>
//                             )}
//                         </div>
//                     ))}

//                     <label>Amount Due Date:</label>
//                     <input
//                         type="date"
//                         name="adate"
//                         placeholder="Amount Date"
//                         value={formData.adate}
//                         onChange={handleChange}
//                         required
//                     />

//                     <button
//                         type="button"
//                         onClick={addItem}
//                         className="add-btn"
//                     >
//                         + Add Another Item
//                     </button>

//                     <button type="submit" className="submit-btn">Submit</button>
//                 </form>

//                 {submitted && (
//                     <>
//                         <PdfLayout ref={pdfRef} formData={formData} />
//                         <button
//                             onClick={handleDownload}
//                             className="download-btn"
//                         >
//                             Download PDF Invoice
//                         </button>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default OurFormComponent;

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
        ]
    });

    const [submitted, setSubmitted] = useState(false);
    const pdfRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...formData.items];
        newItems[index] = {
            ...newItems[index],
            [name]: name === 'quantity' || name === 'rate' ?
                (parseFloat(value) || 0) : value
        };
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [
                ...formData.items,
                {
                    description: "",
                    amount: "",
                }
            ]
        });
    };

    const removeItem = (index) => {
        if (formData.items.length > 1) {
            const newItems = formData.items.filter((_, i) => i !== index);
            setFormData({ ...formData, items: newItems });
        }
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

                    <label>Date:</label>
                    <input
                        type="date"
                        name="date"
                        placeholder="Date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />


                    <label>Client Name:</label>
                    <input
                        type="text"
                        name="company"
                        placeholder="Client Name"
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

                    <h3>Items</h3>
                    {formData.items.map((item, index) => (
                        <div key={index} className="item-row">
                            <label>Payment Purpose:</label>
                            <input
                                type="text"
                                name="description"
                                placeholder="Payment Purpose"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, e)}
                                required
                            />

                            <label>Amount:</label>
                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={item.amount}
                                onChange={(e) => handleItemChange(index, e)}
                                min="0"
                                step="0.01"
                                required
                            />

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

                    <label>Amount Due Date:</label>
                    <input
                        type="date"
                        name="adate"
                        placeholder="Amount Date"
                        value={formData.adate}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="button"
                        onClick={addItem}
                        className="add-btn"
                    >
                        + Add Another Item
                    </button>

                    <button type="submit" className="submit-btn">Submit</button>
                </form>

                {submitted && (
                    <>
                        <PdfLayout ref={pdfRef} formData={formData} />
                        <button
                            onClick={handleDownload}
                            className="download-btn"
                        >
                            Download PDF Invoice
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default OurFormComponent;
