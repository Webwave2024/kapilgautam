import React, { forwardRef, useImperativeHandle } from "react";
import html2pdf from "html2pdf.js";
import logo from "../components/logo.png";

const PdfLayout = forwardRef(({ formData }, ref) => {
    const financialYear = "2026-27";

    // Get invoice counter from localStorage (persists across page refreshes)
    const getInvoiceCounter = () => {
        const counter = localStorage.getItem('invoiceCounter');
        return counter ? parseInt(counter, 10) : 0;
    };

    const invoiceCounter = getInvoiceCounter();
    const invoiceNumber = `WBPL/${financialYear}/${invoiceCounter.toString().padStart(2, '0')}`;
    const items = formData?.items || [];

    const calculateItemTotals = (item) => {
        const amount = parseFloat(item.amount) || 0;
        const igstRate = 18;
        const cgstRate = 0;
        const sgstRate = 0;

        const igstAmount = amount * (igstRate / 100);
        const cgstAmount = amount * (cgstRate / 100);
        const sgstAmount = amount * (sgstRate / 100);
        const total = amount + igstAmount + cgstAmount + sgstAmount;

        return {
            amount,
            igstAmount,
            cgstAmount,
            sgstAmount,
            total,
        };
    };

    const grandTotals = items.reduce((acc, item) => {
        const itemTotals = calculateItemTotals(item);
        return {
            amount: acc.amount + itemTotals.amount,
            igstAmount: acc.igstAmount + itemTotals.igstAmount,
            cgstAmount: acc.cgstAmount + itemTotals.cgstAmount,
            sgstAmount: acc.sgstAmount + itemTotals.sgstAmount,
            total: acc.total + itemTotals.total,
        };
    }, { amount: 0, igstAmount: 0, cgstAmount: 0, sgstAmount: 0, total: 0 });

    const generatePDF = () => {
        try {
            const element = document.getElementById("pdf-content");
            if (!element) {
                throw new Error("PDF content element not found");
            }

            const options = {
                margin: 10,
                filename: `Invoice_${invoiceNumber}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    logging: true,
                    useCORS: true,
                    backgroundColor: "#FFFFFF",
                },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            };

            html2pdf().set(options).from(element).save();
            // Increment counter in localStorage
            const currentCounter = parseInt(localStorage.getItem('invoiceCounter') || '0', 10);
            localStorage.setItem('invoiceCounter', (currentCounter + 1).toString());
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    useImperativeHandle(ref, () => ({
        generatePDF,
    }));

    const formatField = (value) => value || '-';

    return (
        <div style={{ display: "none" }}>
            <div id="pdf-content" style={pdfStyles.content}>
                <div style={pdfStyles.header}>
                    <img src={logo} alt="Company Logo" style={pdfStyles.logo} />
                    <h2 style={pdfStyles.title}>TAX INVOICE</h2>
                </div>

                <div style={pdfStyles.detailsRow}>
                    <div style={pdfStyles.invoiceColumn}>
                        <p style={pdfStyles.detailItem}><strong>Invoice No:</strong> {invoiceNumber}</p>
                        <p style={pdfStyles.detailItem}><strong>Invoice Date:</strong> {formatField(formData?.date)}</p>
                        <p style={pdfStyles.detailItem}><strong>Due Date:</strong> {formatField(formData?.adate)}</p>
                    </div>

                    <div style={pdfStyles.billedByColumn}>
                        <h3 style={pdfStyles.sectionTitle}>Billed By:</h3>
                        <p style={pdfStyles.detailItem}>WebWave Business Pvt. Ltd.</p>
                        <p style={pdfStyles.detailItem}>S-21 1st Floor Ajay Enclave</p>
                        <p style={pdfStyles.detailItem}>Subhash Nagar, New Delhi 110027</p>
                        <p style={pdfStyles.detailItem}><strong>GSTIN:</strong> 07AADCW8027D1ZE</p>
                        <p style={pdfStyles.detailItem}><strong>PAN:</strong> AADCW8027D</p>
                    </div>

                    <div style={pdfStyles.billedToColumn}>
                        <h3 style={pdfStyles.sectionTitle}>Billed To:</h3>
                        <p style={pdfStyles.detailItem}>{formatField(formData?.name)}</p>
                        <p style={pdfStyles.detailItem}>{formatField(formData?.company)}</p>
                        <p style={pdfStyles.detailItem}>{formatField(formData?.address)}</p>
                        {formData?.gst && <p style={pdfStyles.detailItem}><strong>GSTIN:</strong> {formData.gst}</p>}
                        {formData?.pan && <p style={pdfStyles.detailItem}><strong>PAN:</strong> {formData.pan}</p>}
                    </div>
                </div>

                <table style={pdfStyles.itemsTable}>
                    <thead>
                        <tr>
                            <th style={pdfStyles.tableHeader}>#</th>
                            <th style={{ ...pdfStyles.tableHeader, width: '30%' }}>Description</th>
                            <th style={pdfStyles.tableHeader}>HSN/SAC</th>
                            <th style={pdfStyles.tableHeader}>Qty</th>
                            <th style={pdfStyles.tableHeader}>Amount (₹)</th>
                            <th style={pdfStyles.tableHeader}>IGST (18%)</th>
                            <th style={pdfStyles.tableHeader}>CGST (0%)</th>
                            <th style={pdfStyles.tableHeader}>SGST (0%)</th>
                            <th style={pdfStyles.tableHeader}>Total (₹)</th>
                            <th style={pdfStyles.tableHeader}>Tenure</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => {
                            const itemTotals = calculateItemTotals(item);
                            return (
                                <tr key={index}>
                                    <td style={pdfStyles.tableCell}>{index + 1}</td>
                                    <td style={{ ...pdfStyles.tableCell, width: '30%' }}>{formatField(item.description)}</td>
                                    <td style={pdfStyles.tableCell}>{formatField(item.hsn)}</td>
                                    <td style={pdfStyles.tableCell}>{item.quantity || 0}</td>
                                    <td style={pdfStyles.tableCell}>{itemTotals.amount.toFixed(2)}</td>
                                    <td style={pdfStyles.tableCell}>{itemTotals.igstAmount.toFixed(2)}</td>
                                    <td style={pdfStyles.tableCell}>{itemTotals.cgstAmount.toFixed(2)}</td>
                                    <td style={pdfStyles.tableCell}>{itemTotals.sgstAmount.toFixed(2)}</td>
                                    <td style={pdfStyles.tableCell}>{itemTotals.total.toFixed(2)}</td>
                                    <td style={pdfStyles.tableCell}>{item.tenure ? `${item.tenure} month(s)` : '-'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div style={pdfStyles.totalContainer}>
                    <div style={pdfStyles.totalRow}>
                        <div style={pdfStyles.totalLabel}>Sub Total:</div>
                        <div style={pdfStyles.totalValue}>₹ {grandTotals.amount.toFixed(2)}</div>
                    </div>
                    <div style={pdfStyles.totalRow}>
                        <div style={pdfStyles.totalLabel}>IGST (18%):</div>
                        <div style={pdfStyles.totalValue}>₹ {grandTotals.igstAmount.toFixed(2)}</div>
                    </div>
                    <div style={pdfStyles.totalRow}>
                        <div style={pdfStyles.totalLabel}>CGST (0%):</div>
                        <div style={pdfStyles.totalValue}>₹ {grandTotals.cgstAmount.toFixed(2)}</div>
                    </div>
                    <div style={pdfStyles.totalRow}>
                        <div style={pdfStyles.totalLabel}>SGST (0%):</div>
                        <div style={pdfStyles.totalValue}>₹ {grandTotals.sgstAmount.toFixed(2)}</div>
                    </div>
                    <div style={{ ...pdfStyles.totalRow, ...pdfStyles.grandTotal }}>
                        <div style={pdfStyles.totalLabel}>Grand Total:</div>
                        <div style={pdfStyles.totalValue}>₹ {grandTotals.total.toFixed(2)}</div>
                    </div>
                </div>

                <div style={pdfStyles.footerNote}>
                    <p style={pdfStyles.noteText}>
                        Our company endeavors to provide our best services to our valuable clients.
                        However, if any of our valuable clients feel deprived due to any wrong or
                        misleading information, service, package, deficiency in providing any or all of
                        our services or packages, or misbehavior or misrepresentation by any of our
                        employees, then such person, client, company, or any other entity may report
                        this matter to our official email (feedback@globalb2bmart.com) within 15
                        days since it comes to their knowledge. *Verified & Contactable Buyers as
                        per the chosen package(based on current availability on globalb2bmart.com)
                    </p>
                </div>
                <div style={pdfStyles.bankBox}>
                    <h3 style={pdfStyles.bankBoxTitle}>Billed By:</h3>
                    <p style={pdfStyles.detailItem}><strong>Account Name:</strong> WEBWAVE BUSINESS PRIVATE LIMITED</p>
                    <p style={pdfStyles.detailItem}><strong>Account Number:</strong> 44576387700</p>
                    <p style={pdfStyles.detailItem}><strong>IFSC:</strong> SBIN0021275</p>
                    <p style={pdfStyles.detailItem}><strong>Branch Name:</strong> GANESH NAGAR</p>
                    <p style={pdfStyles.detailItem}>
                        <strong>Address:</strong> B-1/32, GROUND FLOOR GANESH NAGAR JANAKPURI NEW DELHI 110058
                    </p>
                </div>
                <div style={pdfStyles.signatureContainer}>
                    <p style={pdfStyles.signatureLine}>Signature of authority</p>
                </div>
            </div>
        </div>
    );
});

const pdfStyles = {
    content: {
        backgroundColor: "#FFFFFF",
        color: "#000000",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        paddingBottom: "20px",
        borderBottom: "1px solid #000",
    },
    logo: {
        height: "60px",
    },
    title: {
        color: "#333",
        margin: 0,
        fontSize: "20px",
        fontWeight: "bold",
    },
    detailsRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
        paddingBottom: "15px",
    },
    invoiceColumn: {
        flex: 1,
        padding: "0 10px",
    },
    billedByColumn: {
        flex: 1,
        padding: "0 10px",
    },
    billedToColumn: {
        flex: 1,
        padding: "0 10px",
    },
    sectionTitle: {
        fontSize: "14px",
        fontWeight: "bold",
        marginBottom: "8px",
        color: "#333",
    },
    detailItem: {
        margin: "5px 0",
        fontSize: "12px",
    },
    itemsTable: {
        width: "100%",
        borderCollapse: "collapse",
        margin: "20px 0",
        border: "1px solid #000",
    },
    tableHeader: {
        backgroundColor: "#f0f0f0",
        padding: "8px",
        textAlign: "center",
        border: "1px solid #000",
        fontSize: "12px",
        fontWeight: "bold",
    },
    tableCell: {
        padding: "8px",
        textAlign: "center",
        border: "1px solid #000",
        fontSize: "12px",
    },
    totalContainer: {
        marginTop: "20px",
        marginLeft: "auto",
        width: "300px",
    },
    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "5px",
        padding: "8px 10px",
    },
    grandTotal: {
        backgroundColor: "#f0f0f0",
        fontWeight: "bold",
        borderTop: "1px solid #000",
        borderBottom: "1px solid #000",
    },
    totalLabel: {
        fontSize: "14px",
    },
    totalValue: {
        fontSize: "14px",
        minWidth: "100px",
        textAlign: "right",
    },
    footerNote: {
        marginTop: "30px",
        padding: "15px",
        borderTop: "1px solid #000",
        fontSize: "11px",
        lineHeight: "1.4",
    },
    noteText: {
        margin: 0,
    },
    bankBox: {
        marginTop: "20px",
        border: "1px solid #000",
        padding: "12px",
        borderRadius: "6px",
        backgroundColor: "#f9f9f9",
        fontSize: "12px",
    },
    bankBoxTitle: {
        fontSize: "14px",
        fontWeight: "bold",
        marginBottom: "8px",
        textAlign: "Start",
        textTransform: "uppercase",
        color: "#333",
    },
    signatureContainer: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "80px",
        paddingRight: "30px",
    },
    signatureLine: {
        fontSize: "13px",
        fontWeight: "bold",
        margin: "0",
    },
};

export default PdfLayout;
