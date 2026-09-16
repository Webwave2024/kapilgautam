import React, { forwardRef, useImperativeHandle } from "react";
import html2pdf from "html2pdf.js";
import logo from "./logo.png";

const C = {
    navy: "#1a1a4e",
    gold: "#f0a500",
    lightNavy: "#2d2d7a",
    white: "#ffffff",
    lightGray: "#f5f5f5",
    borderGray: "#d0d0d0",
    textDark: "#1a1a1a",
    textMid: "#444444",
};

const PdfLayout = forwardRef(({ formData }, ref) => {
    const financialYear = "2026-27";

    // Get invoice counter from localStorage (persists across page refreshes)
    const getInvoiceCounter = () => {
        const counter = localStorage.getItem('invoiceCounter');
        return counter ? parseInt(counter, 10) : 0;
    };

    const invoiceCounter = getInvoiceCounter();
    const invoiceNumber = `KG/${financialYear}/${invoiceCounter.toString().padStart(3, '0')}`;
    const items = formData?.items || [];

    const grandTotal = items.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);

    const numberToWords = (num) => {
        const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
            "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
            "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
        if (num === 0) return "Zero";
        if (num < 20) return ones[num];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
        if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + numberToWords(num % 100) : "");
        if (num < 100000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "");
        if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + numberToWords(num % 100000) : "");
        return numberToWords(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + numberToWords(num % 10000000) : "");
    };
    const amountInWords = numberToWords(Math.floor(grandTotal)) + " Rupees Only";

    const generatePDF = () => {
        try {
            const element = document.getElementById("pdf-content");
            if (!element) {
                throw new Error("PDF content element not found");
            }

            const options = {
                margin: [8, 8, 8, 8],
                filename: `Invoice_${invoiceNumber}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, backgroundColor: "#FFFFFF" },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            };

            html2pdf().set(options).from(element).save();
            const currentCounter = parseInt(localStorage.getItem('invoiceCounter') || '1', 10);
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
            <div id="pdf-content" style={s.page}>

                {/* HEADER */}
                <div style={s.header}>
                    <div style={s.headerLeft}>
                        <img src={logo} alt="Logo" style={s.logo} />
                        <div style={s.headerName}>
                            <span style={s.advocateName}>Kapil Gautam</span>
                            <span style={s.advocateTitle}>Advocate</span>
                            <span style={s.advocateQual}>LL.B(H), LL.M</span>
                            <span style={s.advocateQual2}>(Criminal Law, Criminology &amp; Forensic Science)</span>
                        </div>
                    </div>
                    <div style={s.headerRight}>
                        <div style={s.originalTag}>Original for Recipient</div>
                        <div style={s.invoiceTitle}>TAX INVOICE</div>
                        <div style={s.invoiceNumber}>{invoiceNumber}</div>
                    </div>
                </div>

                {/* AMOUNT DUE BANNER */}
                <div style={s.amountBanner}>
                    <span style={s.bannerLabel}>Amount Due:</span>
                    <span style={s.bannerAmount}>&#8377; {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>

                {/* DATE ROW */}
                <div style={s.dateRow}>
                    <div style={s.dateBlock}>
                        <div style={s.dateItem}>
                            <span style={s.dateLabel}>Issue Date:</span>
                            <span style={s.dateValue}>{formatField(formData?.date)}</span>
                        </div>
                        <div style={s.dateItem}>
                            <span style={s.dateLabel}>Due Date:</span>
                            <span style={s.dateValue}>{formatField(formData?.adate)}</span>
                        </div>
                    </div>
                </div>

                {/* BILLED BY / BILLED TO */}
                <div style={s.billingRow}>
                    <div style={s.billedByBox}>
                        <div style={s.billingHeading}>Billed By</div>
                        <p style={s.billingName}>Kapil Gautam, Advocate</p>
                        <p style={s.billingDetail}>LL.B(H), LL.M (Criminal Law, Criminology and Forensic Science)</p>
                        <p style={s.billingDetail}>New Delhi, India</p>
                    </div>
                    <div style={s.billedToBox}>
                        <div style={s.billingHeading}>Billed To</div>
                        <p style={s.billingName}>{formatField(formData?.company)}</p>
                        <p style={s.billingDetail}>{formatField(formData?.name)}</p>
                        <p style={s.billingDetail}>{formatField(formData?.address)}</p>
                    </div>
                </div>

                {/* ITEMS TABLE */}
                <table style={s.table}>
                    <thead>
                        <tr>
                            <th style={{ ...s.th, width: "5%" }}>S.No</th>
                            <th style={{ ...s.th, width: "65%", textAlign: "left" }}>Payment Purpose</th>
                            <th style={{ ...s.th, width: "30%" }}>Amount (&#8377;)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index} style={index % 2 === 0 ? s.trEven : s.trOdd}>
                                <td style={{ ...s.td, textAlign: "center" }}>{index + 1}</td>
                                <td style={{ ...s.td, color: C.lightNavy, fontWeight: "600" }}>{formatField(item.description)}</td>
                                <td style={{ ...s.td, textAlign: "right" }}>
                                    {(parseFloat(item.amount) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="2" style={{ ...s.td, textAlign: "right", fontWeight: "bold", borderTop: `2px solid ${C.navy}` }}>Total</td>
                            <td style={{ ...s.td, textAlign: "right", fontWeight: "bold", borderTop: `2px solid ${C.navy}` }}>
                                {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {/* TOTALS SUMMARY */}
                <div style={s.totalsSection}>
                    <div style={s.totalsRight}>
                        <div style={s.totalLine}>
                            <span style={s.totalLbl}>Total Value (in figures)</span>
                            <span style={s.totalVal}>&#8377; {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style={{ ...s.totalLine, ...s.grandTotalLine }}>
                            <span style={s.totalLbl}>Total Value (in words)</span>
                            <span style={{ ...s.totalVal, fontStyle: "italic", fontSize: "10px" }}>{amountInWords}</span>
                        </div>
                    </div>
                </div>

                {/* BANK DETAILS */}
                <div style={s.bankSection}>
                    <div style={s.bankHeading}>Bank / Payment Details</div>
                    <div style={s.bankGrid}>
                        <div style={s.bankRow}>
                            <span style={s.bankLabel}>Account Name:</span>
                            <span style={s.bankValue}>KAPIL GAUTAM</span>
                        </div>
                        <div style={s.bankRow}>
                            <span style={s.bankLabel}>Account Number:</span>
                            <span style={s.bankValue}>XXXXXXXXXXXX</span>
                        </div>
                        <div style={s.bankRow}>
                            <span style={s.bankLabel}>IFSC Code:</span>
                            <span style={s.bankValue}>XXXXXXXX</span>
                        </div>
                        <div style={s.bankRow}>
                            <span style={s.bankLabel}>Bank Name:</span>
                            <span style={s.bankValue}>XXXXXXX BANK</span>
                        </div>
                        <div style={s.bankRow}>
                            <span style={s.bankLabel}>Branch:</span>
                            <span style={s.bankValue}>XXXXXXX</span>
                        </div>
                        <div style={s.bankRow}>
                            <span style={s.bankLabel}>UPI ID:</span>
                            <span style={s.bankValue}>XXXXXXX@upi</span>
                        </div>
                    </div>
                </div>

                {/* SIGNATURE */}
                <div style={s.signatureSection}>
                    <div style={s.signatureBox}>
                        <div style={s.signatureLine}></div>
                        <p style={s.signatureLabel}>Signature of Advocate</p>
                        <p style={s.signatureName}>Kapil Gautam, Advocate</p>
                    </div>
                </div>

            </div>
        </div>
    );
});

const s = {
    page: { backgroundColor: C.white, color: C.textDark, padding: "24px 28px", fontFamily: "Arial, sans-serif", maxWidth: "780px", margin: "0 auto", fontSize: "12px" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `3px solid ${C.navy}`, paddingBottom: "12px" },
    headerLeft: { display: "flex", alignItems: "center", gap: "12px" },
    logo: { height: "60px", width: "auto", objectFit: "contain" },
    headerName: { display: "flex", flexDirection: "column" },
    advocateName: { fontSize: "16px", fontWeight: "bold", color: C.navy },
    advocateTitle: { fontSize: "12px", color: C.gold, fontWeight: "bold", letterSpacing: "1px" },
    advocateQual: { fontSize: "10px", color: C.textMid, marginTop: "2px" },
    advocateQual2: { fontSize: "9px", color: C.textMid },
    headerRight: { textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" },
    originalTag: { fontSize: "10px", color: C.textMid, marginBottom: "2px" },
    invoiceTitle: { fontSize: "22px", fontWeight: "bold", color: C.navy, letterSpacing: "1px" },
    invoiceNumber: { fontSize: "18px", fontWeight: "bold", color: C.gold },
    amountBanner: { backgroundColor: C.navy, color: C.white, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px" },
    bannerLabel: { fontSize: "13px", fontWeight: "bold" },
    bannerAmount: { fontSize: "15px", fontWeight: "bold", color: C.gold },
    dateRow: { backgroundColor: C.lightGray, padding: "8px 16px", borderBottom: `1px solid ${C.borderGray}` },
    dateBlock: { display: "flex", gap: "40px" },
    dateItem: { display: "flex", gap: "8px", alignItems: "center" },
    dateLabel: { fontWeight: "bold", color: C.navy, fontSize: "11px" },
    dateValue: { color: C.textDark, fontSize: "11px" },
    billingRow: { display: "flex", borderBottom: `2px solid ${C.navy}` },
    billedByBox: { flex: 1, padding: "10px 16px", borderRight: `1px solid ${C.borderGray}` },
    billedToBox: { flex: 1, padding: "10px 16px" },
    billingHeading: { backgroundColor: C.navy, color: C.white, fontSize: "11px", fontWeight: "bold", padding: "3px 8px", marginBottom: "6px", display: "inline-block" },
    billingName: { fontWeight: "bold", fontSize: "12px", color: C.navy, margin: "0 0 2px 0" },
    billingDetail: { fontSize: "11px", color: C.textMid, margin: "1px 0" },
    table: { width: "100%", borderCollapse: "collapse", border: `1px solid ${C.navy}` },
    th: { backgroundColor: C.navy, color: C.white, padding: "7px 10px", textAlign: "center", fontSize: "11px", fontWeight: "bold", border: `1px solid ${C.lightNavy}` },
    td: { padding: "7px 10px", fontSize: "11px", border: `1px solid ${C.borderGray}`, color: C.textDark },
    trEven: { backgroundColor: C.white },
    trOdd: { backgroundColor: C.lightGray },
    totalsSection: { display: "flex", justifyContent: "flex-end", borderTop: `2px solid ${C.navy}` },
    totalsRight: { width: "55%", border: `1px solid ${C.borderGray}` },
    totalLine: { display: "flex", justifyContent: "space-between", padding: "5px 12px", borderBottom: `1px solid ${C.borderGray}`, fontSize: "11px" },
    grandTotalLine: { backgroundColor: C.lightGray, fontWeight: "bold" },
    totalLbl: { color: C.textMid, fontWeight: "600" },
    totalVal: { color: C.textDark, fontWeight: "bold", textAlign: "right" },
    signatureSection: { display: "flex", justifyContent: "flex-end", marginTop: "40px", paddingRight: "10px" },
    signatureBox: { textAlign: "center", width: "180px" },
    signatureLine: { borderTop: `1.5px solid ${C.navy}`, marginBottom: "4px" },
    signatureLabel: { fontSize: "10px", color: C.textMid, margin: "0" },
    signatureName: { fontSize: "11px", fontWeight: "bold", color: C.navy, margin: "2px 0 0 0" },
    bankSection: { marginTop: "16px", border: `1px solid ${C.borderGray}`, borderRadius: "4px", overflow: "hidden" },
    bankHeading: { backgroundColor: C.navy, color: C.white, fontSize: "11px", fontWeight: "bold", padding: "5px 12px", letterSpacing: "0.5px" },
    bankGrid: { padding: "8px 12px", backgroundColor: C.lightGray },
    bankRow: { display: "flex", gap: "8px", padding: "2px 0", borderBottom: `1px solid ${C.borderGray}`, fontSize: "11px" },
    bankLabel: { fontWeight: "bold", color: C.navy, minWidth: "130px" },
    bankValue: { color: C.textDark },
};

export default PdfLayout;
