import React, { useState, useRef } from 'react';
import { Download, Save } from 'lucide-react';
import logo from '../../assets/Ganapathy_metals_logo.png';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Invoice = () => {
    // State for form fields
    const [invoiceData, setInvoiceData] = useState({
        date: '12TH SEPTEMBER 2023',
        vessel: 'UAFL LIBERTY V.6102',
        pol: 'PORT KLANG, MALAYSIA',
        pod: 'CIF NHAVASHEVA, INDIA',
        buyer: '',
        contractNo: 'GMSB-0016/07/2023',
        invoiceNo: 'GMSB/FGN/2023/09/213',
        marks: 'NIL',
        packages: '20',
        description: 'XXX METRIC TONS OF ALUMINIUM SCRAP TREAD AS PER ISRI',
        hsCode: '76020010',
        price: '',
        totalWeight: '',
        amount: '',
        amountInWords: 'TOTAL US DOLLARS EIGHTY THOUSAND SEVEN HUNDRED TWENTY SIX AND CENTS FIVE ONLY.',
        accountNo: '6179015118',
        bank: 'UNITED OVERSEAS BANK MALAYSIA BERHAD',
        swiftCode: 'UOVBMYKL',
        containerNo1: '',
        containerNo2: '',
    });

    const invoiceRef = useRef();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInvoiceData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePdfDownload = async () => {
        const input = invoiceRef.current;

        // Hide the PDF button during capture
        const pdfButton = document.querySelector('.pdf-button');
        if (pdfButton) pdfButton.style.display = 'none';

        try {
            // Capture the invoice as canvas without touching original DOM
            const canvas = await html2canvas(input, {
                scale: 2,
                useCORS: true,
                logging: false,
                scrollX: 0,
                scrollY: 0,
                backgroundColor: '#ffffff',
                onclone: (clonedDoc) => {
                    // Apply style adjustments only to the cloned copy
                    const clonedInput = clonedDoc.querySelector('.invoice-content');

                    if (clonedInput) {
                        clonedInput.style.width = '210mm';
                        clonedInput.style.margin = '0 auto';
                        clonedInput.style.padding = '10px';
                        clonedInput.style.maxWidth = 'none';
                        clonedInput.style.boxSizing = 'border-box';
                    }

                    // Fix containers
                    const containers = clonedDoc.querySelectorAll('.max-w-5xl, .invoice-content');
                    containers.forEach(container => {
                        container.style.width = '100%';
                        container.style.margin = '0';
                        container.style.padding = '10px';
                        container.style.maxWidth = 'none';
                        container.style.boxSizing = 'border-box';
                    });

                    // Reduce gaps between form fields in PDF
                    const formRows = clonedDoc.querySelectorAll('.mb-4, .mb-6, .mb-8');
                    formRows.forEach(row => {
                        if (row.classList.contains('mb-8')) {
                            row.style.marginBottom = '0.5rem';
                        } else if (row.classList.contains('mb-6')) {
                            row.style.marginBottom = '0.375rem';
                        } else if (row.classList.contains('mb-4')) {
                            row.style.marginBottom = '0.25rem';
                        }
                    });

                    // Increase font size and adjust padding for input fields in PDF
                    const inputFields = clonedDoc.querySelectorAll('input, textarea');
                    inputFields.forEach(field => {
                        field.style.padding = '3px 6px';
                        field.style.fontSize = '18px';
                        field.style.fontWeight = '500';
                        field.style.marginTop = '3px';
                    });

                    // Reduce specific gaps in form sections
                    const statementRow = clonedDoc.querySelector('.flex.items-center.mb-4');
                    if (statementRow) {
                        statementRow.style.marginBottom = '0.5rem';
                    }

                    const vesselRow = clonedDoc.querySelector('.flex.items-center.mb-4');
                    if (vesselRow) {
                        vesselRow.style.marginBottom = '0.25rem';
                    }

                    const buyerRow = clonedDoc.querySelectorAll('.flex.items-center.mb-4')[1];
                    if (buyerRow) {
                        buyerRow.style.marginBottom = '0.25rem';
                    }

                    const contractRow = clonedDoc.querySelector('.flex.items-center.mb-6');
                    if (contractRow) {
                        contractRow.style.marginBottom = '0.375rem';
                    }

                    // Convert all input fields to read-only spans to ensure values are visible
                    const textInputs = clonedDoc.querySelectorAll('input[type="text"]');
                    textInputs.forEach(input => {
                        const span = document.createElement('span');
                        // Only show actual value, not placeholder
                        span.textContent = input.value || '';
                        span.style.display = 'inline-block';
                        span.style.width = input.offsetWidth + 'px';
                        span.style.height = input.offsetHeight + 'px';
                        span.style.fontFamily = window.getComputedStyle(input).fontFamily;
                        span.style.fontSize = '14px';
                        span.style.fontWeight = '500';
                        span.style.color = window.getComputedStyle(input).color;
                        span.style.padding = '3px 6px';
                        span.style.margin = window.getComputedStyle(input).margin;

                        // Replace input with span
                        input.parentNode.replaceChild(span, input);
                    });

                    // Convert textarea to div to ensure content is visible
                    const textareas = clonedDoc.querySelectorAll('textarea');
                    textareas.forEach(textarea => {
                        const div = document.createElement('div');
                        // Only show actual value
                        div.textContent = textarea.value || '';
                        div.style.width = textarea.offsetWidth + 'px';
                        div.style.height = textarea.offsetHeight + 'px';
                        div.style.fontFamily = window.getComputedStyle(textarea).fontFamily;
                        div.style.fontSize = '14px';
                        div.style.fontWeight = '500';
                        div.style.color = window.getComputedStyle(textarea).color;
                        div.style.padding = '3px 6px';
                        div.style.margin = window.getComputedStyle(textarea).margin;
                        div.style.border = 'none';
                        div.style.background = 'transparent';
                        div.style.whiteSpace = 'pre-wrap';
                        div.style.wordWrap = 'break-word';

                        // Replace textarea with div
                        textarea.parentNode.replaceChild(div, textarea);
                    });

                    // Hide PDF button in clone
                    const clonedPdfButton = clonedDoc.querySelector('.pdf-button');
                    if (clonedPdfButton) clonedPdfButton.style.display = 'none';
                }
            });

            // Restore PDF button
            if (pdfButton) pdfButton.style.display = 'flex';

            const imgData = canvas.toDataURL('image/png', 1.0);

            // Create PDF with proper alignment
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 5;
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
            pdf.save(`invoice-${invoiceData.invoiceNo || 'document'}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            if (pdfButton) pdfButton.style.display = 'flex';
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
            {/* PDF Download Button */}
            <div className="flex justify-end mb-4 space-x-3">
                {/* PDF Button - Updated with Lucide Icon */}
                <button
                    onClick={handlePdfDownload}
                    className="pdf-button bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 flex items-center"
                >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                </button>

                {/* Save Button with Lucide Icon */}
                <button
                    // onClick={handleSave}
                    className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                </button>
            </div>

            {/* Invoice Content */}
            <div ref={invoiceRef} className="invoice-content bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                {/* Company Header - Matches screenshot layout */}
                <div className="mb-8 w-full">
                    {/* Header Row */}
                    <div className="flex items-center justify-center relative">
                        {/* Logo on Left */}
                        <img
                            src={logo}
                            alt="Ganapathy Metals Logo"
                            className="h-32 w-32 absolute left-0"
                        />
                        {/* Company Info Centered */}
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-red-600 dark:text-red-500 inline-block">
                                GANAPATHY METAL SDN.BHD
                            </h1>
                            <span className="text-sm text-black dark:text-gray-300 font-semibold ml-2">(245597-U)</span>

                            <p className="text-green-600 dark:text-green-500 font-semibold text-sm mt-1">
                                Importers / Exporters Of Non-Ferrous Metal Scrap
                            </p>

                            <p className="text-sm text-gray-800 dark:text-gray-300 mt-1">
                                <span className="font-bold">Corporate Office :</span> 37, Persiaran Segambut Tengah, Segambut
                                Industrial Park, 51200 Kuala Lumpur.
                            </p>

                            <p className="text-sm text-gray-800 dark:text-gray-300 mt-1">
                                <span className="font-bold">Tel:</span> +603-6257 7481{" "}
                                <span className="font-bold ml-3">Fax:</span> +603-6251 0086{" "}
                                <span className="font-bold ml-3">E-Mail:</span> gmetals@po.jaring.asia{" "}
                                <span className="font-bold ml-3">Web:</span> www.ganapathy.com.my
                            </p>
                        </div>
                    </div>
                </div>

                {/* Invoice Title and Date */}
                <div className="relative flex items-center mb-8 border-b-2 border-gray-800 dark:border-gray-600 pb-4">
                    {/* INVOICE Centered */}
                    <div className="w-full text-center">
                        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-400">INVOICE</h2>
                    </div>

                    <div className="absolute right-0">
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Date:</label>
                            <input
                                type="text"
                                name="date"
                                value={invoiceData.date}
                                onChange={handleInputChange}
                                className="w-44 p-2 border border-gray-300 dark:border-gray-600 rounded text-center font-semibold text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Statement */}
                <div className="mb-4 flex items-center">
                    <div className="w-40 font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">Statement of :</div>
                    <input
                        type="text"
                        name="description"
                        value={invoiceData.description}
                        onChange={handleInputChange}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    />
                </div>

                {/* Vessel Details */}
                <div className="mb-4 flex items-center">
                    <div className="w-56 font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">Vessel Details :</div>
                    <input
                        type="text"
                        name="vessel"
                        value={invoiceData.vessel}
                        onChange={handleInputChange}
                        className="w-80 p-2 border border-gray-300 dark:border-gray-600 rounded mr-8 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    />
                    <div className="flex-1 flex space-x-8">
                        <div className="flex items-center">
                            <span className="w-16 font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">P.O.L :</span>
                            <input
                                type="text"
                                name="pol"
                                value={invoiceData.pol}
                                onChange={handleInputChange}
                                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                            />
                        </div>
                        <div className="flex items-center">
                            <span className="w-16 font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">P.O.D :</span>
                            <input
                                type="text"
                                name="pod"
                                value={invoiceData.pod}
                                onChange={handleInputChange}
                                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Buyer Details */}
                <div className="mb-4 flex items-center">
                    <div className="w-40 font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">Buyer Details :</div>
                    <input
                        type="text"
                        name="buyer"
                        value={invoiceData.buyer}
                        onChange={handleInputChange}
                        placeholder="Enter buyer details"
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    />
                </div>

                {/* Contract and Invoice Numbers */}
                <div className="mb-6 flex items-center">
                    <div className="w-40 font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">Our Contract No :</div>
                    <input
                        type="text"
                        name="contractNo"
                        value={invoiceData.contractNo}
                        onChange={handleInputChange}
                        className="w-80 p-2 border border-gray-300 dark:border-gray-600 rounded mr-8 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                    />
                    <div className="flex-1 flex items-center">
                        <span className="w-32 font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">INVOICE NO :</span>
                        <input
                            type="text"
                            name="invoiceNo"
                            value={invoiceData.invoiceNo}
                            onChange={handleInputChange}
                            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="mb-6 border border-gray-300 dark:border-gray-600">
                    {/* Table Header */}
                    <div className="flex border-b border-gray-300 dark:border-gray-600">
                        <div className="w-1/4 p-2 font-medium border-r border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">MARKS</div>
                        <div className="w-1/4 p-2 font-medium border-r border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">PACKAGES</div>
                        <div className="w-2/4 p-2 font-medium border-r border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">PARTICULARS</div>
                        <div className="w-1/4 p-2 font-medium text-gray-900 dark:text-gray-100">AMOUNT</div>
                    </div>

                    {/* Table Row 1 */}
                    <div className="flex border-b border-gray-300 dark:border-gray-600">
                        <div className="w-1/4 p-2 border-r border-gray-300 dark:border-gray-600">
                            <input
                                type="text"
                                name="marks"
                                value={invoiceData.marks}
                                onChange={handleInputChange}
                                className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                            />
                        </div>
                        <div className="w-1/4 p-2 border-r border-gray-300 dark:border-gray-600">
                            <div className="flex items-center mb-1">
                                <span className="mr-2 text-gray-900 dark:text-gray-100">IN</span>
                                <input
                                    type="text"
                                    name="packages"
                                    value={invoiceData.packages}
                                    onChange={handleInputChange}
                                    className="w-16 p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                />
                            </div>
                            <div className="text-sm text-gray-900 dark:text-gray-100">PACKAGES</div>
                        </div>
                        <div className="w-2/4 p-2 border-r border-gray-300 dark:border-gray-600">
                            <input
                                type="text"
                                name="description"
                                value={invoiceData.description}
                                onChange={handleInputChange}
                                className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                            />
                        </div>
                        <div className="w-1/4 p-2">
                            <div className="flex items-center">
                                <span className="font-medium mr-1 text-gray-900 dark:text-gray-100">USD</span>
                                <input
                                    type="text"
                                    name="amount"
                                    value={invoiceData.amount}
                                    onChange={handleInputChange}
                                    placeholder="XXX"
                                    className="w-20 p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table Row 2 */}
                    <div className="flex border-b border-gray-300 dark:border-gray-600">
                        <div className="w-1/4 p-2 border-r border-gray-300 dark:border-gray-600"></div>
                        <div className="w-1/4 p-2 border-r border-gray-300 dark:border-gray-600"></div>
                        <div className="w-2/4 p-2 border-r border-gray-300 dark:border-gray-600">
                            <div className="mb-1">
                                <span className="font-medium text-gray-900 dark:text-gray-100">H.S CODE:</span>
                                <input
                                    type="text"
                                    name="hsCode"
                                    value={invoiceData.hsCode}
                                    onChange={handleInputChange}
                                    className="w-32 p-1 border border-gray-300 dark:border-gray-600 rounded ml-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                />
                            </div>
                            <div className="mb-1">
                                <span className="font-medium text-gray-900 dark:text-gray-100">PRICED AT USD</span>
                                <input
                                    type="text"
                                    name="price"
                                    value={invoiceData.price}
                                    onChange={handleInputChange}
                                    placeholder="XXX"
                                    className="w-16 p-1 border border-gray-300 dark:border-gray-600 rounded mx-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                />
                                <span className="text-gray-900 dark:text-gray-100">/MT</span>
                            </div>
                            <div className="mb-1">
                                <input
                                    type="text"
                                    name="pod"
                                    value={invoiceData.pod}
                                    onChange={handleInputChange}
                                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                />
                            </div>
                        </div>
                        <div className="w-1/4 p-2"></div>
                    </div>

                    {/* Table Row 3 */}
                    <div className="flex border-b border-gray-300 dark:border-gray-600">
                        <div className="w-1/4 p-2 border-r border-gray-300 dark:border-gray-600"></div>
                        <div className="w-1/4 p-2 border-r border-gray-300 dark:border-gray-600"></div>
                        <div className="w-2/4 p-2 border-r border-gray-300 dark:border-gray-600">
                            <div className="mb-1">
                                <span className="font-medium text-gray-900 dark:text-gray-100">TOTAL NET WEIGHT:</span>
                                <input
                                    type="text"
                                    name="totalWeight"
                                    value={invoiceData.totalWeight}
                                    onChange={handleInputChange}
                                    placeholder="XXXX"
                                    className="w-20 p-1 border border-gray-300 dark:border-gray-600 rounded mx-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                />
                                <span className="text-gray-900 dark:text-gray-100">METRIC TONS</span>
                            </div>
                        </div>
                        <div className="w-1/4 p-2"></div>
                    </div>

                    {/* Table Row 4 - Amount in Words */}
                    <div className="flex border-b border-gray-300 dark:border-gray-600">
                        <div className="w-1/4 p-2 border-r border-gray-300 dark:border-gray-600"></div>
                        <div className="w-1/4 p-2 border-r border-gray-300 dark:border-gray-600"></div>
                        <div className="w-2/4 p-2 border-r border-gray-300 dark:border-gray-600">
                            <textarea
                                name="amountInWords"
                                value={invoiceData.amountInWords}
                                onChange={handleInputChange}
                                rows="2"
                                className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                            />
                        </div>
                        <div className="w-1/4 p-2"></div>
                    </div>

                    {/* Table Row 5 - Payment Details */}
                    <div className="flex border-b border-gray-300 dark:border-gray-600">
                        <div className="w-1/4 p-2 border-r border-gray-300 dark:border-gray-600"></div>
                        <div className="w-1/4 p-2 border-r border-gray-300 dark:border-gray-600"></div>
                        <div className="w-2/4 p-2 border-r border-gray-300 dark:border-gray-600">
                            <div className="mb-1 text-sm text-gray-900 dark:text-gray-100">
                                <span className="font-medium">DRAWN OUR INVOICE NO:</span>
                                <input
                                    type="text"
                                    name="invoiceNo"
                                    value={invoiceData.invoiceNo}
                                    onChange={handleInputChange}
                                    className="w-44 p-1 border border-gray-300 dark:border-gray-600 rounded ml-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                />
                            </div>
                            <div className="mb-1 text-sm text-gray-900 dark:text-gray-100">
                                BY 100% CAD AGAINST ORIGINAL SHIPMENT DOCUMENTS
                            </div>
                            <div className="mb-1 text-sm text-gray-900 dark:text-gray-100">
                                FOR 100% INVOICE VALUE THRU YOUR BANK UPON ARRIVAL OF CONTAINER AT FINAL DESTINATION
                            </div>
                            <div className="mb-1 text-sm text-gray-900 dark:text-gray-100">
                                ESTABLISHED IN FAVOUR OF:-
                            </div>
                            <div className="mb-1 font-medium text-sm text-gray-900 dark:text-gray-100">
                                GANAPATHY METAL SDN.BHD
                            </div>
                            <div className="mb-1 text-sm text-gray-900 dark:text-gray-100">
                                <span className="font-medium">USD A/C NO :</span>
                                <input
                                    type="text"
                                    name="accountNo"
                                    value={invoiceData.accountNo}
                                    onChange={handleInputChange}
                                    className="w-32 p-1 border border-gray-300 dark:border-gray-600 rounded ml-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                />
                            </div>
                            <div className="mb-1 text-sm text-gray-900 dark:text-gray-100">
                                <span className="font-medium">BANK : </span>
                                <input
                                    type="text"
                                    name="bank"
                                    value={invoiceData.bank}
                                    onChange={handleInputChange}
                                    className="w-64 p-1 border border-gray-300 dark:border-gray-600 rounded ml-14 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                />
                            </div>
                            <div className="mb-1 text-xs text-gray-900 dark:text-gray-100">
                                <span className="font-medium text-sm">SWIFT CODE :</span>
                                <input
                                    type="text"
                                    name="swiftCode"
                                    value={invoiceData.swiftCode}
                                    onChange={handleInputChange}
                                    className="w-24 p-0.5 border border-gray-300 dark:border-gray-600 rounded ml-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                />
                            </div>
                        </div>
                        <div className="w-1/4 p-2"></div>
                    </div>

                    {/* Table Row 6 - Container Details */}
                    <div className="flex">
                        <div className="w-1/4 p-2 border-r border-gray-300 dark:border-gray-600"></div>
                        <div className="w-1/4 p-2 border-r border-gray-300 dark:border-gray-600"></div>
                        <div className="w-2/4 p-2 border-r border-gray-300 dark:border-gray-600">
                            <div className="mb-1 text-sm text-gray-900 dark:text-gray-100">
                                SHIPMENT EFFECTED BY TWO 20DV CONTAINER'S
                            </div>
                            <div className="mb-1 text-sm text-gray-900 dark:text-gray-100">
                                <span className="font-medium text-sm">NO:</span>
                                <input
                                    type="text"
                                    name="containerNo1"
                                    value={invoiceData.containerNo1}
                                    onChange={handleInputChange}
                                    placeholder="XXX"
                                    className="w-20 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded ml-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                />
                            </div>
                            <div className="mb-1 text-sm text-gray-900 dark:text-gray-100 ml-8">
                                <input
                                    type="text"
                                    name="containerNo2"
                                    value={invoiceData.containerNo2}
                                    onChange={handleInputChange}
                                    placeholder="XXX"
                                    className="w-20 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                />
                            </div>
                        </div>
                        <div className="w-1/4 p-2"></div>
                    </div>
                    <div className="flex">
                        <div className="w-1/4 p-2 border-r border-gray-300 dark:border-gray-600"></div>
                        <div className="w-1/4 p-2 border-r border-gray-300 dark:border-gray-600"></div>
                        <div className="w-2/4 p-2 border-r border-gray-300 dark:border-gray-600"></div>
                        <div className="w-1/4 p-2">
                            <div className="mb-2 flex justify-end">
                                <div className="flex items-center">
                                    <span className="font-medium text-sm mr-2 text-gray-900 dark:text-gray-100">USD</span>
                                    <input
                                        type="text"
                                        name="amount"
                                        value={invoiceData.amount}
                                        onChange={handleInputChange}
                                        placeholder="XXX"
                                        className="w-24 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Signature Section */}
                <div className="flex justify-end mt-12">
                    <div className="text-right text-gray-900 dark:text-gray-100">
                        <div className="mb-12">for GANAPATHY METAL SDN.BHD.</div>
                        <div className="w-48 ml-auto border-t border-gray-400 dark:border-gray-500 mt-2">
                            MANAGING DIRECTOR
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;