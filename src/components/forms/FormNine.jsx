import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, RotateCcw, Save } from 'lucide-react';

const FormNine = () => {
    const pdfRef = useRef();
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    // Main form data
    const [formData, setFormData] = useState({
        // Section 1
        exporterName: 'GANAPATHY METAL SDN BHD',
        exporterAddress: 'NO.37, PERSIARAN SEGAMBUT TENGAH, SEGAMBUT INDUSTRIAL PARK, 51200 KUALA LUMPUR, MALAYSIA.',
        contactPerson: 'MR R. CHANDRASEGARAN',
        telephone: '603-62577481',
        fax: '603-62510086',
        wasteGenerator: 'GANAPATHY METAL SDN BHD',
        siteOfGeneration: 'NO.37, PERSIARAN SEGAMBUT TENGAH, SEGAMBUT INDUSTRIAL PARK, 51200 KUALA LUMPUR, MALAYSIA.',

        // Section 2
        importerRecycler: 'XX',
        importerContact: '',

        // Section 3
        refNo: 'SALES CONTRACT NO.: GMSB-0016/07/2023',
        movementType: 'SINGLE',

        // Section 4
        shipmentSerial: '',

        // Section 6-15
        disposer: '',
        disposerContact: '',
        disposalSite: '',
        disposerContactInfo: '',
        recoveryMethod: '',
        rCode: '',
        technology: '',
        wasteDescription: 'ALUMINIUM SCRAP TREAD AS PER ISRI',
        physicalCharacteristics: 'SOLID',
        actualQuantity: 'XXX.0KGS',
        wasteIdCode: '',
        baseNo: 'B1010',
        oecdNo: '',
        unNo: '',
        itcHs: '76020010',
        customsCode: '76020010',
        otherCode: '',
        oecdClassification: '',
        oecdNumber: '',
        packingType: '(20 PACKAGES)',
        packingDetails: 'ALUMINIUM SCRAP TREAD AS PER ISRI\n2X20DV CONTAINER\'S\nNET WT:X MT (10 PACKAGES)\nNET WT:XX MT (10 XPACKAGES)',
        unClassification: '',
        unShippingName: '',
        unIdNo: '',
        unClass: '',
        hNumber: '',
        yNumber: '',
        specialHandling: '',
        shipmentDate: '12.09.2023',

        // Exporter declaration
        declarationDate: '12.09.2023',
        declarationName: 'MS.THILAGAWATI',
    });

    // Separate state for carriers
    const [carriers, setCarriers] = useState([
        {
            id: 1,
            type: '1st Carrier',
            name: '',
            registration: '',
            contact: '',
            transport: '',
            date: '',
            signature: ''
        }
    ]);

    // Separate state for importer/recycler section
    const [importerSection, setImporterSection] = useState({
        shipmentReceived: {
            quantity: '',
            date: '',
            name: '',
            signature: ''
        },
        shipmentAtRecycler: {
            quantity: '',
            date: '',
            name: ''
        },
        recyclingDate: '',
        recyclingMethod: '',
        certificationSignature: '',
        certificationDate: '',
        specificConditions: ''
    });

    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCarrierChange = (index, field, value) => {
        setCarriers(prev => prev.map((carrier, i) =>
            i === index ? { ...carrier, [field]: value } : carrier
        ));
    };

    const handleImporterSectionChange = (section, field, value) => {
        setImporterSection(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const addCarrier = () => {
        const nextNumber = carriers.length + 1;
        const carrierTypes = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
        const nextType = `${carrierTypes[nextNumber - 1] || `${nextNumber}th`} Carrier`;

        const newCarrier = {
            id: Date.now(),
            type: nextType,
            name: '',
            registration: '',
            contact: '',
            transport: '',
            date: '',
            signature: ''
        };

        setCarriers(prev => [...prev, newCarrier]);
    };

    const removeCarrier = (index) => {
        if (carriers.length > 1) {
            setCarriers(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handlePDFDownload = async () => {
        if (isGeneratingPDF) return;

        setIsGeneratingPDF(true);
        const element = pdfRef.current;

        if (!element) {
            console.error('PDF reference not found');
            setIsGeneratingPDF(false);
            return;
        }

        try {
            // Create a temporary container for PDF generation
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'fixed';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            tempContainer.style.width = element.offsetWidth + 'px';
            tempContainer.style.visibility = 'hidden';

            // Clone the element
            const clone = element.cloneNode(true);
            tempContainer.appendChild(clone);
            document.body.appendChild(tempContainer);

            // Replace inputs with plain text for PDF
            const inputs = clone.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                const span = document.createElement('span');
                span.textContent = input.value || ' ';
                span.style.display = 'inline-block';
                span.style.width = '100%';
                span.style.minHeight = '20px';
                span.style.padding = '2px 4px';
                span.style.border = 'none';
                span.style.borderBottom = 'none';
                span.style.fontFamily = 'inherit';
                span.style.fontSize = 'inherit';
                span.style.lineHeight = '1.4';
                span.style.verticalAlign = 'top';
                span.style.whiteSpace = 'pre-wrap';
                span.style.wordWrap = 'break-word';
                span.style.color = '#000';
                span.style.backgroundColor = 'transparent';

                input.parentNode.replaceChild(span, input);
            });

            // Hide all buttons
            const buttons = clone.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.display = 'none';
            });

            // Make the clone visible for capture
            tempContainer.style.visibility = 'visible';

            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                removeContainer: true,
            });

            // Clean up temporary container
            document.body.removeChild(tempContainer);

            const imgData = canvas.toDataURL('image/png');

            // Use A4 format
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Add padding on all sides (10mm on each side)
            const padding = 10; // mm
            const contentWidth = imgWidth - (padding * 2);
            const contentHeight = (imgHeight * contentWidth) / imgWidth;

            let heightLeft = imgHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'PNG', padding, padding, contentWidth, contentHeight, '', 'FAST');
            heightLeft -= pageHeight;

            // Add additional pages if content is too long
            while (heightLeft >= -padding) { // Changed condition to account for padding
                position = heightLeft - imgHeight + padding;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', padding, position, contentWidth, contentHeight, '', 'FAST');
                heightLeft -= pageHeight;
            }

            pdf.save(`Form9-${new Date().toISOString().split('T')[0]}.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleSave = () => {
        console.log('Saving form data...');
        alert('Form saved successfully!');
    };

    const handleReset = () => {
        setFormData({
            exporterName: 'GANAPATHY METAL SDN BHD',
            exporterAddress: 'NO.37, PERSIARAN SEGAMBUT TENGAH, SEGAMBUT INDUSTRIAL PARK, 51200 KUALA LUMPUR, MALAYSIA.',
            contactPerson: 'MR R. CHANDRASEGARAN',
            telephone: '603-62577481',
            fax: '603-62510086',
            wasteGenerator: 'GANAPATHY METAL SDN BHD',
            siteOfGeneration: 'NO.37, PERSIARAN SEGAMBUT TENGAH, SEGAMBUT INDUSTRIAL PARK, 51200 KUALA LUMPUR, MALAYSIA.',
            importerRecycler: 'XX',
            importerContact: '',
            refNo: 'SALES CONTRACT NO.: GMSB-0016/07/2023',
            movementType: 'SINGLE',
            shipmentSerial: '',
            disposer: '',
            disposerContact: '',
            disposalSite: '',
            disposerContactInfo: '',
            recoveryMethod: '',
            rCode: '',
            technology: '',
            wasteDescription: 'ALUMINIUM SCRAP TREAD AS PER ISRI',
            physicalCharacteristics: 'SOLID',
            actualQuantity: 'XXX.0KGS',
            wasteIdCode: '',
            baseNo: 'B1010',
            oecdNo: '',
            unNo: '',
            itcHs: '76020010',
            customsCode: '76020010',
            otherCode: '',
            oecdClassification: '',
            oecdNumber: '',
            packingType: '(20 PACKAGES)',
            packingDetails: 'ALUMINIUM SCRAP TREAD AS PER ISRI\n2X20DV CONTAINER\'S\nNET WT:X MT (10 PACKAGES)\nNET WT:XX MT (10 XPACKAGES)',
            unClassification: '',
            unShippingName: '',
            unIdNo: '',
            unClass: '',
            hNumber: '',
            yNumber: '',
            specialHandling: '',
            shipmentDate: '12.09.2023',
            declarationDate: '12.09.2023',
            declarationName: 'MS.THILAGAWATI',
        });
        setCarriers([{
            id: 1,
            type: '1st Carrier',
            name: '',
            registration: '',
            contact: '',
            transport: '',
            date: '',
            signature: ''
        }]);
        setImporterSection({
            shipmentReceived: {
                quantity: '',
                date: '',
                name: '',
                signature: ''
            },
            shipmentAtRecycler: {
                quantity: '',
                date: '',
                name: ''
            },
            recyclingDate: '',
            recyclingMethod: '',
            certificationSignature: '',
            certificationDate: '',
            specificConditions: ''
        });
    };

    const renderTableRow = (number, description, details, fullWidth = false) => (
        <tr className="border-b border-gray-300 dark:border-gray-600">
            <td className="px-4 py-2 font-medium bg-gray-50 dark:bg-gray-700 w-16 align-top text-gray-900 dark:text-gray-100">
                {number}
            </td>
            <td className="px-4 py-2 font-medium bg-gray-50 dark:bg-gray-700 align-top w-1/3 text-gray-900 dark:text-gray-100">
                {description}
            </td>
            <td className={`px-4 py-2 ${fullWidth ? 'w-full' : 'w-2/3'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}>
                {details}
            </td>
        </tr>
    );

    const renderSubRow = (description, details) => (
        <tr className="border-b border-gray-300 dark:border-gray-600">
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2 font-medium bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                {description}
            </td>
            <td className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                {details}
            </td>
        </tr>
    );

    const renderCarrierSection = (carrier, index) => (
        <div key={carrier.id} className="mb-1 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{carrier.type} (name, address)</h4>
                <div className="flex items-center space-x-3 mt-2">
                    <button
                        type="button"
                        onClick={addCarrier}
                        className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded transition-colors flex items-center space-x-2"
                    >
                        <span>+</span>
                        <span>Add</span>
                    </button>

                    {carriers.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeCarrier(index)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded transition-colors text-sm"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>
            <div className="space-y-3">
                <input
                    type="text"
                    value={carrier.name}
                    onChange={(e) => handleCarrierChange(index, 'name', e.target.value)}
                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Name & Address"
                    style={{ boxSizing: 'border-box' }}
                />
                <input
                    type="text"
                    value={carrier.registration}
                    onChange={(e) => handleCarrierChange(index, 'registration', e.target.value)}
                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Registration number"
                    style={{ boxSizing: 'border-box' }}
                />
                <input
                    type="text"
                    value={carrier.contact}
                    onChange={(e) => handleCarrierChange(index, 'contact', e.target.value)}
                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Tel/fax"
                    style={{ boxSizing: 'border-box' }}
                />
                <input
                    type="text"
                    value={carrier.transport}
                    onChange={(e) => handleCarrierChange(index, 'transport', e.target.value)}
                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Identity of Means of Transport (3)"
                    style={{ boxSizing: 'border-box' }}
                />
                <input
                    type="text"
                    value={carrier.date}
                    onChange={(e) => handleCarrierChange(index, 'date', e.target.value)}
                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Date of Transfer"
                    style={{ boxSizing: 'border-box' }}
                />
                <input
                    type="text"
                    value={carrier.signature}
                    onChange={(e) => handleCarrierChange(index, 'signature', e.target.value)}
                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Signature of Carrier's representative"
                    style={{ boxSizing: 'border-box' }}
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-300">
            <div ref={pdfRef} className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden relative transition-colors duration-300">
                {/* Header with Buttons */}
                <div className="bg-blue-800 dark:bg-blue-900 text-white p-2.5 transition-colors duration-300">
                    <div className="flex justify-between items-center">
                        {/* Left side - Form Title */}
                        <div className="flex-1 ml-3">
                            <div className="flex items-baseline space-x-3">
                                <h1 className="text-xl font-bold text-white">FORM 9</h1>
                                <p className="text-xs italic mt-1 text-white">
                                    [see rules 15 (5) and 16 (5)]
                                </p>
                            </div>
                            <h2 className="text-xs font-semibold text-white">
                                TRANSBOUNDARY MOVEMENT -- MOVEMENT DOCUMENT
                            </h2>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={handleSave}
                                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-800 text-blue-600 dark:text-blue-300 rounded text-xs font-medium flex items-center hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors duration-200"
                            >
                                <Save className="w-4 h-4 mr-2" /> Save
                            </button>
                            <button
                                className="px-3 py-1 bg-green-50 dark:bg-green-800 text-green-600 dark:text-green-300 rounded text-xs font-medium flex items-center hover:bg-green-100 dark:hover:bg-green-700 transition-colors duration-200"
                                onClick={handleReset}
                            >
                                <RotateCcw className="w-4 h-4 mr-2" /> Reset
                            </button>
                            <button
                                className={`px-3 py-1 bg-purple-50 dark:bg-purple-800 text-purple-600 dark:text-purple-300 rounded text-xs font-medium flex items-center hover:bg-purple-100 dark:hover:bg-purple-700 transition-colors duration-200 ${isGeneratingPDF ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handlePDFDownload}
                                disabled={isGeneratingPDF}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                <span>{isGeneratingPDF ? 'Generating...' : 'PDF'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Form Table */}
                <div className="p-6">
                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
                        <tbody>
                            {/* Section 1 */}
                            {renderTableRow(
                                '1.',
                                '(i) Exporter (Name & Address)',
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-gray-100">{formData.exporterName}</div>
                                    <div className="whitespace-pre-line text-gray-900 dark:text-gray-100">{formData.exporterAddress}</div>
                                </div>
                            )}
                            {[
                                { label: 'Contact person', field: 'contactPerson' },
                                { label: 'Tel./Fax', type: 'telfax' }, // special case
                                { label: '(ii) Waste Generator (name and address) (1)', field: 'wasteGenerator' },
                                { label: 'Contact person with Tel./Fax', field: 'contactPerson' },
                                { label: 'Site of generation', field: 'siteOfGeneration' },
                            ].map(({ label, field, type }) =>
                                renderSubRow(
                                    label,
                                    type === 'telfax' ? (
                                        <div className="flex space-x-4 items-center">
                                            <input
                                                type="text"
                                                value={formData.telephone}
                                                onChange={(e) => handleInputChange(null, 'telephone', e.target.value)}
                                                className="flex-1 px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                                placeholder="Telephone"
                                            />
                                            <span className="text-gray-900 dark:text-gray-100">/</span>
                                            <input
                                                type="text"
                                                value={formData.fax}
                                                onChange={(e) => handleInputChange(null, 'fax', e.target.value)}
                                                className="flex-1 px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                                placeholder="Fax"
                                            />
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData[field] || ''}
                                            onChange={(e) => handleInputChange(null, field, e.target.value)}
                                            className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                        />
                                    )
                                )
                            )}

                            {/* Section 2 */}
                            {renderTableRow(
                                '2',
                                'Importer/recycler (name & address)',
                                <input
                                    type="text"
                                    value={formData.importerRecycler}
                                    onChange={(e) => handleInputChange(null, 'importerRecycler', e.target.value)}
                                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{ boxSizing: 'border-box' }}
                                />
                            )}
                            {renderSubRow(
                                'Contact person with Tel./Fax',
                                <input
                                    type="text"
                                    value={formData.importerContact}
                                    onChange={(e) => handleInputChange(null, 'importerContact', e.target.value)}
                                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{ boxSizing: 'border-box' }}
                                />
                            )}

                            {/* Section 3 */}
                            {renderTableRow(
                                '3.',
                                'Corresponding to applicant Ref. No.',
                                <input
                                    type="text"
                                    value={formData.refNo}
                                    onChange={(e) => handleInputChange(null, 'refNo', e.target.value)}
                                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{ boxSizing: 'border-box' }}
                                />
                            )}
                            {renderSubRow(
                                'Movement subject to single /multiple',
                                <input
                                    type="text"
                                    value={formData.movementType}
                                    onChange={(e) => handleInputChange(null, 'movementType', e.target.value)}
                                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{ boxSizing: 'border-box' }}
                                />
                            )}

                            {/* Section 4 */}
                            {renderTableRow(
                                '4.',
                                'Serial number of shipment',
                                <input
                                    type="text"
                                    value={formData.shipmentSerial}
                                    onChange={(e) => handleInputChange(null, 'shipmentSerial', e.target.value)}
                                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{ boxSizing: 'border-box' }}
                                />
                            )}

                            {/* Section 5 - Dynamic Carriers */}
                            {renderTableRow(
                                '5',
                                'Carriers',
                                <div>
                                    {carriers.map((carrier, index) => renderCarrierSection(carrier, index))}
                                </div>
                            )}

                            {/* Section 6 */}
                            {renderTableRow(
                                '6',
                                'Disposer (name, address)',
                                <input
                                    type="text"
                                    value={formData.disposer}
                                    onChange={(e) => handleInputChange(null, 'disposer', e.target.value)}
                                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{ boxSizing: 'border-box' }}
                                />
                            )}
                            {[
                                { label: 'Contact person', field: 'disposerContact' },
                                { label: 'Actual site of disposal', field: 'disposalSite' },
                                { label: 'Tel/fax', field: 'disposerContactInfo' },
                            ].map(({ label, field }) =>
                                renderSubRow(
                                    label,
                                    <input
                                        type="text"
                                        value={formData[field]}
                                        onChange={(e) => handleInputChange(null, field, e.target.value)}
                                        className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                        style={{ boxSizing: 'border-box' }}
                                    />
                                )
                            )}

                            {/* Section 7 */}
                            {renderTableRow(
                                '7',
                                'Method(s) of recovery',
                                <input
                                    type="text"
                                    value={formData.recoveryMethod}
                                    onChange={(e) => handleInputChange(null, 'recoveryMethod', e.target.value)}
                                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{ boxSizing: 'border-box' }}
                                />
                            )}
                            {[
                                { label: 'R code', field: 'rCode' },
                                { label: 'Technology employed** (Attach details if necessary)', field: 'technology' },
                            ].map(({ label, field }) =>
                                renderSubRow(
                                    label,
                                    <input
                                        type="text"
                                        value={formData[field]}
                                        onChange={(e) => handleInputChange(null, field, e.target.value)}
                                        className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                        style={{ boxSizing: 'border-box' }}
                                    />
                                )
                            )}

                            {/* Section 8 */}
                            {renderTableRow(
                                '8',
                                'Designation and chemical composition of the waste',
                                <input
                                    type="text"
                                    value={formData.wasteDescription}
                                    onChange={(e) => handleInputChange(null, 'wasteDescription', e.target.value)}
                                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{ boxSizing: 'border-box' }}
                                />
                            )}

                            {/* Section 9 */}
                            {renderTableRow(
                                '9',
                                'Physical characteristics (3)',
                                <input
                                    type="text"
                                    value={formData.physicalCharacteristics}
                                    onChange={(e) => handleInputChange(null, 'physicalCharacteristics', e.target.value)}
                                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{ boxSizing: 'border-box' }}
                                />
                            )}

                            {/* Section 10 */}
                            {renderTableRow(
                                '10',
                                'Actual quantity Kg/liter',
                                <input
                                    type="text"
                                    value={formData.actualQuantity}
                                    onChange={(e) => handleInputChange(null, 'actualQuantity', e.target.value)}
                                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{ boxSizing: 'border-box' }}
                                />
                            )}

                            {/* Section 11 */}
                            {renderTableRow(
                                '11',
                                'Waste identification code',
                                <input
                                    type="text"
                                    value={formData.wasteIdCode}
                                    onChange={(e) => handleInputChange(null, 'wasteIdCode', e.target.value)}
                                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{ boxSizing: 'border-box' }}
                                />
                            )}
                            {[
                                { label: 'Base No.', field: 'baseNo' },
                                { label: 'OECD No.', field: 'oecdNo' },
                                { label: 'UN No.', field: 'unNo' },
                                { label: 'ITC (HS)', field: 'itcHs' },
                                { label: 'Customs Code (U.S)', field: 'customsCode' },
                                { label: 'Other (specify)', field: 'otherCode' },
                            ].map(({ label, field }) =>
                                renderSubRow(
                                    label,
                                    <input
                                        type="text"
                                        value={formData[field]}
                                        onChange={(e) => handleInputChange(null, field, e.target.value)}
                                        className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                        style={{ boxSizing: 'border-box' }}
                                    />
                                )
                            )}

                            {/* Section 12 */}
                            {renderTableRow(
                                '12',
                                'OECD Classification (2)',
                                <input
                                    type="text"
                                    value={formData.oecdClassification}
                                    onChange={(e) => handleInputChange(null, 'oecdClassification', e.target.value)}
                                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{ boxSizing: 'border-box' }}
                                />
                            )}

                            {/* Section 13 */}
                            {renderTableRow(
                                '13',
                                'Packing Type (3)',
                                <input
                                    type="text"
                                    value={formData.packingType}
                                    onChange={(e) => handleInputChange(null, 'packingType', e.target.value)}
                                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{ boxSizing: 'border-box' }}
                                />
                            )}
                            {[
                                { label: 'Number', field: 'packingDetails' }
                            ].map(({ label, field }) =>
                                renderSubRow(
                                    label,
                                    <input
                                        type="text"
                                        value={formData[field]}
                                        onChange={(e) => handleInputChange(null, field, e.target.value)}
                                        className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                        style={{ boxSizing: 'border-box' }}
                                    />
                                )
                            )}

                            {/* Section 14 */}
                            {renderTableRow(
                                '14',
                                'UN Classification',
                                <input
                                    type="text"
                                    value={formData.unClassification}
                                    onChange={(e) => handleInputChange(null, 'unClassification', e.target.value)}
                                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{ boxSizing: 'border-box' }}
                                />
                            )}
                            {[
                                { label: 'UN Shipping name', field: 'unShippingName' },
                                { label: 'UN identification No.', field: 'unIdNo' },
                                { label: 'UN Class (3)', field: 'unClass' },
                                { label: 'H Number', field: 'hNumber' },
                                { label: 'Y Number', field: 'yNumber' },
                            ].map(({ label, field }) =>
                                renderSubRow(
                                    label,
                                    <input
                                        type="text"
                                        value={formData[field]}
                                        onChange={(e) => handleInputChange(null, field, e.target.value)}
                                        className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                        style={{ boxSizing: 'border-box' }}
                                    />
                                )
                            )}

                            {/* Section 15 */}
                            {renderTableRow(
                                '15',
                                'Special handling requirements',
                                <input
                                    type="text"
                                    value={formData.specialHandling}
                                    onChange={(e) => handleInputChange(null, 'specialHandling', e.target.value)}
                                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{ boxSizing: 'border-box' }}
                                />
                            )}

                            {/* Section 16 */}
                            {renderTableRow(
                                '16',
                                'Actual date of shipment',
                                <input
                                    type="text"
                                    value={formData.shipmentDate}
                                    onChange={(e) => handleInputChange(null, 'shipmentDate', e.target.value)}
                                    className="w-full px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400"
                                    style={{ boxSizing: 'border-box' }}
                                />
                            )}

                            {/* Section 17 - Exporter's Declaration */}
                            {renderTableRow(
                                '17',
                                'Exporter\'s declaration:',
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-900 dark:text-gray-100">
                                        I certify that the information in SI. No. 1 of 16 above is complete and correct to my best knowledge.
                                        I also certify that legally-enforceable written contractual obligation have been entered into, that
                                        any applicable insurance or other financial guarantees are in force covering the transboundary movement
                                        and that all necessary authorizations have been received from the competent authorities of the States concerned.
                                    </p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-gray-900 dark:text-gray-100">Date: {formData.declarationDate}</span>
                                        <div className="text-right">
                                            <div className="border-t border-gray-300 dark:border-gray-600 mt-8 pt-2 w-48 text-gray-900 dark:text-gray-100">
                                                Signature:
                                            </div>
                                            <div className="text-gray-900 dark:text-gray-100">Name: {formData.declarationName}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </tbody>
                    </table>

                    {/* Importer/Recycler Section */}
                    <div className="mt-2">
                        <div className="bg-blue-800 dark:bg-blue-900 text-white p-2 font-bold text-sm transition-colors duration-300">
                            TO BE COMPLETED BY IMPORTER/RECYCLER
                        </div>

                        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm mt-2">
                            <tbody>
                                {renderTableRow(
                                    '18.',
                                    'Shipment received by Importer/Recycler',
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-900 dark:text-gray-100">Quantity received</span>
                                            <input
                                                type="text"
                                                value={importerSection.shipmentReceived.quantity}
                                                onChange={(e) => handleImporterSectionChange('shipmentReceived', 'quantity', e.target.value)}
                                                className="px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400 w-24"
                                                placeholder="Kg/liters"
                                                style={{ boxSizing: 'border-box' }}
                                            />
                                        </div>
                                        <div className="flex space-x-3">
                                            <input
                                                type="text"
                                                value={importerSection.shipmentReceived.date}
                                                onChange={(e) => handleImporterSectionChange('shipmentReceived', 'date', e.target.value)}
                                                className="px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400 flex-1"
                                                placeholder="Date"
                                                style={{ boxSizing: 'border-box' }}
                                            />
                                            <input
                                                type="text"
                                                value={importerSection.shipmentReceived.name}
                                                onChange={(e) => handleImporterSectionChange('shipmentReceived', 'name', e.target.value)}
                                                className="px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400 flex-1"
                                                placeholder="Name"
                                                style={{ boxSizing: 'border-box' }}
                                            />
                                            <input
                                                type="text"
                                                value={importerSection.shipmentReceived.signature}
                                                onChange={(e) => handleImporterSectionChange('shipmentReceived', 'signature', e.target.value)}
                                                className="px-2 py-1 border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[28px] placeholder-gray-500 dark:placeholder-gray-400 flex-1"
                                                placeholder="Signature"
                                                style={{ boxSizing: 'border-box' }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Notes Section */}
                    <div className="mt-6 text-xs text-gray-600 dark:text-gray-400">
                        <p><strong>Notes:</strong> (1) Attach list, if more than one; (2) Enter X in appropriate box; (3) See codes on the reverse (x) Immediately contact Competent Authority; (4) if more than three carriers, attach information as required in SL. No. 5.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormNine;