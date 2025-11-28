import { useState } from "react";
import { Download, Printer, Save, Plus, X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from '../../assets/Ganapathy_metals_logo.png'

const CertificateOfOriginInput = () => {
  const [formData, setFormData] = useState({
    date: "12.09.2023",
    exporter:
      "GANAPATHY METAL SDN BHD, NO: 37, PERSIARAN SEGAMBUT TENGAH, SEGAMBUT INDUSTRIAL PARK, 51200 KUALA LUMPUR, MALAYSIA.",
    consignee: "",
    notifyParty: "",
    vessel: "",
    blNo: "",
    portOfLoading: "PORT KLANG, MALAYSIA",
    dateOfDeparture: "",
    finalDestination: "NHAVA SHEVA",
    countryOfOrigin: "MALAYSIA",
    marksNumbers: "NIL",
    packagesQuantity: "",
    description: "ALUMINIUM SCRAP TREAD AS PER ISRI",
    netWeight: "",
    invoiceNo: "GMSB/FGN/2023/09/213",
    salesContractNo: "",
    containerDetails: [],
  });

  const [newContainer, setNewContainer] = useState({
    containerNo: "",
    sealNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContainerChange = (e) => {
    const { name, value } = e.target;
    setNewContainer((prev) => ({ ...prev, [name]: value }));
  };

  const addContainer = () => {
    if (newContainer.containerNo && newContainer.sealNo) {
      setFormData((prev) => ({
        ...prev,
        containerDetails: [...prev.containerDetails, newContainer],
      }));
      setNewContainer({ containerNo: "", sealNo: "" });
    }
  };

  const removeContainer = (index) => {
    setFormData((prev) => ({
      ...prev,
      containerDetails: prev.containerDetails.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handlePdfDownload = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - 2 * margin;

    // --- GOLD TOP LINE ---
    doc.setFillColor(255, 215, 0);
    doc.rect(0, 0, pageWidth, 8, "F");

    // --- LOGO AT TOP LEFT (with proper spacing) ---
    const logoWidth = 60;
    const logoHeight = 50;
    const logoX = margin;
    const logoY = 15;

    // Add the logo
    try {
      doc.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      console.warn('Logo could not be added to PDF:', error);
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 40, 80);
      doc.text("GANAPATHY METALS", logoX, logoY + 15);
    }

    // --- TITLE ---
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 40, 80);
    const titleY = Math.max(50, logoY + logoHeight / 2);
    doc.text("CERTIFICATE OF ORIGIN - MALAYSIA", pageWidth / 2, titleY, { align: "center" });

    // --- Horizontal line ---
    const lineY = titleY + 20;
    doc.setDrawColor(0, 40, 80);
    doc.setLineWidth(1);
    doc.line(margin, lineY, pageWidth - margin, lineY);

    // --- Form Sections ---
    const sectionRows = [
      ["EXPORTER (NAME & ADDRESS)", formData.exporter || "-"],
      ["CONSIGNEE (NAME & ADDRESS)", formData.consignee || "-"],
      ["NOTIFY PARTY (NAME & ADDRESS)", formData.notifyParty || "-"],
      ["VESSEL", formData.vessel || "-"],
      ["B/L NO", formData.blNo || "-"],
      ["PORT OF LOADING", formData.portOfLoading || "-"],
      ["DATE OF DEPARTURE", formData.dateOfDeparture || "-"],
      ["FINAL DESTINATION", formData.finalDestination || "-"],
      ["COUNTRY OF ORIGIN OF GOODS", formData.countryOfOrigin || "-"]
    ];

    autoTable(doc, {
      startY: lineY + 20,
      theme: "grid",
      styles: {
        fontSize: 10,
        valign: "top",
        cellPadding: 6,
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      columnStyles: {
        0: {
          cellWidth: 150,
          fontStyle: "bold",
          textColor: [0, 0, 0],
          fillColor: [240, 240, 240],
          halign: "left"
        },
        1: {
          cellWidth: contentWidth - 150,
          halign: "left"
        }
      },
      body: sectionRows
    });

    // --- Goods Table ---
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      theme: "grid",
      styles: {
        fontSize: 9,
        halign: "center",
        valign: "middle",
        lineColor: [150, 150, 150],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        lineWidth: 0.1
      },
      head: [["MARKS & NUMBERS", "NUMBER OF PACKAGES & QUANTITY", "DESCRIPTION OF GOODS", "NET WEIGHT", "INVOICE NO."]],
      body: [[
        formData.marksNumbers || "-",
        formData.packagesQuantity || "-",
        formData.description || "-",
        formData.netWeight || "-",
        formData.invoiceNo || "-"
      ]],
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 100 },
        2: { cellWidth: 160, halign: "left" },
        3: { cellWidth: 80 },
        4: { cellWidth: 100 },
      }
    });

    // --- Sales Contract & Container Section ---
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      theme: "plain",
      styles: {
        fontSize: 10,
        cellPadding: 4,
        lineWidth: 0.1
      },
      body: [
        [
          {
            content: "OUR SALES CONTRACT NO:",
            styles: {
              fontStyle: "bold",
              fillColor: [240, 240, 240]
            }
          },
          formData.salesContractNo || "-"
        ],
        [
          {
            content: "CONTAINER NO. / SEAL NO:",
            styles: {
              fontStyle: "bold",
              fillColor: [240, 240, 240]
            }
          },
          formData.containerDetails.length > 0
            ? formData.containerDetails.map(c => `${c.containerNo} / ${c.sealNo}`).join(", ")
            : "-"
        ]
      ],
      columnStyles: {
        0: {
          cellWidth: 150,
          fontStyle: "bold",
          fillColor: [240, 240, 240],
          halign: "left"
        },
        1: {
          cellWidth: contentWidth - 150,
          halign: "left"
        }
      }
    });

    // --- Signature Section ---
    const signY = doc.lastAutoTable.finalY + 60;
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.text("YOURS FAITHFULLY,", margin, signY);

    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text("GANAPATHY METAL SDN BHD", margin, signY + 15);

    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(1);
    doc.line(margin, signY + 40, margin + 200, signY + 40);

    doc.setFont("times", "italic");
    doc.setFontSize(9);
    doc.text("MANAGING DIRECTOR", margin, signY + 55);

    // --- Footer ---
    doc.setFont("times", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      "This is a system-generated Certificate of Origin | Ganapathy Metal Sdn Bhd",
      pageWidth - margin,
      pageHeight - 30,
      { align: "right" }
    );

    doc.save("Certificate-of-Origin.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 p-6">
          {/* Logo and Company Name */}
          <div className="flex items-center justify-between w-full">
            <img
              src={logo}
              alt="Ganapathy Metals Logo"
              className="h-16 w-auto"
            />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center flex-1">
              CERTIFICATE OF ORIGIN - MALAYSIA
            </h1>
          </div>

          {/* Date */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              DATE:
            </label>
            <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
              {formData.date}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 mb-6 px-6">
          <button className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-sm font-medium flex items-center hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            <Save className="w-4 h-4 mr-2" /> Save
          </button>
          <button className="px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-sm font-medium flex items-center hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
            <Printer className="w-4 h-4 mr-2" /> Print
          </button>
          <button
            className="px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded text-sm font-medium flex items-center hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
            onClick={handlePdfDownload}
          >
            <Download className="w-4 h-4 mr-2" /> PDF
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
          {/* Main Form Sections */}
          <div className="border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
            {/* Exporter */}
            <div className="flex border-b border-gray-300 dark:border-gray-600">
              <div className="w-1/4 bg-gray-100 dark:bg-gray-700 p-3 font-medium border-r border-gray-300 dark:border-gray-600 flex items-start text-gray-900 dark:text-white">
                EXPORTER (NAME & ADDRESS)
              </div>
              <div className="w-3/4 p-3 flex items-start bg-white dark:bg-gray-800">
                <span className="mr-2 mt-1 text-gray-600 dark:text-gray-400">:</span>
                <textarea
                  name="exporter"
                  value={formData.exporter}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border-none focus:ring-0 focus:outline-none resize-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Consignee */}
            <div className="flex border-b border-gray-300 dark:border-gray-600">
              <div className="w-1/4 bg-gray-100 dark:bg-gray-700 p-3 font-medium border-r border-gray-300 dark:border-gray-600 flex items-start text-gray-900 dark:text-white">
                CONSIGNEE (NAME & ADDRESS)
              </div>
              <div className="w-3/4 p-3 flex items-start bg-white dark:bg-gray-800">
                <span className="mr-2 mt-1 text-gray-600 dark:text-gray-400">:</span>
                <textarea
                  name="consignee"
                  value={formData.consignee}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border-none focus:ring-0 focus:outline-none resize-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter consignee details"
                />
              </div>
            </div>

            {/* Notify Party */}
            <div className="flex border-b border-gray-300 dark:border-gray-600">
              <div className="w-1/4 bg-gray-100 dark:bg-gray-700 p-3 font-medium border-r border-gray-300 dark:border-gray-600 flex items-start text-gray-900 dark:text-white">
                NOTIFY PARTY (NAME & ADDRESS)
              </div>
              <div className="w-3/4 p-3 flex items-start bg-white dark:bg-gray-800">
                <span className="mr-2 mt-1 text-gray-600 dark:text-gray-400">:</span>
                <textarea
                  name="notifyParty"
                  value={formData.notifyParty}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border-none focus:ring-0 focus:outline-none resize-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter notify party details"
                />
              </div>
            </div>

            {/* Vessel */}
            <div className="flex border-b border-gray-300 dark:border-gray-600">
              <div className="w-1/4 bg-gray-100 dark:bg-gray-700 p-3 font-medium border-r border-gray-300 dark:border-gray-600 flex items-center text-gray-900 dark:text-white">
                VESSEL
              </div>
              <div className="w-3/4 p-3 flex items-center bg-white dark:bg-gray-800">
                <span className="mr-2 text-gray-600 dark:text-gray-400">:</span>
                <input
                  type="text"
                  name="vessel"
                  value={formData.vessel}
                  onChange={handleChange}
                  className="w-full border-none focus:ring-0 focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter vessel name"
                />
              </div>
            </div>

            {/* B/L No */}
            <div className="flex border-b border-gray-300 dark:border-gray-600">
              <div className="w-1/4 bg-gray-100 dark:bg-gray-700 p-3 font-medium border-r border-gray-300 dark:border-gray-600 flex items-center text-gray-900 dark:text-white">
                B/L NO
              </div>
              <div className="w-3/4 p-3 flex items-center bg-white dark:bg-gray-800">
                <span className="mr-2 text-gray-600 dark:text-gray-400">:</span>
                <input
                  type="text"
                  name="blNo"
                  value={formData.blNo}
                  onChange={handleChange}
                  className="w-full border-none focus:ring-0 focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter B/L number"
                />
              </div>
            </div>

            {/* Port of Loading */}
            <div className="flex border-b border-gray-300 dark:border-gray-600">
              <div className="w-1/4 bg-gray-100 dark:bg-gray-700 p-3 font-medium border-r border-gray-300 dark:border-gray-600 flex items-center text-gray-900 dark:text-white">
                PORT OF LOADING
              </div>
              <div className="w-3/4 p-3 flex items-center bg-white dark:bg-gray-800">
                <span className="mr-2 text-gray-600 dark:text-gray-400">:</span>
                <input
                  type="text"
                  name="portOfLoading"
                  value={formData.portOfLoading}
                  onChange={handleChange}
                  className="w-full border-none focus:ring-0 focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Date of Departure */}
            <div className="flex border-b border-gray-300 dark:border-gray-600">
              <div className="w-1/4 bg-gray-100 dark:bg-gray-700 p-3 font-medium border-r border-gray-300 dark:border-gray-600 flex items-center text-gray-900 dark:text-white">
                DATE OF DEPARTURE
              </div>
              <div className="w-3/4 p-3 flex items-center bg-white dark:bg-gray-800">
                <span className="mr-2 text-gray-600 dark:text-gray-400">:</span>
                <input
                  type="text"
                  name="dateOfDeparture"
                  value={formData.dateOfDeparture}
                  onChange={handleChange}
                  className="w-full border-none focus:ring-0 focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter departure date"
                />
              </div>
            </div>

            {/* Final Destination */}
            <div className="flex border-b border-gray-300 dark:border-gray-600">
              <div className="w-1/4 bg-gray-100 dark:bg-gray-700 p-3 font-medium border-r border-gray-300 dark:border-gray-600 flex items-center text-gray-900 dark:text-white">
                FINAL DESTINATION
              </div>
              <div className="w-3/4 p-3 flex items-center bg-white dark:bg-gray-800">
                <span className="mr-2 text-gray-600 dark:text-gray-400">:</span>
                <input
                  type="text"
                  name="finalDestination"
                  value={formData.finalDestination}
                  onChange={handleChange}
                  className="w-full border-none focus:ring-0 focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Country of Origin */}
            <div className="flex">
              <div className="w-1/4 bg-gray-100 dark:bg-gray-700 p-3 font-medium border-r border-gray-300 dark:border-gray-600 flex items-center text-gray-900 dark:text-white">
                COUNTRY OF ORIGIN OF GOODS
              </div>
              <div className="w-3/4 p-3 flex items-center bg-white dark:bg-gray-800">
                <span className="mr-2 text-gray-600 dark:text-gray-400">:</span>
                <input
                  type="text"
                  name="countryOfOrigin"
                  value={formData.countryOfOrigin}
                  onChange={handleChange}
                  className="w-full border-none focus:ring-0 focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Goods Table */}
          <div className="border border-gray-300 dark:border-gray-600 rounded">
            {/* Table Header */}
            <div className="flex bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
              <div className="w-1/5 p-2 font-medium border-r border-gray-300 dark:border-gray-600 text-center text-sm text-gray-900 dark:text-white">
                MARKS & NUMBERS
              </div>
              <div className="w-1/5 p-2 font-medium border-r border-gray-300 dark:border-gray-600 text-center text-sm text-gray-900 dark:text-white">
                NUMBER OF PACKAGES & QUANTITY
              </div>
              <div className="w-2/5 p-2 font-medium border-r border-gray-300 dark:border-gray-600 text-center text-sm text-gray-900 dark:text-white">
                DESCRIPTION OF GOODS
              </div>
              <div className="w-1/5 p-2 font-medium border-r border-gray-300 dark:border-gray-600 text-center text-sm text-gray-900 dark:text-white">
                NET WEIGHT
              </div>
              <div className="w-1/5 p-2 font-medium text-center text-sm text-gray-900 dark:text-white">
                INVOICE NO:
              </div>
            </div>

            {/* Main Row */}
            <div className="flex border-b border-gray-300 dark:border-gray-600">
              {/* Marks & Numbers */}
              <div className="w-1/5 p-2 border-r border-gray-300 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-800">
                <input
                  type="text"
                  name="marksNumbers"
                  value={formData.marksNumbers}
                  onChange={handleChange}
                  className="w-full border-none focus:ring-0 focus:outline-none text-center text-sm text-gray-900 dark:text-white bg-transparent"
                />
              </div>

              {/* Packages & Quantity */}
              <div className="w-1/5 p-2 border-r border-gray-300 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-800">
                <input
                  type="text"
                  name="packagesQuantity"
                  value={formData.packagesQuantity}
                  onChange={handleChange}
                  className="w-full border-none focus:ring-0 focus:outline-none text-center text-sm text-gray-900 dark:text-white bg-transparent placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter packages & quantity"
                />
              </div>

              {/* Description of Goods */}
              <div className="w-2/5 p-2 border-r border-gray-300 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-800">
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border-none focus:ring-0 focus:outline-none text-center text-sm text-gray-900 dark:text-white bg-transparent"
                />
              </div>

              {/* Net Weight */}
              <div className="w-1/5 p-2 border-r border-gray-300 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-800">
                <input
                  type="text"
                  name="netWeight"
                  value={formData.netWeight}
                  onChange={handleChange}
                  className="w-full border-none focus:ring-0 focus:outline-none text-center text-sm text-gray-900 dark:text-white bg-transparent placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter net weight"
                />
              </div>

              {/* Invoice No */}
              <div className="w-1/5 p-2 flex items-center justify-center bg-white dark:bg-gray-800">
                <input
                  type="text"
                  name="invoiceNo"
                  value={formData.invoiceNo}
                  onChange={handleChange}
                  className="w-full border-none focus:ring-0 focus:outline-none text-center text-sm text-gray-900 dark:text-white bg-transparent"
                />
              </div>
            </div>

            {/* Sales Contract Row */}
            <div className="flex border-b border-gray-300 dark:border-gray-600">
              <div className="w-1/5 p-2 border-r border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"></div>
              <div className="w-1/5 p-2 border-r border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"></div>
              <div className="w-2/5 p-2 border-r border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                <div className="flex items-center">
                  <span className="font-medium mr-2 whitespace-nowrap text-xs text-gray-900 dark:text-white">OUR SALES CONTRACT NO:</span>
                  <input
                    type="text"
                    name="salesContractNo"
                    value={formData.salesContractNo}
                    onChange={handleChange}
                    className="flex-1 border-none focus:ring-0 focus:outline-none text-sm text-gray-900 dark:text-white bg-transparent placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter sales contract number"
                  />
                </div>
              </div>
              <div className="w-1/5 p-2 border-r border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"></div>
              <div className="w-1/5 p-2 bg-white dark:bg-gray-800"></div>
            </div>

            {/* Container Details Row */}
            <div className="flex">
              <div className="w-1/5 p-2 border-r border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"></div>
              <div className="w-1/5 p-2 border-r border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"></div>
              <div className="w-2/5 p-2 border-r border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                <div className="font-medium mb-1 text-sm text-gray-900 dark:text-white">CONTAINER NO. / SEAL NO.</div>
                <div className="space-y-1">
                  {formData.containerDetails.map((container, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={container.containerNo}
                        readOnly
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white w-28"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">/</span>
                      <input
                        type="text"
                        value={container.sealNo}
                        readOnly
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white w-28"
                      />
                      <button
                        type="button"
                        onClick={() => removeContainer(index)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xs flex items-center"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      name="containerNo"
                      value={newContainer.containerNo}
                      onChange={handleContainerChange}
                      className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs w-28 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Container No"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">/</span>
                    <input
                      type="text"
                      name="sealNo"
                      value={newContainer.sealNo}
                      onChange={handleContainerChange}
                      className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs w-28 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Seal No"
                    />
                    <button
                      type="button"
                      onClick={addContainer}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs flex items-center hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-1/5 p-2 border-r border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"></div>
              <div className="w-1/5 p-2 bg-white dark:bg-gray-800"></div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="text-right mt-8">
            <div className="mb-4">
              <div className="text-sm font-medium mb-2 text-gray-900 dark:text-white">YOURS FAITHFULLY,</div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">GANAPATHY METAL SDN BHD</div>
            </div>
            <div className="border-t border-gray-400 dark:border-gray-600 pt-8 w-48 ml-auto">
              <div className="text-sm font-medium text-gray-900 dark:text-white">MANAGING DIRECTOR</div>
            </div>
          </div>

          <div className="flex justify-center space-x-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Submit Certificate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateOfOriginInput;